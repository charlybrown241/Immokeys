<?php

namespace App\Http\Controllers;

use App\Http\Requests\AnnonceStoreRequest;
use App\Http\Requests\AnnonceUpdateRequest;
use App\Models\Annonce;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AnnonceController extends Controller
{
    /**
     * Display the authenticated landlord's own annonces.
     */
    public function index(Request $request): Response
    {
        $annonces = $request->user()->annonces()
            ->with('photos')
            ->latest()
            ->get();

        return Inertia::render('Annonces/Manage/Index', [
            'annonces' => $annonces,
        ]);
    }

    /**
     * Display the annonce creation form, reserved for certified landlords.
     */
    public function create(Request $request): Response|RedirectResponse
    {
        if ($request->user()->cannot('create', Annonce::class)) {
            return redirect()->route('dashboard')->with(
                'error',
                "Vous devez d'abord faire certifier votre identite (piece CIN) avant de pouvoir publier une annonce."
            );
        }

        return Inertia::render('Annonces/Manage/Create', [
            'categories' => Category::orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created annonce, along with any uploaded photos.
     */
    public function store(AnnonceStoreRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            $annonce = $request->user()->annonces()->create([
                ...$request->safe()->only([
                    'title', 'category_id', 'description', 'quartier', 'surface', 'price',
                ]),
                'city' => 'Casablanca',
                'status' => 'en_attente',
            ]);

            foreach ($request->file('photos', []) as $index => $photo) {
                $annonce->photos()->create([
                    'path' => $photo->store('annonces', 'public'),
                    'ordre' => $index,
                ]);
            }
        });

        return redirect()->route('annonces.mine')->with('success', 'Annonce creee avec succes.');
    }

    /**
     * Display the form to edit an annonce owned by the authenticated landlord.
     */
    public function edit(Annonce $annonce): Response
    {
        Gate::authorize('update', $annonce);

        return Inertia::render('Annonces/Manage/Edit', [
            'annonce' => $annonce->load('photos'),
            'categories' => Category::orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Update an annonce owned by the authenticated landlord.
     */
    public function update(AnnonceUpdateRequest $request, Annonce $annonce): RedirectResponse
    {
        $annonce->update($request->validated());

        return redirect()->route('annonces.mine')->with('success', 'Annonce mise a jour.');
    }

    /**
     * Delete an annonce (and its photos) owned by the authenticated landlord.
     */
    public function destroy(Annonce $annonce): RedirectResponse
    {
        Gate::authorize('delete', $annonce);

        foreach ($annonce->photos as $photo) {
            Storage::disk('public')->delete($photo->path);
        }

        $annonce->delete();

        return redirect()->route('annonces.mine')->with('success', 'Annonce supprimee.');
    }
}
