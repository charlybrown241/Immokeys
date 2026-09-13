<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Annonce;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnnonceController extends Controller
{
    /**
     * List every annonce on the platform, optionally filtered by status.
     * The virtual "suspendu" filter matches the is_suspended flag rather
     * than the status column, since suspension is an independent axis
     * from the owner's own lifecycle status.
     */
    public function index(Request $request): Response
    {
        $status = $request->query('status');

        $annonces = Annonce::query()
            ->with(['mainPhoto', 'user:id,name,email'])
            ->when($status === 'suspendu', fn ($query) => $query->where('is_suspended', true))
            ->when(
                $status && $status !== 'suspendu',
                fn ($query) => $query->where('status', $status)
            )
            ->latest()
            ->paginate(20)
            ->withQueryString()
            ->through(fn (Annonce $annonce) => [
                'id' => $annonce->id,
                'title' => $annonce->title,
                'quartier' => $annonce->quartier,
                'city' => $annonce->city,
                'price' => $annonce->price,
                'status' => $annonce->status,
                'is_suspended' => $annonce->is_suspended,
                'main_photo' => $annonce->mainPhoto,
                'owner' => $annonce->user,
                'created_at' => $annonce->created_at,
            ]);

        return Inertia::render('Admin/Annonces/Index', [
            'annonces' => $annonces,
            'filters' => ['status' => $status],
        ]);
    }

    /**
     * Toggle an annonce's suspension: a suspended annonce is hidden from
     * public search/detail pages without being deleted.
     */
    public function toggleSuspension(Annonce $annonce): RedirectResponse
    {
        $annonce->update(['is_suspended' => ! $annonce->is_suspended]);

        return back()->with(
            'success',
            $annonce->is_suspended ? 'Annonce suspendue.' : 'Annonce reactivee.'
        );
    }
}
