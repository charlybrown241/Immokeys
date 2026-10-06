<?php

namespace Tests\Feature;

use App\Http\Middleware\HandleInertiaRequests;
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
            ->assertInertia(fn (Assert $page) => $page->component('Student/Dashboard')->missing('favorites'));
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

    public function test_favorites_are_loaded_on_demand_in_the_given_order(): void
    {
        $a = Annonce::factory()->create();
        $b = Annonce::factory()->create();
        $pending = Annonce::factory()->pending()->create();

        $this->actingAs($this->userWithRole('etudiant'))
            ->get('/mon-espace?'.http_build_query(['favoris' => [$b->id, $pending->id, $a->id]]), [
                'X-Inertia' => 'true',
                'X-Inertia-Version' => app(HandleInertiaRequests::class)->version(request()),
                'X-Inertia-Partial-Component' => 'Student/Dashboard',
                'X-Inertia-Partial-Data' => 'favorites',
            ])
            ->assertJsonCount(2, 'props.favorites')
            ->assertJsonPath('props.favorites.0.id', $b->id)
            ->assertJsonPath('props.favorites.1.id', $a->id);
    }
}
