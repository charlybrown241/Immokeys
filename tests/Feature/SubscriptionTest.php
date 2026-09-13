<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SubscriptionTest extends TestCase
{
    use RefreshDatabase;

    private function etudiant(): User
    {
        $user = User::factory()->create([
            'role_id' => Role::where('name', 'etudiant')->firstOrFail()->id,
            'email_verified_at' => now(),
        ]);

        Subscription::create(['user_id' => $user->id, 'type' => 'gratuit']);

        return $user;
    }

    private function proprietaire(): User
    {
        $user = User::factory()->create([
            'role_id' => Role::where('name', 'proprietaire')->firstOrFail()->id,
            'email_verified_at' => now(),
        ]);

        Subscription::create([
            'user_id' => $user->id,
            'type' => 'pro',
            'started_at' => now()->subMonths(11),
            'expires_at' => now()->addMonth(),
        ]);

        return $user;
    }

    public function test_etudiant_can_view_their_subscription_page(): void
    {
        $etudiant = $this->etudiant();

        $response = $this->actingAs($etudiant)->get('/abonnement');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->where('subscription.type', 'gratuit')
        );
    }

    public function test_etudiant_can_upgrade_to_premium(): void
    {
        $etudiant = $this->etudiant();

        $response = $this->actingAs($etudiant)->post('/abonnement/upgrade');

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $subscription = $etudiant->subscription()->first();
        $this->assertSame('premium', $subscription->type);
        $this->assertNotNull($subscription->started_at);
        $this->assertTrue($subscription->expires_at->isBetween(now()->addDays(29), now()->addDays(31)));
    }

    public function test_proprietaire_cannot_upgrade_to_premium(): void
    {
        $proprietaire = $this->proprietaire();

        $this->actingAs($proprietaire)->post('/abonnement/upgrade')->assertForbidden();
    }

    public function test_proprietaire_can_view_their_pro_subscription(): void
    {
        $proprietaire = $this->proprietaire();

        $response = $this->actingAs($proprietaire)->get('/abonnement');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->where('subscription.type', 'pro')
        );
    }

    public function test_proprietaire_can_renew_their_pro_subscription(): void
    {
        $proprietaire = $this->proprietaire();
        $originalExpiry = $proprietaire->subscription->expires_at;

        $response = $this->actingAs($proprietaire)->post('/abonnement/renew');

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $subscription = $proprietaire->subscription()->first();
        $this->assertSame('pro', $subscription->type);
        $this->assertTrue($subscription->expires_at->isAfter($originalExpiry));
        $this->assertTrue($subscription->expires_at->isBetween(now()->addMonths(11), now()->addMonths(13)));
    }

    public function test_etudiant_cannot_renew_pro_subscription(): void
    {
        $etudiant = $this->etudiant();

        $this->actingAs($etudiant)->post('/abonnement/renew')->assertForbidden();
    }

    public function test_admin_cannot_access_the_subscription_page(): void
    {
        $admin = User::factory()->create([
            'role_id' => Role::where('name', 'admin')->firstOrFail()->id,
            'email_verified_at' => now(),
        ]);

        $this->actingAs($admin)->get('/abonnement')->assertForbidden();
    }
}
