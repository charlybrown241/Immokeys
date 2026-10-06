<?php

namespace Tests\Feature;

use App\Models\Annonce;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class FavoriteTest extends TestCase
{
    use RefreshDatabase;

    private function userWithRole(string $role): User
    {
        return User::factory()->create([
            'role_id' => Role::where('name', $role)->firstOrFail()->id,
            'email_verified_at' => now(),
        ]);
    }

    public function test_a_student_can_add_and_remove_a_favorite(): void
    {
        $student = $this->userWithRole('etudiant');
        $annonce = Annonce::factory()->create();

        $this->actingAs($student)->from('/annonces')->post(route('favorites.toggle', $annonce))->assertRedirect('/annonces');
        $this->assertTrue($student->favoriteAnnonces()->whereKey($annonce->id)->exists());

        $this->actingAs($student)->post(route('favorites.toggle', $annonce));
        $this->assertFalse($student->favoriteAnnonces()->whereKey($annonce->id)->exists());
    }

    public function test_hidden_annonces_cannot_be_added(): void
    {
        $student = $this->userWithRole('etudiant');

        $this->actingAs($student)->post(route('favorites.toggle', Annonce::factory()->pending()->create()))->assertNotFound();
        $this->actingAs($student)->post(route('favorites.toggle', Annonce::factory()->create(['is_suspended' => true])))->assertNotFound();
        $this->assertSame(0, $student->favoriteAnnonces()->count());
    }

    public function test_browser_favorites_are_merged_without_duplicates_or_hidden_ones(): void
    {
        $student = $this->userWithRole('etudiant');
        $kept = Annonce::factory()->create();
        $new = Annonce::factory()->create();
        $pending = Annonce::factory()->pending()->create();
        $student->favoriteAnnonces()->attach($kept->id);

        $this->actingAs($student)
            ->put(route('favorites.sync'), ['ids' => [$kept->id, $new->id, $pending->id, 999999]])
            ->assertSessionHasNoErrors();

        $this->assertEqualsCanonicalizing([$kept->id, $new->id], $student->favoriteAnnonces()->pluck('annonces.id')->all());
    }

    public function test_only_students_have_account_favorites(): void
    {
        $annonce = Annonce::factory()->create();

        $this->post(route('favorites.toggle', $annonce))->assertRedirect(route('login'));
        $this->actingAs($this->userWithRole('proprietaire'))->post(route('favorites.toggle', $annonce))->assertForbidden();
    }

    public function test_the_favorite_ids_are_shared_with_pages_for_students_only(): void
    {
        $student = $this->userWithRole('etudiant');
        $annonce = Annonce::factory()->create();
        $student->favoriteAnnonces()->attach($annonce->id);

        // Guest first: actingAs() keeps the user for the following requests.
        $this->get('/annonces')->assertInertia(fn (Assert $page) => $page->where('favorites', null));
        $this->actingAs($student)->get('/annonces')
            ->assertInertia(fn (Assert $page) => $page->where('favorites', [$annonce->id]));
    }
}
