<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReportStoreRequest;
use App\Models\Annonce;
use Illuminate\Http\RedirectResponse;

class ReportController extends Controller
{
    /**
     * Report an annonce. A user keeps at most one open report per annonce:
     * a second report updates the first instead of piling up.
     */
    public function store(ReportStoreRequest $request, Annonce $annonce): RedirectResponse
    {
        abort_if($annonce->status === 'en_attente', 404);

        $annonce->reports()->updateOrCreate(
            ['user_id' => $request->user()->id, 'status' => 'nouveau'],
            $request->safe()->only(['reason', 'message']),
        );

        return back()->with('success', 'Merci, ton signalement a été transmis à notre équipe.');
    }
}
