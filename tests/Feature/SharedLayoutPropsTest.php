<?php

namespace Tests\Feature;

use App\Models\Annonce;
use App\Models\Certification;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SharedLayoutPropsTest extends TestCase
{
    use RefreshDatabase;

    private function userWithRole(string $role): User
    {
        return User::factory()->create([
            'role_id' => Role::where('name', $role)->firstOrFail()->id,
        ]);
    }

    public function test_active_annonces_count_only_counts_publicly_visible_annonces(): void
    {
        Annonce::factory()->count(2)->create();
        Annonce::factory()->pending()->create();
        Annonce::factory()->loue()->create();
        Annonce::factory()->create(['is_suspended' => true]);

        $this->get(route('annonces.index'))
            ->assertInertia(fn (Assert $page) => $page->where('platform.active_annonces_count', 2));
    }

    public function test_platform_whatsapp_number_comes_from_config(): void
    {
        config(['services.immokeys.whatsapp' => '212600000000']);

        $this->get(route('annonces.index'))
            ->assertInertia(fn (Assert $page) => $page->where('platform.whatsapp', '212600000000'));
    }

    public function test_pending_certifications_are_only_counted_for_admins(): void
    {
        $owner = $this->userWithRole('proprietaire');
        Certification::create([
            'user_id' => $owner->id,
            'document_path' => 'certifications/cin-test.pdf',
            'status' => 'en_attente',
        ]);

        $this->actingAs($this->userWithRole('admin'))
            ->get(route('admin.dashboard'))
            ->assertInertia(fn (Assert $page) => $page->where('notifications.pending_certifications', 1));

        $this->actingAs($owner)
            ->get(route('profile.edit'))
            ->assertInertia(fn (Assert $page) => $page->where('notifications.pending_certifications', 0));
    }
}
