<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionController extends Controller
{
    /**
     * Display the authenticated user's subscription status and options.
     */
    public function show(Request $request): Response
    {
        return Inertia::render('Subscription/Show', [
            'subscription' => $request->user()->subscription,
        ]);
    }

    /**
     * Simulate upgrading a student's free account to Premium for one month.
     */
    public function upgradeToPremium(Request $request): RedirectResponse
    {
        $user = $request->user();

        abort_unless($user->role?->name === 'etudiant', 403);

        $user->subscription()->update([
            'type' => 'premium',
            'started_at' => now(),
            'expires_at' => now()->addMonth(),
        ]);

        return back()->with('success', 'Abonnement Premium active (simulation).');
    }

    /**
     * Simulate manually renewing a landlord's Pro subscription.
     */
    public function renewPro(Request $request): RedirectResponse
    {
        $user = $request->user();

        abort_unless($user->role?->name === 'proprietaire', 403);

        $user->subscription()->update([
            'expires_at' => now()->addYear(),
        ]);

        return back()->with('success', 'Abonnement Pro renouvele (simulation).');
    }
}
