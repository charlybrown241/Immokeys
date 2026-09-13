<?php

namespace App\Http\Controllers;

use App\Http\Requests\AnnonceFilterRequest;
use App\Models\Annonce;
use App\Models\Category;
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
            'user:id,is_verified',
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
            ],
        ]);
    }

    /**
     * A landlord is shown as certified once their identity is verified
     * and they hold an active "pro" subscription.
     */
    private function isCertifiedPro(Annonce $annonce): bool
    {
        return (bool) $annonce->user?->is_verified && $annonce->user?->subscription?->type === 'pro';
    }
}
