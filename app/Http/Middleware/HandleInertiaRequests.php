<?php

namespace App\Http\Middleware;

use App\Models\Annonce;
use App\Models\Certification;
use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user()?->load(['role', 'subscription']);

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
                'home_route' => $user?->homeRouteName(),
            ],
            // Layout data: info bar of the public pages and dashboard bell.
            'platform' => [
                'active_annonces_count' => fn () => Annonce::query()
                    ->where('status', 'disponible')
                    ->where('is_suspended', false)
                    ->count(),
                'whatsapp' => config('services.immokeys.whatsapp'),
            ],
            // Ids of the signed-in student's favourites (null for others:
            // guests and other roles keep favourites in the browser).
            'favorites' => fn () => $user?->role?->name === 'etudiant'
                ? $user->favoriteAnnonces()->pluck('annonces.id')
                : null,
            'notifications' => [
                'pending_certifications' => fn () => $user?->role?->name === 'admin'
                    ? Certification::where('status', 'en_attente')->count()
                    : 0,
                'pending_reports' => fn () => $user?->role?->name === 'admin'
                    ? Report::where('status', 'nouveau')->count()
                    : 0,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'newsletter' => fn () => $request->session()->get('newsletter'),
            ],
        ];
    }
}
