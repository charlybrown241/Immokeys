<?php

namespace App\Http\Controllers;

use App\Models\Annonce;
use App\Models\ContactLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /** Days of WhatsApp contacts sent to the chart (largest period). */
    private const SERIES_DAYS = 90;

    /**
     * Display the landlord dashboard: KPIs, contacts over time, recent
     * contacts, annonces by status and the most viewed annonces.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $annonces = $user->annonces()
            ->withCount('contactLogs')
            ->get(['id', 'title', 'status', 'is_suspended', 'views_count', 'created_at']);

        $contacts = ContactLog::query()
            ->whereIn('annonce_id', $annonces->pluck('id'))
            ->where('created_at', '>=', now()->subDays(self::SERIES_DAYS - 1)->startOfDay())
            ->get(['id', 'created_at']);

        // Views per day (annonce_views), summed over all the owner's annonces.
        $views = DB::table('annonce_views')
            ->whereIn('annonce_id', $annonces->pluck('id'))
            ->where('day', '>=', now()->subDays(self::SERIES_DAYS - 1)->toDateString())
            ->selectRaw('day, SUM(count) as total')
            ->groupBy('day')
            ->pluck('total', 'day')
            ->mapWithKeys(fn ($total, $day) => [substr((string) $day, 0, 10) => (int) $total]);

        $last30 = $contacts->filter(fn ($log) => $log->created_at->gte(now()->subDays(30)))->count();
        $previous30 = $contacts->filter(fn ($log) => $log->created_at->lt(now()->subDays(30))
            && $log->created_at->gte(now()->subDays(60)))->count();

        return Inertia::render('Dashboard', [
            'certification' => $user->certification?->only(['status', 'created_at']),
            'stats' => [
                'activeAnnoncesCount' => $annonces
                    ->where('status', 'disponible')
                    ->where('is_suspended', false)
                    ->count(),
                'contactsCount' => $annonces->sum('contact_logs_count'),
                'contactsLast30' => $last30,
                'contactsDelta' => $previous30 > 0 ? (int) round((($last30 - $previous30) / $previous30) * 100) : null,
                'viewsTotal' => (int) $annonces->sum('views_count'),
                'viewsThisMonth' => $views->filter(fn ($total, $day) => $day >= now()->startOfMonth()->toDateString())->sum(),
            ],
            'contactsSeries' => $this->dailySeries($contacts->countBy(fn ($log) => $log->created_at->toDateString())),
            'viewsSeries' => $this->dailySeries($views),
            'recentContacts' => $this->recentContacts($user),
            'annoncesByStatus' => [
                'disponible' => $annonces->where('status', 'disponible')->where('is_suspended', false)->count(),
                'loue' => $annonces->where('status', 'loue')->where('is_suspended', false)->count(),
                'en_attente' => $annonces->where('status', 'en_attente')->where('is_suspended', false)->count(),
                'suspendue' => $annonces->where('is_suspended', true)->count(),
            ],
            'topViewed' => $annonces
                ->sortByDesc('views_count')
                ->take(5)
                ->map(fn (Annonce $annonce) => [
                    'id' => $annonce->id,
                    'title' => $annonce->title,
                    'views_count' => $annonce->views_count,
                    'contacts_count' => $annonce->contact_logs_count,
                ])
                ->values(),
        ]);
    }

    /**
     * One point per day over the last SERIES_DAYS days, zeros included.
     *
     * @param  \Illuminate\Support\Collection<string, int>  $counts  keyed by Y-m-d
     * @return array<int, array{date: string, count: int}>
     */
    private function dailySeries($counts): array
    {
        return collect(range(self::SERIES_DAYS - 1, 0))
            ->map(function (int $daysAgo) use ($counts) {
                $day = now()->subDays($daysAgo)->toDateString();

                return ['date' => $day, 'count' => (int) ($counts[$day] ?? 0)];
            })
            ->all();
    }

    /**
     * Latest non-archived WhatsApp contacts on the owner's annonces.
     *
     * @return array<int, array<string, mixed>>
     */
    private function recentContacts(User $owner): array
    {
        return ContactLog::query()
            ->whereHas('annonce', fn ($query) => $query->where('user_id', $owner->id))
            ->where('status', '!=', 'archive')
            ->with(['user:id,name', 'annonce:id,title'])
            ->latest()
            ->limit(6)
            ->get()
            ->map(fn (ContactLog $log) => [
                'id' => $log->id,
                'student' => $log->user?->name ?? 'Étudiant',
                'annonce' => $log->annonce?->only(['id', 'title']),
                'created_at' => $log->created_at->toIso8601String(),
                'status' => $log->status,
            ])
            ->all();
    }
}
