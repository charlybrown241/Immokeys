<?php

namespace Tests\Feature;

use App\Models\Annonce;
use App\Models\Report;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ReportTest extends TestCase
{
    use RefreshDatabase;

    private function userWithRole(string $role): User
    {
        return User::factory()->create([
            'role_id' => Role::where('name', $role)->firstOrFail()->id,
            'email_verified_at' => now(),
        ]);
    }

    public function test_a_signed_in_user_can_report_an_annonce(): void
    {
        $student = $this->userWithRole('etudiant');
        $annonce = Annonce::factory()->create();

        $this->actingAs($student)
            ->from("/annonces/{$annonce->id}")
            ->post(route('annonces.report', $annonce), ['reason' => 'arnaque', 'message' => 'Demande un virement.'])
            ->assertRedirect("/annonces/{$annonce->id}")
            ->assertSessionHas('success');

        $this->assertDatabaseHas('reports', [
            'annonce_id' => $annonce->id,
            'user_id' => $student->id,
            'reason' => 'arnaque',
            'status' => 'nouveau',
        ]);
    }

    public function test_reporting_again_updates_the_open_report(): void
    {
        $student = $this->userWithRole('etudiant');
        $annonce = Annonce::factory()->create();

        $this->actingAs($student)->post(route('annonces.report', $annonce), ['reason' => 'deja_loue']);
        $this->actingAs($student)->post(route('annonces.report', $annonce), ['reason' => 'infos_fausses']);

        $this->assertSame(1, Report::count());
        $this->assertSame('infos_fausses', Report::first()->reason);
    }

    public function test_validation_owner_and_guest_rules(): void
    {
        $owner = $this->userWithRole('proprietaire');
        $annonce = Annonce::factory()->create(['user_id' => $owner->id]);

        $this->post(route('annonces.report', $annonce), ['reason' => 'arnaque'])->assertRedirect(route('login'));
        $this->actingAs($owner)->post(route('annonces.report', $annonce), ['reason' => 'arnaque'])->assertForbidden();
        $this->actingAs($this->userWithRole('etudiant'))
            ->post(route('annonces.report', $annonce), ['reason' => 'autre'])
            ->assertSessionHasErrors('message');
        $this->actingAs($this->userWithRole('etudiant'))
            ->post(route('annonces.report', $annonce), ['reason' => 'inconnu'])
            ->assertSessionHasErrors('reason');
        $this->assertSame(0, Report::count());
    }

    public function test_the_detail_page_says_who_can_report(): void
    {
        $owner = $this->userWithRole('proprietaire');
        $annonce = Annonce::factory()->create(['user_id' => $owner->id]);

        $this->get("/annonces/{$annonce->id}")->assertInertia(fn (Assert $page) => $page->where('canReport', true)->has('reportReasons', 5));
        $this->actingAs($owner)->get("/annonces/{$annonce->id}")->assertInertia(fn (Assert $page) => $page->where('canReport', false));
    }

    public function test_admin_lists_reports_pending_first(): void
    {
        $annonce = Annonce::factory()->create(['title' => 'Annonce signalée']);
        Report::create(['annonce_id' => $annonce->id, 'reason' => 'arnaque', 'status' => 'traite']);
        Report::create(['annonce_id' => $annonce->id, 'reason' => 'autre', 'message' => 'Bizarre', 'status' => 'nouveau']);

        $this->actingAs($this->userWithRole('admin'))
            ->get(route('admin.reports.index'))
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Reports/Index')
                ->has('reports', 2)
                ->where('reports.0.status', 'nouveau')
                ->where('reports.0.reason', 'Autre raison')
                ->where('reports.0.annonce.title', 'Annonce signalée')
                ->where('notifications.pending_reports', 1));
    }

    public function test_admin_can_suspend_and_close_or_dismiss(): void
    {
        $admin = $this->userWithRole('admin');
        $annonce = Annonce::factory()->create();
        $serious = Report::create(['annonce_id' => $annonce->id, 'reason' => 'arnaque']);
        $minor = Report::create(['annonce_id' => $annonce->id, 'reason' => 'autre', 'message' => 'Rien']);

        $this->actingAs($admin)->patch(route('admin.reports.update', $serious), ['status' => 'traite', 'suspend' => true])
            ->assertSessionHas('success');
        $this->actingAs($admin)->patch(route('admin.reports.update', $minor), ['status' => 'rejete']);

        $this->assertTrue($annonce->fresh()->is_suspended);
        $this->assertSame('traite', $serious->fresh()->status);
        $this->assertSame($admin->id, $serious->fresh()->handled_by);
        $this->assertNotNull($serious->fresh()->handled_at);
        $this->assertSame('rejete', $minor->fresh()->status);
    }

    public function test_only_admins_review_reports(): void
    {
        $report = Report::create(['annonce_id' => Annonce::factory()->create()->id, 'reason' => 'arnaque']);
        $student = $this->userWithRole('etudiant');

        $this->actingAs($student)->get(route('admin.reports.index'))->assertForbidden();
        $this->actingAs($student)->patch(route('admin.reports.update', $report), ['status' => 'rejete'])->assertForbidden();
        $this->assertSame('nouveau', $report->fresh()->status);
    }
}
