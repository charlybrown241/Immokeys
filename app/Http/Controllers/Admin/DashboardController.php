<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Annonce;
use App\Models\Certification;
use App\Models\Role;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display platform-wide stats for the admin.
     */
    public function index(): Response
    {
        $usersByRole = Role::withCount('users')
            ->get(['id', 'name'])
            ->mapWithKeys(fn (Role $role) => [$role->name => $role->users_count]);

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'annoncesCount' => Annonce::count(),
                'usersByRole' => $usersByRole,
                'pendingCertificationsCount' => Certification::where('status', 'en_attente')->count(),
            ],
        ]);
    }
}
