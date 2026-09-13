<?php

namespace Tests\Feature;

use App\Models\Certification;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CertificationTest extends TestCase
{
    use RefreshDatabase;

    private function proprietaire(array $attributes = []): User
    {
        return User::factory()->create(array_merge([
            'role_id' => Role::where('name', 'proprietaire')->firstOrFail()->id,
            'email_verified_at' => now(),
            'is_verified' => false,
        ], $attributes));
    }

    public function test_proprietaire_can_view_the_certification_form(): void
    {
        $user = $this->proprietaire();

        $this->actingAs($user)->get('/certification')->assertOk();
    }

    public function test_etudiant_cannot_access_the_certification_form(): void
    {
        $user = User::factory()->create([
            'role_id' => Role::where('name', 'etudiant')->firstOrFail()->id,
            'email_verified_at' => now(),
        ]);

        $this->actingAs($user)->get('/certification')->assertForbidden();
    }

    public function test_submitting_creates_a_pending_certification_and_updates_phone(): void
    {
        Storage::fake('local');

        $user = $this->proprietaire();

        $response = $this->actingAs($user)->post('/certification', [
            'phone' => '+212600000099',
            'document' => UploadedFile::fake()->create('cin.pdf', 500, 'application/pdf'),
        ]);

        $response->assertRedirect(route('dashboard'));

        $user->refresh();
        $this->assertSame('+212600000099', $user->phone);

        $certification = $user->certification;
        $this->assertNotNull($certification);
        $this->assertSame('en_attente', $certification->status);
        Storage::disk('local')->assertExists($certification->document_path);
    }

    public function test_certification_submission_is_rate_limited(): void
    {
        Storage::fake('local');

        $user = $this->proprietaire();

        for ($i = 0; $i < 5; $i++) {
            $this->actingAs($user)->post('/certification', [
                'phone' => '+212600000099',
                'document' => UploadedFile::fake()->create('cin.pdf', 500, 'application/pdf'),
            ]);
        }

        $response = $this->actingAs($user)->post('/certification', [
            'phone' => '+212600000099',
            'document' => UploadedFile::fake()->create('cin.pdf', 500, 'application/pdf'),
        ]);

        $response->assertStatus(429);
    }

    public function test_document_must_not_exceed_5_megabytes(): void
    {
        Storage::fake('local');

        $user = $this->proprietaire();

        $response = $this->actingAs($user)->post('/certification', [
            'phone' => '+212600000099',
            'document' => UploadedFile::fake()->create('cin.pdf', 6000, 'application/pdf'),
        ]);

        $response->assertSessionHasErrors('document');
        $this->assertNull($user->fresh()->certification);
    }

    public function test_resubmitting_after_rejection_updates_the_existing_record(): void
    {
        Storage::fake('local');

        $user = $this->proprietaire();
        $certification = Certification::create([
            'user_id' => $user->id,
            'document_path' => 'certifications/old.pdf',
            'status' => 'rejete',
        ]);

        $response = $this->actingAs($user)->post('/certification', [
            'phone' => '+212600000099',
            'document' => UploadedFile::fake()->create('cin-nouveau.pdf', 500, 'application/pdf'),
        ]);

        $response->assertRedirect(route('dashboard'));

        $certification->refresh();
        $this->assertSame('en_attente', $certification->status);
        $this->assertNotSame('certifications/old.pdf', $certification->document_path);
        $this->assertSame(1, Certification::where('user_id', $user->id)->count());
    }

    public function test_cannot_resubmit_while_a_certification_is_pending(): void
    {
        Storage::fake('local');

        $user = $this->proprietaire();
        Certification::create([
            'user_id' => $user->id,
            'document_path' => 'certifications/pending.pdf',
            'status' => 'en_attente',
        ]);

        $response = $this->actingAs($user)->post('/certification', [
            'phone' => '+212600000099',
            'document' => UploadedFile::fake()->create('cin.pdf', 500, 'application/pdf'),
        ]);

        $response->assertSessionHas('error');
        $this->assertSame(1, Certification::where('user_id', $user->id)->count());
    }

    public function test_already_verified_owner_cannot_resubmit(): void
    {
        Storage::fake('local');

        $user = $this->proprietaire(['is_verified' => true]);

        $response = $this->actingAs($user)->post('/certification', [
            'phone' => '+212600000099',
            'document' => UploadedFile::fake()->create('cin.pdf', 500, 'application/pdf'),
        ]);

        $response->assertSessionHas('error');
        $this->assertNull($user->fresh()->certification);
    }
}
