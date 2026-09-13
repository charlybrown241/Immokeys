<?php

namespace Tests\Feature\Admin;

use App\Models\Certification;
use App\Models\Role;
use App\Models\User;
use App\Notifications\CertificationApproved;
use App\Notifications\CertificationRejected;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CertificationManagementTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create([
            'role_id' => Role::where('name', 'admin')->firstOrFail()->id,
            'email_verified_at' => now(),
        ]);
    }

    private function proprietaireWithCertification(string $status = 'en_attente'): Certification
    {
        $owner = User::factory()->create([
            'role_id' => Role::where('name', 'proprietaire')->firstOrFail()->id,
            'email_verified_at' => now(),
            'is_verified' => false,
        ]);

        return Certification::create([
            'user_id' => $owner->id,
            'document_path' => 'certifications/cin-test.pdf',
            'status' => $status,
        ]);
    }

    public function test_admin_can_view_the_certifications_list(): void
    {
        $this->proprietaireWithCertification();

        $this->actingAs($this->admin())
            ->get('/admin/certifications')
            ->assertOk();
    }

    public function test_non_admin_cannot_view_the_certifications_list(): void
    {
        $user = User::factory()->create([
            'role_id' => Role::where('name', 'proprietaire')->firstOrFail()->id,
            'email_verified_at' => now(),
        ]);

        $this->actingAs($user)->get('/admin/certifications')->assertForbidden();
    }

    public function test_admin_can_download_the_document(): void
    {
        Storage::fake('local');
        Storage::disk('local')->put('certifications/cin-test.pdf', 'fake-content');

        $certification = $this->proprietaireWithCertification();

        $this->actingAs($this->admin())
            ->get("/admin/certifications/{$certification->id}/document")
            ->assertOk();
    }

    public function test_approving_verifies_the_owner_and_notifies_them(): void
    {
        Notification::fake();

        $admin = $this->admin();
        $certification = $this->proprietaireWithCertification();

        $response = $this->actingAs($admin)
            ->post("/admin/certifications/{$certification->id}/approve");

        $response->assertSessionHas('success');

        $certification->refresh();
        $this->assertSame('approuve', $certification->status);
        $this->assertSame($admin->id, $certification->admin_id);
        $this->assertNotNull($certification->approved_at);
        $this->assertTrue($certification->user->fresh()->is_verified);

        Notification::assertSentTo($certification->user, CertificationApproved::class);
    }

    public function test_rejecting_keeps_the_owner_unverified_and_notifies_them(): void
    {
        Notification::fake();

        $certification = $this->proprietaireWithCertification();

        $response = $this->actingAs($this->admin())
            ->post("/admin/certifications/{$certification->id}/reject");

        $response->assertSessionHas('success');

        $certification->refresh();
        $this->assertSame('rejete', $certification->status);
        $this->assertFalse($certification->user->fresh()->is_verified);

        Notification::assertSentTo($certification->user, CertificationRejected::class);
    }

    public function test_non_admin_cannot_approve_or_reject(): void
    {
        $user = User::factory()->create([
            'role_id' => Role::where('name', 'proprietaire')->firstOrFail()->id,
            'email_verified_at' => now(),
        ]);
        $certification = $this->proprietaireWithCertification();

        $this->actingAs($user)
            ->post("/admin/certifications/{$certification->id}/approve")
            ->assertForbidden();

        $this->actingAs($user)
            ->post("/admin/certifications/{$certification->id}/reject")
            ->assertForbidden();
    }

    public function test_admin_dashboard_shows_the_pending_certifications_count(): void
    {
        $this->proprietaireWithCertification('en_attente');
        $this->proprietaireWithCertification('en_attente');
        $this->proprietaireWithCertification('approuve');

        $response = $this->actingAs($this->admin())->get('/admin/dashboard');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->where('stats.pendingCertificationsCount', 2));
    }
}
