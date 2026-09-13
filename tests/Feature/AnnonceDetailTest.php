<?php

namespace Tests\Feature;

use App\Models\Annonce;
use App\Models\Category;
use App\Models\Role;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AnnonceDetailTest extends TestCase
{
    use RefreshDatabase;

    private function owner(array $attributes = []): User
    {
        return User::factory()->create(array_merge([
            'role_id' => Role::where('name', 'proprietaire')->firstOrFail()->id,
        ], $attributes));
    }

    private function annonce(User $owner, array $attributes = []): Annonce
    {
        return Annonce::create(array_merge([
            'user_id' => $owner->id,
            'category_id' => Category::first()->id,
            'title' => 'Studio meuble',
            'description' => 'Description test',
            'city' => 'Casablanca',
            'quartier' => 'Maarif',
            'surface' => 25,
            'price' => 2500,
            'status' => 'disponible',
            'views_count' => 0,
        ], $attributes));
    }

    public function test_certified_pro_badge_shown_only_when_verified_with_a_pro_subscription(): void
    {
        $certifiedOwner = $this->owner(['is_verified' => true]);
        Subscription::create(['user_id' => $certifiedOwner->id, 'type' => 'pro']);
        $certifiedAnnonce = $this->annonce($certifiedOwner, ['title' => 'Certifiee']);

        $uncertifiedOwner = $this->owner(['is_verified' => false]);
        Subscription::create(['user_id' => $uncertifiedOwner->id, 'type' => 'pro']);
        $this->annonce($uncertifiedOwner, ['title' => 'Non verifiee']);

        $freeOwner = $this->owner(['is_verified' => true]);
        Subscription::create(['user_id' => $freeOwner->id, 'type' => 'gratuit']);
        $this->annonce($freeOwner, ['title' => 'Abonnement gratuit']);

        $response = $this->get('/annonces');

        $response->assertInertia(fn ($page) => $page
            ->where('annonces.data.0.title', 'Certifiee')
            ->where('annonces.data.0.is_certified_pro', true)
            ->where('annonces.data.1.is_certified_pro', false)
            ->where('annonces.data.2.is_certified_pro', false)
        );
    }

    public function test_detail_page_shows_full_annonce_information(): void
    {
        $owner = $this->owner(['is_verified' => true]);
        Subscription::create(['user_id' => $owner->id, 'type' => 'pro']);
        $annonce = $this->annonce($owner, ['description' => 'Une belle description complete.']);

        $response = $this->get("/annonces/{$annonce->id}");

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->where('annonce.id', $annonce->id)
            ->where('annonce.description', 'Une belle description complete.')
            ->where('annonce.is_certified_pro', true)
        );
    }

    public function test_viewing_the_detail_page_increments_views_count_once_per_session(): void
    {
        $annonce = $this->annonce($this->owner());

        $this->get("/annonces/{$annonce->id}");
        $this->assertSame(1, $annonce->fresh()->views_count);

        // Same session: revisiting must not increment again.
        $this->get("/annonces/{$annonce->id}");
        $this->assertSame(1, $annonce->fresh()->views_count);
    }

    public function test_a_new_session_counts_as_a_new_view(): void
    {
        $annonce = $this->annonce($this->owner());

        $this->get("/annonces/{$annonce->id}");
        $this->assertSame(1, $annonce->fresh()->views_count);

        // Flushing the session simulates a brand new visitor session.
        $this->flushSession();

        $this->get("/annonces/{$annonce->id}");
        $this->assertSame(2, $annonce->fresh()->views_count);
    }

    public function test_pending_annonces_are_not_publicly_viewable(): void
    {
        $annonce = $this->annonce($this->owner(), ['status' => 'en_attente']);

        $this->get("/annonces/{$annonce->id}")->assertNotFound();
    }

    public function test_rented_annonces_remain_viewable(): void
    {
        $annonce = $this->annonce($this->owner(), ['status' => 'loue']);

        $this->get("/annonces/{$annonce->id}")->assertOk();
    }

    public function test_the_create_route_is_not_shadowed_by_the_show_route(): void
    {
        $owner = $this->owner(['is_verified' => true]);

        $this->actingAs($owner)->get('/annonces/create')->assertOk();
    }
}
