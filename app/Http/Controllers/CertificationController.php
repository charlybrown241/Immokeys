<?php

namespace App\Http\Controllers;

use App\Http\Requests\CertificationStoreRequest;
use App\Models\Certification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CertificationController extends Controller
{
    /**
     * Display the "complete my profile" certification form.
     */
    public function create(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Certification/Create', [
            'certification' => $user->certification,
        ]);
    }

    /**
     * Store the phone number and identity document, submitting (or
     * resubmitting after a rejection) the certification for review.
     */
    public function store(CertificationStoreRequest $request): RedirectResponse
    {
        $user = $request->user();
        $certification = $user->certification;

        if ($user->is_verified || ($certification && $certification->status !== 'rejete')) {
            return back()->with('error', 'Votre certification est deja soumise ou votre compte est deja certifie.');
        }

        $validated = $request->validated();

        $path = $request->file('document')->store('certifications', 'local');

        $user->update(['phone' => $validated['phone']]);

        if ($certification) {
            $certification->update([
                'document_path' => $path,
                'status' => 'en_attente',
                'admin_id' => null,
                'approved_at' => null,
            ]);
        } else {
            Certification::create([
                'user_id' => $user->id,
                'document_path' => $path,
                'status' => 'en_attente',
            ]);
        }

        return redirect()->route('dashboard')->with(
            'success',
            "Votre piece d'identite a ete envoyee et est en cours de verification."
        );
    }
}
