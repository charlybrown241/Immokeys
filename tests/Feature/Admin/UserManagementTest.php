<?php

namespace Tests\Feature\Admin;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create([
            'role_id' => Role::where('name', 'admin')->firstOrFail()->id,
            'email_verified_at' => now(),
        ]);
    }

    public function test_admin_can_list_all_users(): void
    {
        // TestCase seeds the 3 default accounts (admin/proprietaire/etudiant)
        // on top of whichever users this test creates explicitly.
        $etudiant = User::factory()->create([
            'role_id' => Role::where('name', 'etudiant')->firstOrFail()->id,
        ]);

        $response = $this->actingAs($this->admin())->get('/admin/users');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('users', 5)
            ->where(
                'users',
                fn ($users) => collect($users)->pluck('email')->contains($etudiant->email)
            )
        );
    }

    public function test_non_admin_cannot_access_the_admin_users_list(): void
    {
        $etudiant = User::factory()->create([
            'role_id' => Role::where('name', 'etudiant')->firstOrFail()->id,
        ]);

        $this->actingAs($etudiant)->get('/admin/users')->assertForbidden();
    }

    public function test_admin_can_deactivate_and_reactivate_another_user(): void
    {
        $admin = $this->admin();
        $etudiant = User::factory()->create([
            'role_id' => Role::where('name', 'etudiant')->firstOrFail()->id,
        ]);

        $response = $this->actingAs($admin)->post("/admin/users/{$etudiant->id}/toggle-active");
        $response->assertRedirect();
        $this->assertFalse($etudiant->fresh()->is_active);

        $response = $this->actingAs($admin)->post("/admin/users/{$etudiant->id}/toggle-active");
        $response->assertRedirect();
        $this->assertTrue($etudiant->fresh()->is_active);
    }

    public function test_admin_cannot_deactivate_their_own_account(): void
    {
        $admin = $this->admin();

        $this->actingAs($admin)
            ->post("/admin/users/{$admin->id}/toggle-active")
            ->assertForbidden();

        $this->assertTrue($admin->fresh()->is_active);
    }

    public function test_deactivated_user_cannot_log_in(): void
    {
        $user = User::factory()->create([
            'role_id' => Role::where('name', 'etudiant')->firstOrFail()->id,
            'is_active' => false,
        ]);

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertSessionHasErrors('email');
        $this->assertGuest();
    }

    public function test_deactivating_an_already_logged_in_user_logs_them_out_on_next_request(): void
    {
        $user = User::factory()->create([
            'role_id' => Role::where('name', 'etudiant')->firstOrFail()->id,
        ]);

        $this->actingAs($user);
        $user->update(['is_active' => false]);

        $response = $this->get('/annonces');

        $response->assertRedirect(route('login'));
        $this->assertGuest();
    }

    public function test_non_admin_cannot_toggle_another_users_active_status(): void
    {
        $etudiant = User::factory()->create([
            'role_id' => Role::where('name', 'etudiant')->firstOrFail()->id,
        ]);
        $other = User::factory()->create([
            'role_id' => Role::where('name', 'etudiant')->firstOrFail()->id,
        ]);

        $this->actingAs($etudiant)
            ->post("/admin/users/{$other->id}/toggle-active")
            ->assertForbidden();
    }
}
