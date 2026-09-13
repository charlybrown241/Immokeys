<?php

namespace App\Http\Controllers;

use App\Http\Requests\AnnonceFilterRequest;
use App\Models\Annonce;
use App\Models\Category;
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
            ->with(['mainPhoto', 'category:id,name'])
            ->when($city, fn ($query, $value) => $query->where('city', $value))
            ->when($filters['quartier'] ?? null, fn ($query, $value) => $query->where('quartier', 'like', "%{$value}%"))
            ->when($filters['category_id'] ?? null, fn ($query, $value) => $query->where('category_id', $value))
            ->when($filters['min_price'] ?? null, fn ($query, $value) => $query->where('price', '>=', $value))
            ->when($filters['max_price'] ?? null, fn ($query, $value) => $query->where('price', '<=', $value))
            ->when($filters['min_surface'] ?? null, fn ($query, $value) => $query->where('surface', '>=', $value))
            ->when($filters['max_surface'] ?? null, fn ($query, $value) => $query->where('surface', '<=', $value))
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Annonces/Index', [
            'annonces' => $annonces,
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'filters' => array_merge(['city' => $city], $filters),
        ]);
    }
}
