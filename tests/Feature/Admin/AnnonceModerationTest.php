<?php

namespace Tests\Feature\Admin;

use App\Models\Annonce;
use App\Models\Category;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AnnonceModerationTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create([
            'role_id' => Role::where('name', 'admin')->firstOrFail()->id,
            'email_verified_at' => now(),
        ]);
    }

    private function annonce(array $attributes = []): Annonce
    {
        $owner = User::factory()->create([
            'role_id' => Role::where('name', 'proprietaire')->firstOrFail()->id,
        ]);

        return Annonce::create(array_merge([
            'user_id' => $owner->id,
            'category_id' => Category::first()->id,
            'title' => 'Studio meuble',
            'description' => 'Description test',
            'city' => 'Casablanca',
            'quartier' => 'Maarif',
            'price' => 2500,
            'status' => 'disponible',
        ], $attributes));
    }

    public function test_admin_can_list_all_annonces(): void
    {
        $this->annonce(['title' => 'Une']);
        $this->annonce(['title' => 'Deux']);

        $response = $this->actingAs($this->admin())->get('/admin/annonces');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->has('annonces.data', 2));
    }

    public function test_non_admin_cannot_access_the_admin_annonces_list(): void
    {
        $proprietaire = User::factory()->create([
            'role_id' => Role::where('name', 'proprietaire')->firstOrFail()->id,
            'email_verified_at' => now(),
        ]);

        $this->actingAs($proprietaire)->get('/admin/annonces')->assertForbidden();
    }

    public function test_filtering_by_status_column_value(): void
    {
        $this->annonce(['status' => 'en_attente', 'title' => 'Pending']);
        $this->annonce(['status' => 'disponible', 'title' => 'Available']);

        $response = $this->actingAs($this->admin())->get('/admin/annonces?status=en_attente');

        $response->assertInertia(fn ($page) => $page
            ->has('annonces.data', 1)
            ->where('annonces.data.0.title', 'Pending')
        );
    }

    public function test_filtering_by_an_unknown_status_value_is_rejected(): void
    {
        $response = $this->actingAs($this->admin())->get('/admin/annonces?status=not-a-real-status');

        $response->assertSessionHasErrors('status');
    }

    public function test_filtering_by_suspended_matches_the_flag_not_the_status_column(): void
    {
        $suspended = $this->annonce(['status' => 'disponible', 'title' => 'Suspendue']);
        $suspended->update(['is_suspended' => true]);
        $this->annonce(['status' => 'disponible', 'title' => 'Normale']);

        $response = $this->actingAs($this->admin())->get('/admin/annonces?status=suspendu');

        $response->assertInertia(fn ($page) => $page
            ->has('annonces.data', 1)
            ->where('annonces.data.0.title', 'Suspendue')
        );
    }

    public function test_admin_can_suspend_and_reactivate_an_annonce(): void
    {
        $annonce = $this->annonce();
        $admin = $this->admin();

        $response = $this->actingAs($admin)->post("/admin/annonces/{$annonce->id}/toggle-suspension");
        $response->assertRedirect();
        $this->assertTrue($annonce->fresh()->is_suspended);

        $response = $this->actingAs($admin)->post("/admin/annonces/{$annonce->id}/toggle-suspension");
        $response->assertRedirect();
        $this->assertFalse($annonce->fresh()->is_suspended);
    }

    public function test_suspended_annonce_disappears_from_public_search_and_detail_page(): void
    {
        $annonce = $this->annonce(['status' => 'disponible']);
        $annonce->update(['is_suspended' => true]);

        $this->get('/annonces')->assertInertia(fn ($page) => $page->has('annonces.data', 0));
        $this->get("/annonces/{$annonce->id}")->assertNotFound();
    }

    public function test_non_admin_cannot_suspend_an_annonce(): void
    {
        $annonce = $this->annonce();
        $proprietaire = User::factory()->create([
            'role_id' => Role::where('name', 'proprietaire')->firstOrFail()->id,
            'email_verified_at' => now(),
        ]);

        $this->actingAs($proprietaire)
            ->post("/admin/annonces/{$annonce->id}/toggle-suspension")
            ->assertForbidden();

        $this->assertFalse($annonce->fresh()->is_suspended);
    }
}
