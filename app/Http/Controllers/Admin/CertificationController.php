<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Certification;
use App\Notifications\CertificationApproved;
use App\Notifications\CertificationRejected;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CertificationController extends Controller
{
    /**
     * List certifications, pending ones first.
     */
    public function index(): Response
    {
        $certifications = Certification::with('user')
            ->orderByRaw("status = 'en_attente' desc")
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Admin/Certifications/Index', [
            'certifications' => $certifications,
        ]);
    }

    /**
     * Serve the privately stored identity document, admin only.
     */
    public function document(Certification $certification): StreamedResponse
    {
        return Storage::disk('local')->download($certification->document_path);
    }

    /**
     * Approve the certification and mark the owner as verified.
     */
    public function approve(Certification $certification): RedirectResponse
    {
        Gate::authorize('approve', $certification);

        DB::transaction(function () use ($certification) {
            $certification->update([
                'status' => 'approuve',
                'approved_at' => now(),
                'admin_id' => auth()->id(),
            ]);

            $certification->user->update(['is_verified' => true]);
        });

        $certification->user->notify(new CertificationApproved);

        return back()->with('success', 'Certification approuvee.');
    }

    /**
     * Reject the certification.
     */
    public function reject(Certification $certification): RedirectResponse
    {
        Gate::authorize('reject', $certification);

        $certification->update(['status' => 'rejete']);

        $certification->user->notify(new CertificationRejected);

        return back()->with('success', 'Certification rejetee.');
    }
}
