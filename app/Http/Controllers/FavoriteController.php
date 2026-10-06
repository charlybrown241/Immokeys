<?php

namespace App\Http\Controllers;

use App\Models\Annonce;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

/**
 * Student favourites. Guests keep theirs in the browser; they are merged
 * into the account (sync) once the student is signed in.
 */
class FavoriteController extends Controller
{
    private const MAX_SYNC = 50;

    public function toggle(Request $request, Annonce $annonce): RedirectResponse
    {
        abort_unless($this->isVisible($annonce), 404);

        $request->user()->favoriteAnnonces()->toggle($annonce->id);

        return back();
    }

    public function sync(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array', 'max:'.self::MAX_SYNC],
            'ids.*' => ['integer'],
        ]);

        // Only annonces a student can actually see; unknown ids are ignored.
        $ids = Annonce::query()
            ->whereIn('id', $validated['ids'])
            ->where('status', '!=', 'en_attente')
            ->where('is_suspended', false)
            ->pluck('id');

        $request->user()->favoriteAnnonces()->syncWithoutDetaching($ids);

        return back();
    }

    private function isVisible(Annonce $annonce): bool
    {
        return $annonce->status !== 'en_attente' && ! $annonce->is_suspended;
    }
}
