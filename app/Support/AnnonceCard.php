<?php

namespace App\Support;

use App\Models\Annonce;
use App\Models\User;

/**
 * Shape of a listing card (home, search results, similar listings).
 * Callers eager-load: mainPhoto, category:id,name,
 * user:id,is_verified,phone and user.subscription.
 */
class AnnonceCard
{
    /** Relations needed by toArray(), for ->with(). */
    public const RELATIONS = [
        'mainPhoto',
        'category:id,name',
        'user:id,is_verified,phone',
        'user.subscription:id,user_id,type,expires_at',
    ];

    /** Annonces published within this many days get the "Nouveau" badge. */
    public const NEW_FOR_DAYS = 14;

    /**
     * @return array<string, mixed>
     */
    public static function toArray(Annonce $annonce, ?User $viewer): array
    {
        return [
            'id' => $annonce->id,
            'title' => $annonce->title,
            'quartier' => $annonce->quartier,
            'city' => $annonce->city,
            'price' => $annonce->price,
            'surface' => $annonce->surface,
            'rooms' => $annonce->rooms,
            'is_furnished' => $annonce->is_furnished,
            'category' => $annonce->category?->name,
            'main_photo' => $annonce->mainPhoto?->path,
            'is_new' => $annonce->created_at?->gte(now()->subDays(self::NEW_FOR_DAYS)) ?? false,
            'is_certified_pro' => $annonce->ownerIsCertifiedPro(),
            'whatsapp_contact' => WhatsappContact::stateFor($viewer, $annonce),
        ];
    }
}
