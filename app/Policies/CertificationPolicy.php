<?php

namespace App\Policies;

use App\Models\Certification;
use App\Models\User;

class CertificationPolicy
{
    /**
     * Determine whether the user can approve the certification.
     */
    public function approve(User $user, Certification $certification): bool
    {
        return $user->role?->name === 'admin';
    }

    /**
     * Determine whether the user can reject the certification.
     */
    public function reject(User $user, Certification $certification): bool
    {
        return $user->role?->name === 'admin';
    }
}
