<?php

namespace App\Http\Controllers;

use App\Models\Annonce;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnnonceController extends Controller
{
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

        return Inertia::render('Annonces/Create');
    }
}
