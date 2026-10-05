<?php

namespace App\Support;

use App\Models\Annonce;
use App\Models\User;
use Illuminate\Support\Facades\URL;

class WhatsappContact
{
    /**
     * Decide what the "Contacter sur WhatsApp" button should do: generate
     * a short-lived signed link when everything checks out, or report why
     * it can't (guest, wrong role, unavailable annonce, missing phone).
     *
     * @return array{status: string, url?: string}
     */
    public static function stateFor(?User $user, Annonce $annonce): array
    {
        if (! $user) {
            return ['status' => 'guest'];
        }

        if ($user->role?->name !== 'etudiant') {
            return ['status' => 'wrong_role'];
        }

        if ($annonce->status !== 'disponible' || $annonce->is_suspended) {
            return ['status' => 'unavailable'];
        }

        if (blank($annonce->user?->phone)) {
            return ['status' => 'missing_phone'];
        }

        return [
            'status' => 'ready',
            'url' => URL::temporarySignedRoute(
                'annonces.contact-whatsapp',
                now()->addMinutes(5),
                ['annonce' => $annonce->id],
            ),
        ];
    }
}
