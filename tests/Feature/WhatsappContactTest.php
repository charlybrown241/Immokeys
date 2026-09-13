<?php

namespace Tests\Feature;

use App\Models\Annonce;
use App\Models\Category;
use App\Models\ContactLog;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class WhatsappContactTest extends TestCase
{
    use RefreshDatabase;

    private function owner(array $attributes = []): User
    {
        return User::factory()->create(array_merge([
            'role_id' => Role::where('name', 'proprietaire')->firstOrFail()->id,
            'phone' => '+212 6 00 00 01 23',
        ], $attributes));
    }

    private function etudiant(array $attributes = []): User
    {
        return User::factory()->create(array_merge([
            'role_id' => Role::where('name', 'etudiant')->firstOrFail()->id,
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
        ], $attributes));
    }

    public function test_guest_sees_a_guest_contact_state_with_no_signed_url(): void
    {
        $annonce = $this->annonce($this->owner());

        $response = $this->get("/annonces/{$annonce->id}");

        $response->assertInertia(fn ($page) => $page
            ->where('annonce.whatsapp_contact.status', 'guest')
            ->missing('annonce.whatsapp_contact.url')
        );
    }

    public function test_non_student_sees_a_wrong_role_state(): void
    {
        $annonce = $this->annonce($this->owner());
        $proprietaire = $this->owner();

        $response = $this->actingAs($proprietaire)->get("/annonces/{$annonce->id}");

        $response->assertInertia(fn ($page) => $page
            ->where('annonce.whatsapp_contact.status', 'wrong_role')
        );
    }

    public function test_student_sees_missing_phone_state_when_owner_has_no_phone(): void
    {
        $annonce = $this->annonce($this->owner(['phone' => null]));

        $response = $this->actingAs($this->etudiant())->get("/annonces/{$annonce->id}");

        $response->assertInertia(fn ($page) => $page
            ->where('annonce.whatsapp_contact.status', 'missing_phone')
        );
    }

    public function test_student_sees_unavailable_state_for_a_rented_annonce(): void
    {
        $annonce = $this->annonce($this->owner(), ['status' => 'loue']);

        $response = $this->actingAs($this->etudiant())->get("/annonces/{$annonce->id}");

        $response->assertInertia(fn ($page) => $page
            ->where('annonce.whatsapp_contact.status', 'unavailable')
        );
    }

    public function test_student_gets_a_ready_state_with_a_signed_url(): void
    {
        $annonce = $this->annonce($this->owner());

        $response = $this->actingAs($this->etudiant())->get("/annonces/{$annonce->id}");

        $response->assertInertia(fn ($page) => $page
            ->where('annonce.whatsapp_contact.status', 'ready')
            ->has('annonce.whatsapp_contact.url')
        );
    }

    public function test_visiting_the_signed_link_logs_the_contact_and_redirects_to_whatsapp(): void
    {
        $owner = $this->owner(['phone' => '+212 6 00 00 01 23']);
        $annonce = $this->annonce($owner, ['title' => "Studio a louer", 'quartier' => 'Maarif']);
        $student = $this->etudiant();

        $url = URL::temporarySignedRoute('annonces.contact-whatsapp', now()->addMinutes(5), ['annonce' => $annonce->id]);

        $response = $this->actingAs($student)->get($url);

        $response->assertRedirect();
        $location = $response->headers->get('Location');
        $this->assertStringStartsWith('https://wa.me/212600000123?text=', $location);

        $this->assertDatabaseHas('contacts_logs', [
            'user_id' => $student->id,
            'annonce_id' => $annonce->id,
        ]);
    }

    public function test_signature_is_required_and_rejected_when_tampered(): void
    {
        $owner = $this->owner();
        $annonce = $this->annonce($owner);
        $student = $this->etudiant();

        $url = URL::temporarySignedRoute('annonces.contact-whatsapp', now()->addMinutes(5), ['annonce' => $annonce->id]);

        // Unsigned request to the same path must be rejected.
        $this->actingAs($student)->get("/annonces/{$annonce->id}/contact-whatsapp")->assertForbidden();

        // Tampering with the signature must be rejected too.
        $tampered = preg_replace('/signature=[^&]+/', 'signature=invalid', $url);
        $this->actingAs($student)->get($tampered)->assertForbidden();

        $this->assertDatabaseMissing('contacts_logs', ['annonce_id' => $annonce->id]);
    }

    public function test_expired_signature_is_rejected(): void
    {
        $owner = $this->owner();
        $annonce = $this->annonce($owner);
        $student = $this->etudiant();

        $url = URL::temporarySignedRoute('annonces.contact-whatsapp', now()->subMinute(), ['annonce' => $annonce->id]);

        $this->actingAs($student)->get($url)->assertForbidden();
    }

    public function test_guest_cannot_use_a_valid_signed_link(): void
    {
        $owner = $this->owner();
        $annonce = $this->annonce($owner);

        $url = URL::temporarySignedRoute('annonces.contact-whatsapp', now()->addMinutes(5), ['annonce' => $annonce->id]);

        $this->get($url)->assertRedirect(route('login'));
        $this->assertDatabaseMissing('contacts_logs', ['annonce_id' => $annonce->id]);
    }

    public function test_non_student_cannot_use_a_valid_signed_link(): void
    {
        $owner = $this->owner();
        $annonce = $this->annonce($owner);
        $proprietaire = $this->owner();

        $url = URL::temporarySignedRoute('annonces.contact-whatsapp', now()->addMinutes(5), ['annonce' => $annonce->id]);

        $this->actingAs($proprietaire)->get($url)->assertForbidden();
        $this->assertDatabaseMissing('contacts_logs', ['annonce_id' => $annonce->id]);
    }

    public function test_signed_link_rejects_no_longer_available_annonce(): void
    {
        $owner = $this->owner();
        $annonce = $this->annonce($owner);
        $student = $this->etudiant();

        $url = URL::temporarySignedRoute('annonces.contact-whatsapp', now()->addMinutes(5), ['annonce' => $annonce->id]);

        $annonce->update(['status' => 'loue']);

        $this->actingAs($student)->get($url)->assertNotFound();
        $this->assertDatabaseMissing('contacts_logs', ['annonce_id' => $annonce->id]);
    }

    public function test_signed_link_rejects_annonce_with_no_phone_number(): void
    {
        $owner = $this->owner(['phone' => null]);
        $annonce = $this->annonce($owner);
        $student = $this->etudiant();

        $url = URL::temporarySignedRoute('annonces.contact-whatsapp', now()->addMinutes(5), ['annonce' => $annonce->id]);

        $this->actingAs($student)->get($url)->assertNotFound();
        $this->assertDatabaseMissing('contacts_logs', ['annonce_id' => $annonce->id]);
    }

    public function test_login_page_shows_explicit_message_when_redirected_for_contact(): void
    {
        $response = $this->get('/login?reason=contact-whatsapp');

        $response->assertInertia(fn ($page) => $page
            ->where('status', 'Connectez-vous pour contacter ce proprietaire.')
        );
    }
}
