<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactLogStatusRequest;
use App\Models\ContactLog;
use Illuminate\Http\RedirectResponse;

class ContactLogStatusController extends Controller
{
    private const MESSAGES = [
        'nouveau' => 'Demande remise en « Nouveau ».',
        'traite' => 'Demande marquée comme traitée.',
        'archive' => 'Demande archivée.',
    ];

    /**
     * Let the owner track a WhatsApp contact: new, handled or archived.
     * The contact itself (and the stats built on it) is never deleted.
     */
    public function __invoke(ContactLogStatusRequest $request, ContactLog $contactLog): RedirectResponse
    {
        $status = $request->validated('status');

        $contactLog->update(['status' => $status]);

        return back()->with('success', self::MESSAGES[$status]);
    }
}
