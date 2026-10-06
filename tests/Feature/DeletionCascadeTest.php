<?php

namespace Tests\Feature;

use App\Models\Annonce;
use App\Models\Certification;
use App\Models\ContactLog;
use App\Models\Role;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DeletionCascadeTest extends TestCase
{
    use RefreshDatabase;

    private function userWithRole(string $role, array $attributes = []): User
    {
        $user = User::factory()->create([
            'role_id' => Role::where('name', $role)->firstOrFail()->id,
            'email_verified_at' => now(),
            ...$attributes,
        ]);
        Subscription::create(['user_id' => $user->id, 'type' => $role === 'proprietaire' ? 'pro' : 'gratuit']);

        return $user;
    }

    public function test_an_annonce_with_whatsapp_contacts_can_be_deleted(): void
    {
        $owner = $this->userWithRole('proprietaire', ['is_verified' => true]);
        $annonce = Annonce::factory()->create(['user_id' => $owner->id]);
        ContactLog::create(['user_id' => $this->userWithRole('etudiant')->id, 'annonce_id' => $annonce->id]);

        $this->actingAs($owner)->delete(route('annonces.destroy', $annonce))->assertRedirect(route('annonces.mine'));

        $this->assertModelMissing($annonce);
        $this->assertSame(0, ContactLog::count());
    }

    public function test_a_student_can_delete_their_account_and_owner_stats_are_kept(): void
    {
        $student = $this->userWithRole('etudiant');
        $annonce = Annonce::factory()->create();
        ContactLog::create(['user_id' => $student->id, 'annonce_id' => $annonce->id]);
        $student->favoriteAnnonces()->attach($annonce->id);

        $this->actingAs($student)->delete(route('profile.destroy'), ['password' => 'password'])->assertRedirect('/');

        $this->assertModelMissing($student);
        $this->assertDatabaseMissing('subscriptions', ['user_id' => $student->id]);
        $this->assertDatabaseCount('favorites', 0);
        // The owner still sees one contact, now anonymous.
        $this->assertSame(1, $annonce->contactLogs()->count());
        $this->assertNull($annonce->contactLogs()->first()->user_id);
    }

    public function test_an_owner_account_deletion_removes_annonces_photos_and_identity_document(): void
    {
        Storage::fake('public');
        Storage::fake('local');

        $owner = $this->userWithRole('proprietaire', ['is_verified' => true]);
        $annonce = Annonce::factory()->create(['user_id' => $owner->id]);
        $photoPath = UploadedFile::fake()->image('p.jpg')->store('annonces', 'public');
        $annonce->photos()->create(['path' => $photoPath, 'ordre' => 0]);
        $documentPath = UploadedFile::fake()->create('cin.pdf', 50, 'application/pdf')->store('certifications', 'local');
        Certification::create(['user_id' => $owner->id, 'document_path' => $documentPath, 'status' => 'approuve']);

        $this->actingAs($owner)->delete(route('profile.destroy'), ['password' => 'password'])->assertRedirect('/');

        $this->assertModelMissing($owner);
        $this->assertModelMissing($annonce);
        $this->assertDatabaseCount('certifications', 0);
        Storage::disk('public')->assertMissing($photoPath);
        Storage::disk('local')->assertMissing($documentPath);
    }

    public function test_deleting_the_reviewing_admin_keeps_the_certification(): void
    {
        $admin = $this->userWithRole('admin');
        $owner = $this->userWithRole('proprietaire');
        $certification = Certification::create(['user_id' => $owner->id, 'document_path' => 'certifications/x.pdf', 'status' => 'approuve', 'admin_id' => $admin->id]);

        $admin->delete();

        $this->assertNull($certification->fresh()->admin_id);
    }
}
