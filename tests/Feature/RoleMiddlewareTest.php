<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleMiddlewareTest extends TestCase
{
    use RefreshDatabase;

    private function userWithRole(string $role): User
    {
        return User::factory()->create([
            'role_id' => Role::where('name', $role)->firstOrFail()->id,
            'email_verified_at' => now(),
        ]);
    }

    public function test_proprietaire_can_access_the_proprietaire_dashboard(): void
    {
        $user = $this->userWithRole('proprietaire');

        $this->actingAs($user)->get('/dashboard')->assertOk();
    }

    public function test_etudiant_cannot_access_the_proprietaire_dashboard(): void
    {
        $user = $this->userWithRole('etudiant');

        $this->actingAs($user)->get('/dashboard')->assertForbidden();
    }

    public function test_admin_can_access_the_admin_dashboard(): void
    {
        $user = $this->userWithRole('admin');

        $this->actingAs($user)->get('/admin/dashboard')->assertOk();
    }

    public function test_proprietaire_cannot_access_the_admin_dashboard(): void
    {
        $user = $this->userWithRole('proprietaire');

        $this->actingAs($user)->get('/admin/dashboard')->assertForbidden();
    }
}
