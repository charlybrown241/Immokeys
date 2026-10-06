<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Annonce;
use App\Models\Certification;
use App\Models\Report;
use App\Models\Role;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display platform-wide stats, the identity certification queue and
     * the latest annonces to moderate.
     */
    public function index(): Response
    {
        $usersByRole = Role::withCount('users')
            ->get(['id', 'name'])
            ->mapWithKeys(fn (Role $role) => [$role->name => $role->users_count]);

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'usersCount' => User::count(),
                'annoncesCount' => Annonce::count(),
                'usersByRole' => $usersByRole,
                'pendingAnnoncesCount' => Annonce::where('status', 'en_attente')->count(),
                'pendingCertificationsCount' => Certification::where('status', 'en_attente')->count(),
                'suspendedAnnoncesCount' => Annonce::where('is_suspended', true)->count(),
                'pendingReportsCount' => Report::where('status', 'nouveau')->count(),
            ],
            // Pending requests first, then the latest decisions.
            'certifications' => Certification::query()
                ->with('user:id,name,email')
                ->orderByRaw("CASE WHEN status = 'en_attente' THEN 0 ELSE 1 END")
                ->latest()
                ->limit(8)
                ->get()
                ->map(fn (Certification $certification) => [
                    'id' => $certification->id,
                    'status' => $certification->status,
                    'submitted_at' => $certification->created_at->toIso8601String(),
                    'user' => $certification->user?->only(['id', 'name', 'email']),
                ]),
            'annonces' => Annonce::query()
                ->with('user:id,name')
                ->latest()
                ->limit(6)
                ->get(['id', 'user_id', 'title', 'quartier', 'status', 'is_suspended', 'created_at'])
                ->map(fn (Annonce $annonce) => [
                    'id' => $annonce->id,
                    'title' => $annonce->title,
                    'quartier' => $annonce->quartier,
                    'status' => $annonce->status,
                    'is_suspended' => $annonce->is_suspended,
                    'created_at' => $annonce->created_at->toIso8601String(),
                    'owner' => $annonce->user?->name,
                ]),
        ]);
    }
}
