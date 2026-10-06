<?php

namespace Tests\Feature;

use App\Models\Annonce;
use App\Models\ContactLog;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class StudentDashboardTest extends TestCase
{
    use RefreshDatabase;

    private function userWithRole(string $role): User
    {
        return User::factory()->create([
            'role_id' => Role::where('name', $role)->firstOrFail()->id,
            'email_verified_at' => now(),
        ]);
    }

    public function test_only_students_can_open_their_space(): void
    {
        $this->get('/mon-espace')->assertRedirect(route('login'));
        $this->actingAs($this->userWithRole('proprietaire'))->get('/mon-espace')->assertForbidden();
        $this->actingAs($this->userWithRole('etudiant'))
            ->get('/mon-espace')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Student/Dashboard')->has('favorites', 0));
    }

    public function test_recently_viewed_annonces_come_from_the_session_newest_first(): void
    {
        $first = Annonce::factory()->create();
        $second = Annonce::factory()->create();
        $hidden = Annonce::factory()->create(['is_suspended' => true]);

        $this->actingAs($this->userWithRole('etudiant'))
            ->withSession(['viewed_annonces' => [$first->id, $hidden->id, $second->id]])
            ->get('/mon-espace')
            ->assertInertia(fn (Assert $page) => $page
                ->has('recentlyViewed', 2)
                ->where('recentlyViewed.0.id', $second->id)
                ->where('recentlyViewed.1.id', $first->id));
    }

    public function test_contact_history_lists_only_the_students_own_contacts(): void
    {
        $student = $this->userWithRole('etudiant');
        $annonce = Annonce::factory()->create(['title' => 'Studio Maarif']);
        ContactLog::create(['user_id' => $student->id, 'annonce_id' => $annonce->id]);
        ContactLog::create(['user_id' => $this->userWithRole('etudiant')->id, 'annonce_id' => $annonce->id]);

        $this->actingAs($student)->get('/mon-espace')->assertInertia(fn (Assert $page) => $page
            ->where('contactsCount', 1)
            ->has('contacts', 1)
            ->where('contacts.0.annonce.title', 'Studio Maarif')
            ->where('contacts.0.annonce.available', true));
    }

    public function test_favorites_come_from_the_account_newest_first_and_skip_hidden_ones(): void
    {
        $student = $this->userWithRole('etudiant');
        $older = Annonce::factory()->create();
        $newer = Annonce::factory()->create();
        $hidden = Annonce::factory()->create(['is_suspended' => true]);
        $student->favoriteAnnonces()->attach($older->id, ['created_at' => now()->subDay(), 'updated_at' => now()->subDay()]);
        $student->favoriteAnnonces()->attach([$newer->id, $hidden->id]);

        $this->actingAs($student)->get('/mon-espace')->assertInertia(fn (Assert $page) => $page
            ->has('favorites', 2)
            ->where('favorites.0.id', $newer->id)
            ->where('favorites.1.id', $older->id)
            // The shared ids must not be shadowed by the page's cards.
            ->has('favoriteIds', 3));
    }
}
