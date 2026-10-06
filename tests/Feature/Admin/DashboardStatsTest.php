<?php

namespace Tests\Feature\Admin;

use App\Models\Annonce;
use App\Models\Category;
use App\Models\Certification;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardStatsTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create([
            'role_id' => Role::where('name', 'admin')->firstOrFail()->id,
            'email_verified_at' => now(),
        ]);
    }

    public function test_dashboard_shows_platform_wide_counters(): void
    {
        // The base TestCase seeds 1 admin, 1 proprietaire, 1 etudiant already.
        $admin = $this->admin();

        User::factory()->create(['role_id' => Role::where('name', 'etudiant')->firstOrFail()->id]);
        User::factory()->create(['role_id' => Role::where('name', 'etudiant')->firstOrFail()->id]);
        $owner = User::factory()->create(['role_id' => Role::where('name', 'proprietaire')->firstOrFail()->id]);

        Annonce::create([
            'user_id' => $owner->id,
            'category_id' => Category::first()->id,
            'title' => 'Studio meuble',
            'description' => 'd',
            'city' => 'Casablanca',
            'quartier' => 'Maarif',
            'price' => 2500,
            'status' => 'disponible',
        ]);

        $response = $this->actingAs($admin)->get('/admin/dashboard');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->where('stats.annoncesCount', 1)
            ->where('stats.usersByRole.etudiant', 3) // 1 seeded + 2 created
            ->where('stats.usersByRole.proprietaire', 2) // 1 seeded + 1 created
            ->where('stats.usersByRole.admin', 2) // 1 seeded + this test's admin
            ->where('stats.pendingCertificationsCount', 0)
            ->where('stats.usersCount', 7)
        );
    }

    public function test_dashboard_lists_the_certification_queue_pending_first_and_moderation(): void
    {
        $admin = $this->admin();
        $proprietaire = Role::where('name', 'proprietaire')->firstOrFail()->id;

        $approved = User::factory()->create(['role_id' => $proprietaire]);
        Certification::create(['user_id' => $approved->id, 'document_path' => 'certifications/a.pdf', 'status' => 'approuve']);
        $pending = User::factory()->create(['role_id' => $proprietaire, 'name' => 'Karim Benali']);
        Certification::create(['user_id' => $pending->id, 'document_path' => 'certifications/b.pdf', 'status' => 'en_attente']);

        Annonce::factory()->pending()->create();
        Annonce::factory()->create(['is_suspended' => true]);

        $this->actingAs($admin)->get('/admin/dashboard')->assertInertia(fn ($page) => $page
            ->where('stats.pendingCertificationsCount', 1)
            ->where('stats.pendingAnnoncesCount', 1)
            ->where('stats.suspendedAnnoncesCount', 1)
            ->has('certifications', 2)
            ->where('certifications.0.status', 'en_attente')
            ->where('certifications.0.user.name', 'Karim Benali')
            ->where('certifications.1.status', 'approuve')
            ->has('annonces', 2)
            ->has('annonces.0.owner'));
    }
}
