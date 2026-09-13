<?php

namespace App\Policies;

use App\Models\Annonce;
use App\Models\User;

class AnnoncePolicy
{
    /**
     * Determine whether the user can create annonces.
     */
    public function create(User $user): bool
    {
        return $user->role?->name === 'proprietaire' && $user->is_verified === true;
    }

    /**
     * Determine whether the user can update the annonce.
     */
    public function update(User $user, Annonce $annonce): bool
    {
        return $annonce->user_id === $user->id;
    }

    /**
     * Determine whether the user can delete the annonce.
     */
    public function delete(User $user, Annonce $annonce): bool
    {
        return $annonce->user_id === $user->id;
    }
}
