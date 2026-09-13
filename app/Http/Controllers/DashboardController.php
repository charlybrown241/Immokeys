<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the landlord dashboard: stats and the annonces registry.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $annonces = $user->annonces()
            ->with('mainPhoto')
            ->with(['contactLogs' => fn ($query) => $query->with('user:id,name')->latest()])
            ->withCount('contactLogs')
            ->latest()
            ->get();

        $loueAnnonces = $annonces->where('status', 'loue');
        $activeCount = $annonces->whereIn('status', ['disponible', 'loue'])->count();
        $loueCount = $loueAnnonces->count();

        $newLeadsCount = $annonces
            ->flatMap->contactLogs
            ->filter(fn ($log) => $log->created_at->greaterThanOrEqualTo(now()->subDays(7)))
            ->count();

        return Inertia::render('Dashboard', [
            'certification' => $user->certification,
            'stats' => [
                'activeAnnoncesCount' => $activeCount,
                'occupancyRate' => $activeCount > 0 ? (int) round(($loueCount / $activeCount) * 100) : 0,
                'newLeadsCount' => $newLeadsCount,
                'monthlyRevenue' => (float) $loueAnnonces->sum('price'),
            ],
            'annonces' => $annonces,
        ]);
    }
}
