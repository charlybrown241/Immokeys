<?php

namespace App\Http\Controllers;

use App\Http\Requests\AnnoncePhotoStoreRequest;
use App\Models\Annonce;
use App\Models\Photo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

/**
 * Photo management of an existing annonce (owner only). The first photo
 * (lowest "ordre") is the main one shown on cards.
 */
class AnnoncePhotoController extends Controller
{
    public function store(AnnoncePhotoStoreRequest $request, Annonce $annonce): RedirectResponse
    {
        $next = (int) $annonce->photos()->max('ordre') + ($annonce->photos()->exists() ? 1 : 0);

        foreach ($request->file('photos') as $index => $file) {
            $annonce->photos()->create([
                'path' => $file->store('annonces', 'public'),
                'ordre' => $next + $index,
            ]);
        }

        $count = count($request->file('photos'));

        return back()->with('success', $count > 1 ? "{$count} photos ajoutées." : 'Photo ajoutée.');
    }

    public function destroy(Annonce $annonce, Photo $photo): RedirectResponse
    {
        Gate::authorize('update', $annonce);

        DB::transaction(function () use ($annonce, $photo) {
            $photo->delete();
            $this->resequence($annonce);
        });

        Storage::disk('public')->delete($photo->path);

        return back()->with('success', 'Photo supprimée.');
    }

    public function makeMain(Annonce $annonce, Photo $photo): RedirectResponse
    {
        Gate::authorize('update', $annonce);

        DB::transaction(function () use ($annonce, $photo) {
            $photo->update(['ordre' => -1]);
            $this->resequence($annonce);
        });

        return back()->with('success', 'Photo principale mise à jour.');
    }

    /**
     * Renumber photos 0..n-1, keeping their relative order.
     */
    private function resequence(Annonce $annonce): void
    {
        $photos = $annonce->photos()->orderBy('ordre')->orderBy('id')->get();

        foreach ($photos as $index => $photo) {
            if ($photo->ordre !== $index) {
                $photo->update(['ordre' => $index]);
            }
        }
    }
}
