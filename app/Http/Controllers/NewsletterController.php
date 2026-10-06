<?php

namespace App\Http\Controllers;

use App\Models\NewsletterSubscriber;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    /**
     * Sign an address up. The answer is the same whether or not it was
     * already registered, so the form cannot reveal who subscribed.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email', 'max:255'],
        ]);

        NewsletterSubscriber::firstOrCreate(['email' => mb_strtolower(trim($validated['email']))]);

        return back()->with('newsletter', 'Merci ! Ton inscription à la newsletter est enregistrée.');
    }
}
