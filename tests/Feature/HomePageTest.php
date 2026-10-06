<?php

namespace Tests\Feature;

use App\Models\Annonce;
use App\Models\Photo;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class HomePageTest extends TestCase
{
    use RefreshDatabase;

    private function userWithRole(string $role): User
    {
        return User::factory()->create([
            'role_id' => Role::where('name', $role)->firstOrFail()->id,
            'email_verified_at' => now(),
        ]);
    }

    public function test_guests_see_the_home_page(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Home')
                ->has('featured')
                ->has('quartiers')
                ->has('categories', 4));
    }

    public function test_students_see_the_home_page(): void
    {
        $this->actingAs($this->userWithRole('etudiant'))
            ->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Home'));
    }

    public function test_owners_and_admins_are_redirected_to_their_dashboard(): void
    {
        $this->actingAs($this->userWithRole('proprietaire'))->get('/')->assertRedirect(route('dashboard'));
        $this->actingAs($this->userWithRole('admin'))->get('/')->assertRedirect(route('admin.dashboard'));
    }

    public function test_featured_only_lists_publicly_visible_annonces_newest_first(): void
    {
        $older = Annonce::factory()->create(['created_at' => now()->subDays(30)]);
        $newer = Annonce::factory()->create();
        Annonce::factory()->pending()->create();
        Annonce::factory()->create(['is_suspended' => true]);
        Annonce::factory()->create(['city' => 'Rabat']);

        $this->get('/')->assertInertia(fn (Assert $page) => $page
            ->has('featured', 2)
            ->where('featured.0.id', $newer->id)
            ->where('featured.0.is_new', true)
            ->where('featured.1.id', $older->id)
            ->where('featured.1.is_new', false)
            ->where('featured.0.whatsapp_contact.status', 'guest'));
    }

    public function test_students_get_a_signed_whatsapp_link_on_featured_cards(): void
    {
        $owner = $this->userWithRole('proprietaire');
        $owner->update(['phone' => '0600000000']);
        Annonce::factory()->create(['user_id' => $owner->id]);

        $this->actingAs($this->userWithRole('etudiant'))
            ->get('/')
            ->assertInertia(fn (Assert $page) => $page
                ->where('featured.0.whatsapp_contact.status', 'ready')
                ->where('featured.0.whatsapp_contact.url', fn ($url) => str_contains($url, 'signature=')));
    }

    public function test_quartiers_are_ranked_by_listing_count_with_their_lowest_price(): void
    {
        Annonce::factory()->create(['quartier' => 'Maarif', 'price' => 3000]);
        $cheapest = Annonce::factory()->create(['quartier' => 'Maarif', 'price' => 2200]);
        Photo::create(['annonce_id' => $cheapest->id, 'path' => 'annonces/maarif.jpg', 'ordre' => 0]);
        Annonce::factory()->create(['quartier' => 'Gauthier', 'price' => 4000]);
        Annonce::factory()->create(['quartier' => 'Gauthier', 'price' => 1000, 'is_suspended' => true]);

        $this->get('/')->assertInertia(fn (Assert $page) => $page
            ->has('quartiers', 2)
            ->where('quartiers.0.name', 'Maarif')
            ->where('quartiers.0.min_price', 2200)
            ->where('quartiers.0.total', 2)
            ->where('quartiers.0.photo', 'annonces/maarif.jpg')
            ->where('quartiers.1.name', 'Gauthier')
            ->where('quartiers.1.min_price', 4000)
            ->where('quartiers.1.photo', null));
    }
}
