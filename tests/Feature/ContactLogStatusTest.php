<?php

namespace Tests\Feature;

use App\Models\Annonce;
use App\Models\ContactLog;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactLogStatusTest extends TestCase
{
    use RefreshDatabase;

    private function userWithRole(string $role): User
    {
        return User::factory()->create([
            'role_id' => Role::where('name', $role)->firstOrFail()->id,
            'email_verified_at' => now(),
            'is_verified' => true,
        ]);
    }

    private function contactFor(User $owner): ContactLog
    {
        return ContactLog::create([
            'user_id' => $this->userWithRole('etudiant')->id,
            'annonce_id' => Annonce::factory()->create(['user_id' => $owner->id])->id,
        ]);
    }

    public function test_a_new_contact_starts_as_nouveau(): void
    {
        $this->assertSame('nouveau', $this->contactFor($this->userWithRole('proprietaire'))->fresh()->status);
    }

    public function test_the_owner_can_mark_a_contact_as_handled_or_archived(): void
    {
        $owner = $this->userWithRole('proprietaire');
        $contact = $this->contactFor($owner);

        $this->actingAs($owner)
            ->from('/dashboard')
            ->patch(route('contacts.status', $contact), ['status' => 'traite'])
            ->assertRedirect('/dashboard')
            ->assertSessionHas('success');
        $this->assertSame('traite', $contact->fresh()->status);

        $this->actingAs($owner)->patch(route('contacts.status', $contact), ['status' => 'archive']);
        $this->assertSame('archive', $contact->fresh()->status);
    }

    public function test_another_owner_cannot_change_the_status(): void
    {
        $contact = $this->contactFor($this->userWithRole('proprietaire'));

        $this->actingAs($this->userWithRole('proprietaire'))
            ->patch(route('contacts.status', $contact), ['status' => 'traite'])
            ->assertForbidden();
        $this->assertSame('nouveau', $contact->fresh()->status);
    }

    public function test_students_cannot_change_the_status(): void
    {
        $contact = $this->contactFor($this->userWithRole('proprietaire'));

        $this->actingAs($this->userWithRole('etudiant'))
            ->patch(route('contacts.status', $contact), ['status' => 'traite'])
            ->assertForbidden();
    }

    public function test_an_unknown_status_is_rejected(): void
    {
        $owner = $this->userWithRole('proprietaire');
        $contact = $this->contactFor($owner);

        $this->actingAs($owner)
            ->patch(route('contacts.status', $contact), ['status' => 'supprime'])
            ->assertSessionHasErrors('status');
        $this->assertSame('nouveau', $contact->fresh()->status);
    }
}
