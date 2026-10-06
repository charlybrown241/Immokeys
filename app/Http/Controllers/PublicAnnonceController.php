<?php

namespace App\Http\Controllers;

use App\Http\Requests\AnnonceFilterRequest;
use App\Models\Annonce;
use App\Models\Category;
use App\Models\ContactLog;
use App\Models\User;
use App\Support\AnnonceCard;
use App\Support\WhatsappContact;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicAnnonceController extends Controller
{
    /**
     * Publicly search available annonces, open to guests and students alike.
     */
    public function index(AnnonceFilterRequest $request): Response
    {
        $filters = $request->validated();
        $filters['city'] = $filters['city'] ?? 'Casablanca';

        $user = $request->user();

        $annonces = Annonce::query()
            ->where('status', 'disponible')
            ->where('is_suspended', false)
            ->with(AnnonceCard::RELATIONS)
            ->filter($filters)
            ->tap(fn ($query) => $this->applySort($query, $filters['sort'] ?? 'recent'))
            ->paginate(12)
            ->withQueryString()
            ->through(fn (Annonce $annonce) => AnnonceCard::toArray($annonce, $user));

        return Inertia::render('Annonces/Index', [
            'annonces' => $annonces,
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'filters' => $filters,
        ]);
    }

    /**
     * Display an available annonce's detail page, tracking one view per session.
     */
    public function show(Request $request, Annonce $annonce): Response
    {
        abort_if($annonce->status === 'en_attente' || $annonce->is_suspended, 404);

        $annonce->load([
            'photos' => fn ($query) => $query->orderBy('ordre'),
            'category:id,name',
            'user:id,name,is_verified,phone',
            'user.subscription:id,user_id,type,expires_at',
        ]);

        $viewedAnnonces = $request->session()->get('viewed_annonces', []);

        if (! in_array($annonce->id, $viewedAnnonces, true)) {
            $annonce->increment('views_count');
            $request->session()->push('viewed_annonces', $annonce->id);
        }

        return Inertia::render('Annonces/Show', [
            'annonce' => [
                'id' => $annonce->id,
                'title' => $annonce->title,
                'description' => $annonce->description,
                'quartier' => $annonce->quartier,
                'city' => $annonce->city,
                'surface' => $annonce->surface,
                'price' => $annonce->price,
                'status' => $annonce->status,
                'category' => $annonce->category,
                'photos' => $annonce->photos,
                'published_at' => $annonce->created_at?->toDateString(),
                'is_certified_pro' => $annonce->ownerIsCertifiedPro(),
                'owner_name' => $this->publicOwnerName($annonce),
                'owner_is_verified' => (bool) $annonce->user?->is_verified,
                'whatsapp_contact' => WhatsappContact::stateFor($request->user(), $annonce),
            ],
            'similar' => $this->similar($annonce, $request->user()),
        ]);
    }

    /**
     * Sort options of the search page; ties fall back to the newest first.
     */
    private function applySort(Builder $query, string $sort): void
    {
        match ($sort) {
            'price_asc' => $query->orderBy('price'),
            'price_desc' => $query->orderByDesc('price'),
            'surface_desc' => $query->orderByRaw('surface IS NULL')->orderByDesc('surface'),
            default => null,
        };

        $query->latest()->orderByDesc('id');
    }

    /**
     * Up to four other visible annonces: same quartier first, then same
     * category, closest in price.
     *
     * @return array<int, array<string, mixed>>
     */
    private function similar(Annonce $annonce, ?User $viewer): array
    {
        return Annonce::query()
            ->where('status', 'disponible')
            ->where('is_suspended', false)
            ->where('city', $annonce->city)
            ->whereKeyNot($annonce->id)
            ->where(fn ($query) => $query
                ->where('quartier', $annonce->quartier)
                ->orWhere('category_id', $annonce->category_id))
            ->with(AnnonceCard::RELATIONS)
            ->orderByRaw('CASE WHEN quartier = ? THEN 0 ELSE 1 END', [$annonce->quartier])
            ->orderByRaw('ABS(price - ?)', [$annonce->price])
            ->limit(4)
            ->get()
            ->map(fn (Annonce $similar) => AnnonceCard::toArray($similar, $viewer))
            ->all();
    }

    /**
     * Verify the signed link, log the contact, and hand off to WhatsApp
     * with a prefilled message. The "signed" middleware already rejects
     * a missing/expired/tampered signature before this method runs.
     */
    public function contactWhatsapp(Request $request, Annonce $annonce): RedirectResponse
    {
        abort_unless($annonce->status === 'disponible' && ! $annonce->is_suspended, 404);

        $owner = $annonce->user;

        abort_if(blank($owner?->phone), 404);

        ContactLog::create([
            'user_id' => $request->user()->id,
            'annonce_id' => $annonce->id,
        ]);

        $message = "Bonjour, je suis intéressé(e) par votre annonce '{$annonce->title}' à {$annonce->quartier} (".route('annonces.show', $annonce->id).').';
        $phone = preg_replace('/[^0-9]/', '', $owner->phone);

        return redirect()->away("https://wa.me/{$phone}?text=".urlencode($message));
    }

    /**
     * The detail page is public, so only the landlord's first name and last
     * initial are exposed ("Karim Benali" -> "Karim B.").
     */
    private function publicOwnerName(Annonce $annonce): ?string
    {
        $parts = preg_split('/\s+/', trim((string) $annonce->user?->name), -1, PREG_SPLIT_NO_EMPTY);

        if ($parts === []) {
            return null;
        }

        $firstName = array_shift($parts);

        return $parts === []
            ? $firstName
            : $firstName.' '.mb_strtoupper(mb_substr(end($parts), 0, 1)).'.';
    }
}
