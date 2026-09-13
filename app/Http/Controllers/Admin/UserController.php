<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * List every user on the platform.
     */
    public function index(): Response
    {
        $users = User::with('role')
            ->orderBy('name')
            ->get()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role?->name,
                'is_verified' => $user->is_verified,
                'is_active' => $user->is_active,
            ]);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
        ]);
    }

    /**
     * Toggle a user's active status. A deactivated account can no longer
     * log in (enforced in LoginRequest) and is logged out of any ongoing
     * session on its next request (enforced by EnsureAccountIsActive).
     */
    public function toggleActive(Request $request, User $user): RedirectResponse
    {
        abort_if(
            $user->id === $request->user()->id,
            403,
            'Vous ne pouvez pas desactiver votre propre compte.'
        );

        $user->update(['is_active' => ! $user->is_active]);

        return back()->with(
            'success',
            $user->is_active ? 'Compte reactive.' : 'Compte desactive.'
        );
    }
}
