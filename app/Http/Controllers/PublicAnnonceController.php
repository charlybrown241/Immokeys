<?php

namespace App\Http\Controllers;

use App\Http\Requests\AnnonceFilterRequest;
use App\Models\Annonce;
use App\Models\Category;
use App\Models\ContactLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
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
        $city = $filters['city'] ?? 'Casablanca';

        $annonces = Annonce::query()
            ->where('status', 'disponible')
            ->with(['mainPhoto', 'category:id,name', 'user:id,is_verified', 'user.subscription:id,user_id,type'])
            ->when($city, fn ($query, $value) => $query->where('city', $value))
            ->when($filters['quartier'] ?? null, fn ($query, $value) => $query->where('quartier', 'like', "%{$value}%"))
            ->when($filters['category_id'] ?? null, fn ($query, $value) => $query->where('category_id', $value))
            ->when($filters['min_price'] ?? null, fn ($query, $value) => $query->where('price', '>=', $value))
            ->when($filters['max_price'] ?? null, fn ($query, $value) => $query->where('price', '<=', $value))
            ->when($filters['min_surface'] ?? null, fn ($query, $value) => $query->where('surface', '>=', $value))
            ->when($filters['max_surface'] ?? null, fn ($query, $value) => $query->where('surface', '<=', $value))
            ->latest()
            ->paginate(12)
            ->withQueryString()
            ->through(fn (Annonce $annonce) => [
                'id' => $annonce->id,
                'title' => $annonce->title,
                'quartier' => $annonce->quartier,
                'city' => $annonce->city,
                'surface' => $annonce->surface,
                'price' => $annonce->price,
                'main_photo' => $annonce->mainPhoto,
                'category' => $annonce->category,
                'is_certified_pro' => $this->isCertifiedPro($annonce),
            ]);

        return Inertia::render('Annonces/Index', [
            'annonces' => $annonces,
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'filters' => array_merge(['city' => $city], $filters),
        ]);
    }

    /**
     * Display an available annonce's detail page, tracking one view per session.
     */
    public function show(Request $request, Annonce $annonce): Response
    {
        abort_if($annonce->status === 'en_attente', 404);

        $annonce->load([
            'photos' => fn ($query) => $query->orderBy('ordre'),
            'category:id,name',
            'user:id,is_verified,phone',
            'user.subscription:id,user_id,type',
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
                'is_certified_pro' => $this->isCertifiedPro($annonce),
                'whatsapp_contact' => $this->whatsappContactState($request, $annonce),
            ],
        ]);
    }

    /**
     * Verify the signed link, log the contact, and hand off to WhatsApp
     * with a prefilled message. The "signed" middleware already rejects
     * a missing/expired/tampered signature before this method runs.
     */
    public function contactWhatsapp(Request $request, Annonce $annonce): RedirectResponse
    {
        abort_unless($annonce->status === 'disponible', 404);

        $owner = $annonce->user;

        abort_if(blank($owner?->phone), 404);

        ContactLog::create([
            'user_id' => $request->user()->id,
            'annonce_id' => $annonce->id,
        ]);

        $message = "Bonjour, je suis interesse(e) par votre annonce '{$annonce->title}' a {$annonce->quartier} (".route('annonces.show', $annonce->id).').';
        $phone = preg_replace('/[^0-9]/', '', $owner->phone);

        return redirect()->away("https://wa.me/{$phone}?text=".urlencode($message));
    }

    /**
     * A landlord is shown as certified once their identity is verified
     * and they hold an active "pro" subscription.
     */
    private function isCertifiedPro(Annonce $annonce): bool
    {
        return (bool) $annonce->user?->is_verified && $annonce->user?->subscription?->type === 'pro';
    }

    /**
     * Decide what the "Contacter sur WhatsApp" button should do: generate
     * a short-lived signed link when everything checks out, or report why
     * it can't (guest, wrong role, unavailable annonce, missing phone).
     */
    private function whatsappContactState(Request $request, Annonce $annonce): array
    {
        $user = $request->user();

        if (! $user) {
            return ['status' => 'guest'];
        }

        if ($user->role?->name !== 'etudiant') {
            return ['status' => 'wrong_role'];
        }

        if ($annonce->status !== 'disponible') {
            return ['status' => 'unavailable'];
        }

        if (blank($annonce->user?->phone)) {
            return ['status' => 'missing_phone'];
        }

        return [
            'status' => 'ready',
            'url' => URL::temporarySignedRoute(
                'annonces.contact-whatsapp',
                now()->addMinutes(5),
                ['annonce' => $annonce->id],
            ),
        ];
    }
}
