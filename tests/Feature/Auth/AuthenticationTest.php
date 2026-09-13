<?php

namespace Tests\Feature\Auth;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_screen_can_be_rendered(): void
    {
        $response = $this->get('/login');

        $response->assertStatus(200);
    }

    public function test_users_can_authenticate_using_the_login_screen(): void
    {
        $user = User::factory()->create();

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route($user->homeRouteName(), absolute: false));
    }

    public function test_users_can_not_authenticate_with_invalid_password(): void
    {
        $user = User::factory()->create();

        $this->post('/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    public function test_users_can_logout(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/logout');

        $this->assertGuest();
        $response->assertRedirect('/');
    }

    public function test_an_already_authenticated_etudiant_visiting_login_is_redirected_to_annonces(): void
    {
        $etudiant = User::factory()->create([
            'role_id' => Role::where('name', 'etudiant')->firstOrFail()->id,
        ]);

        $response = $this->actingAs($etudiant)->get('/login');

        $response->assertRedirect(route('annonces.index'));
    }

    public function test_an_already_authenticated_admin_visiting_login_is_redirected_to_admin_dashboard(): void
    {
        $admin = User::factory()->create([
            'role_id' => Role::where('name', 'admin')->firstOrFail()->id,
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($admin)->get('/login');

        $response->assertRedirect(route('admin.dashboard'));
    }

    public function test_an_already_authenticated_proprietaire_visiting_login_is_redirected_to_dashboard(): void
    {
        $proprietaire = User::factory()->create([
            'role_id' => Role::where('name', 'proprietaire')->firstOrFail()->id,
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($proprietaire)->get('/login');

        $response->assertRedirect(route('dashboard'));
    }
}
