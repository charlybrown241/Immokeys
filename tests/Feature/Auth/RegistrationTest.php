<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
    }

    public function test_new_student_can_register_with_a_free_subscription(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test Etudiant',
            'email' => 'etudiant@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role' => 'etudiant',
        ]);

        $this->assertAuthenticated();

        $user = User::where('email', 'etudiant@example.com')->firstOrFail();
        $response->assertRedirect(route($user->homeRouteName(), absolute: false));

        $this->assertSame('etudiant', $user->role->name);
        $this->assertSame('gratuit', $user->subscription->type);
    }

    public function test_new_landlord_can_register_with_a_simulated_pro_subscription(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test Proprietaire',
            'email' => 'proprietaire@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role' => 'proprietaire',
        ]);

        $this->assertAuthenticated();

        $user = User::where('email', 'proprietaire@example.com')->firstOrFail();
        $response->assertRedirect(route($user->homeRouteName(), absolute: false));

        $this->assertSame('proprietaire', $user->role->name);
        $this->assertSame('pro', $user->subscription->type);
        $this->assertNotNull($user->subscription->expires_at);
    }

    public function test_registration_requires_a_valid_role(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role' => 'admin',
        ]);

        $response->assertSessionHasErrors('role');
        $this->assertGuest();
        $this->assertDatabaseMissing('users', ['email' => 'test@example.com']);
    }
}
