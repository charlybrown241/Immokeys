<?php

namespace App\Http\Controllers;

use App\Models\Annonce;
use App\Models\Category;
use App\Models\ContactLog;
use App\Models\User;
use App\Support\AnnonceCard;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentDashboardController extends Controller
{
    private const MAX_CARDS = 12;

    /**
     * Student space: recently viewed annonces (session), WhatsApp contact
     * history (contact_logs) and favourites. Favourites live in the
     * browser, so the page sends their ids back to fetch the cards.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // The detail page appends each viewed id; newest last.
        $viewedIds = collect($request->session()->get('viewed_annonces', []))
            ->reverse()
            ->take(6)
            ->values();

        return Inertia::render('Student/Dashboard', [
            'recentlyViewed' => $this->cards($viewedIds->all(), $user),
            'contacts' => ContactLog::query()
                ->where('user_id', $user->id)
                ->with('annonce:id,title,quartier,price,status,is_suspended')
                ->latest()
                ->limit(10)
                ->get()
                ->map(fn (ContactLog $log) => [
                    'id' => $log->id,
                    'created_at' => $log->created_at->toIso8601String(),
                    'annonce' => $log->annonce ? [
                        'id' => $log->annonce->id,
                        'title' => $log->annonce->title,
                        'quartier' => $log->annonce->quartier,
                        'price' => $log->annonce->price,
                        'available' => $log->annonce->status === 'disponible' && ! $log->annonce->is_suspended,
                    ] : null,
                ]),
            'contactsCount' => ContactLog::where('user_id', $user->id)->count(),
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            // Only evaluated on the partial reload that sends the ids.
            'favorites' => Inertia::optional(fn () => $this->cards(
                collect((array) $request->input('favoris', []))->map(fn ($id) => (int) $id)->filter()->all(),
                $user,
            )),
        ]);
    }

    /**
     * Visible annonces for the given ids, keeping the ids' order.
     *
     * @param  array<int, int>  $ids
     * @return array<int, array<string, mixed>>
     */
    private function cards(array $ids, User $viewer): array
    {
        $ids = array_slice(array_values(array_unique($ids)), 0, self::MAX_CARDS);

        if ($ids === []) {
            return [];
        }

        $annonces = Annonce::query()
            ->whereIn('id', $ids)
            ->where('status', '!=', 'en_attente')
            ->where('is_suspended', false)
            ->with(AnnonceCard::RELATIONS)
            ->get()
            ->keyBy('id');

        return collect($ids)
            ->map(fn (int $id) => $annonces->get($id))
            ->filter()
            ->map(fn (Annonce $annonce) => AnnonceCard::toArray($annonce, $viewer))
            ->values()
            ->all();
    }
}
