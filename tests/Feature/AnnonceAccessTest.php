<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AnnonceAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_unverified_proprietaire_is_redirected_with_a_friendly_message(): void
    {
        $user = User::factory()->create([
            'role_id' => Role::where('name', 'proprietaire')->firstOrFail()->id,
            'email_verified_at' => now(),
            'is_verified' => false,
        ]);

        $response = $this->actingAs($user)->get('/annonces/create');

        $response->assertRedirect(route('dashboard'));
        $response->assertSessionHas('error');
    }

    public function test_verified_proprietaire_can_access_the_creation_form(): void
    {
        $user = User::factory()->create([
            'role_id' => Role::where('name', 'proprietaire')->firstOrFail()->id,
            'email_verified_at' => now(),
            'is_verified' => true,
        ]);

        $this->actingAs($user)->get('/annonces/create')->assertOk();
    }

    public function test_etudiant_cannot_access_the_creation_form(): void
    {
        $user = User::factory()->create([
            'role_id' => Role::where('name', 'etudiant')->firstOrFail()->id,
            'email_verified_at' => now(),
        ]);

        $this->actingAs($user)->get('/annonces/create')->assertForbidden();
    }
}
