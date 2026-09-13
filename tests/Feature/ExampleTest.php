<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_guest_visiting_the_root_url_is_redirected_to_the_public_search_page(): void
    {
        $response = $this->get('/');

        $response->assertRedirect(route('annonces.index'));
    }

    public function test_an_authenticated_user_visiting_the_root_url_is_redirected_to_their_role_home(): void
    {
        $proprietaire = User::factory()->create([
            'role_id' => Role::where('name', 'proprietaire')->firstOrFail()->id,
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($proprietaire)->get('/');

        $response->assertRedirect(route('dashboard'));
    }
}
