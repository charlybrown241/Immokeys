<?php

namespace App\Policies;

use App\Models\ContactLog;
use App\Models\User;

class ContactLogPolicy
{
    /**
     * Only the owner of the contacted annonce follows the request up.
     */
    public function update(User $user, ContactLog $contactLog): bool
    {
        return $contactLog->annonce?->user_id === $user->id;
    }
}
