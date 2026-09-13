<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CertificationFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_full_certification_flow_from_submission_to_approval(): void
    {
        Storage::fake('local');

        $owner = User::factory()->create([
            'role_id' => Role::where('name', 'proprietaire')->firstOrFail()->id,
            'email_verified_at' => now(),
            'is_verified' => false,
        ]);

        $admin = User::factory()->create([
            'role_id' => Role::where('name', 'admin')->firstOrFail()->id,
            'email_verified_at' => now(),
        ]);

        // 1. The landlord submits their CIN document and phone number.
        $submitResponse = $this->actingAs($owner)->post('/certification', [
            'phone' => '+212600000099',
            'document' => UploadedFile::fake()->create('cin.pdf', 500, 'application/pdf'),
        ]);

        $submitResponse->assertRedirect(route('dashboard'));
        $this->assertFalse($owner->fresh()->is_verified);

        $certification = $owner->fresh()->certification;
        $this->assertNotNull($certification);
        $this->assertSame('en_attente', $certification->status);

        // 2. It shows up in the admin's pending certifications list.
        $listResponse = $this->actingAs($admin)->get('/admin/certifications');

        $listResponse->assertOk();
        $listResponse->assertInertia(fn ($page) => $page
            ->has('certifications', 1)
            ->where('certifications.0.id', $certification->id)
            ->where('certifications.0.status', 'en_attente')
        );

        // 3. The admin approves it.
        $approveResponse = $this->actingAs($admin)
            ->post("/admin/certifications/{$certification->id}/approve");

        $approveResponse->assertSessionHas('success');

        // 4. The landlord is now verified.
        $this->assertTrue($owner->fresh()->is_verified);
        $this->assertSame('approuve', $certification->fresh()->status);
    }
}
