<?php

namespace Tests\Feature;

use App\Models\Annonce;
use App\Models\Category;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AnnonceManagementTest extends TestCase
{
    use RefreshDatabase;

    private function verifiedProprietaire(): User
    {
        return User::factory()->create([
            'role_id' => Role::where('name', 'proprietaire')->firstOrFail()->id,
            'email_verified_at' => now(),
            'is_verified' => true,
        ]);
    }

    private function annonceFor(User $owner, array $attributes = []): Annonce
    {
        return Annonce::create(array_merge([
            'user_id' => $owner->id,
            'category_id' => Category::first()->id,
            'title' => 'Studio meuble',
            'description' => 'Description test',
            'city' => 'Casablanca',
            'quartier' => 'Maarif',
            'price' => 2500,
            'status' => 'en_attente',
        ], $attributes));
    }

    public function test_index_only_lists_the_authenticated_owners_annonces(): void
    {
        $owner = $this->verifiedProprietaire();
        $other = $this->verifiedProprietaire();

        $mine = $this->annonceFor($owner, ['title' => 'Mon annonce']);
        $this->annonceFor($other, ['title' => 'Annonce d\'un autre']);

        $response = $this->actingAs($owner)->get('/mes-annonces');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('annonces', 1)
            ->where('annonces.0.id', $mine->id)
        );
    }

    public function test_verified_owner_can_create_an_annonce_with_photos(): void
    {
        Storage::fake('public');

        $owner = $this->verifiedProprietaire();
        $category = Category::first();

        $response = $this->actingAs($owner)->post('/annonces', [
            'title' => 'Bel appartement',
            'category_id' => $category->id,
            'description' => 'Proche du tram',
            'quartier' => 'Gauthier',
            'surface' => 45,
            'price' => 4500,
            'photos' => [
                UploadedFile::fake()->image('photo1.jpg'),
                UploadedFile::fake()->image('photo2.jpg'),
            ],
        ]);

        $response->assertRedirect(route('annonces.mine'));

        $annonce = Annonce::where('title', 'Bel appartement')->firstOrFail();
        $this->assertSame($owner->id, $annonce->user_id);
        $this->assertSame('Casablanca', $annonce->city);
        $this->assertSame('en_attente', $annonce->status);
        $this->assertSame(2, $annonce->photos()->count());
        $this->assertSame([0, 1], $annonce->photos()->orderBy('ordre')->pluck('ordre')->all());

        foreach ($annonce->photos as $photo) {
            Storage::disk('public')->assertExists($photo->path);
        }
    }

    public function test_unverified_owner_cannot_create_an_annonce(): void
    {
        $owner = User::factory()->create([
            'role_id' => Role::where('name', 'proprietaire')->firstOrFail()->id,
            'email_verified_at' => now(),
            'is_verified' => false,
        ]);

        $response = $this->actingAs($owner)->post('/annonces', [
            'title' => 'Bel appartement',
            'category_id' => Category::first()->id,
            'description' => 'Proche du tram',
            'quartier' => 'Gauthier',
            'price' => 4500,
        ]);

        $response->assertForbidden();
        $this->assertDatabaseMissing('annonces', ['title' => 'Bel appartement']);
    }

    public function test_store_validates_required_fields(): void
    {
        $owner = $this->verifiedProprietaire();

        $response = $this->actingAs($owner)->post('/annonces', []);

        $response->assertSessionHasErrors(['title', 'category_id', 'description', 'quartier', 'price']);
    }

    public function test_owner_can_update_their_own_annonce_including_status(): void
    {
        $owner = $this->verifiedProprietaire();
        $annonce = $this->annonceFor($owner);

        $response = $this->actingAs($owner)->put("/annonces/{$annonce->id}", [
            'title' => 'Titre mis a jour',
            'category_id' => $annonce->category_id,
            'description' => 'Nouvelle description',
            'quartier' => 'Racine',
            'surface' => 30,
            'price' => 3000,
            'status' => 'disponible',
        ]);

        $response->assertRedirect(route('annonces.mine'));

        $annonce->refresh();
        $this->assertSame('Titre mis a jour', $annonce->title);
        $this->assertSame('disponible', $annonce->status);
    }

    public function test_owner_cannot_edit_or_update_another_owners_annonce(): void
    {
        $owner = $this->verifiedProprietaire();
        $other = $this->verifiedProprietaire();
        $annonce = $this->annonceFor($other);

        $this->actingAs($owner)->get("/annonces/{$annonce->id}/edit")->assertForbidden();

        $this->actingAs($owner)->put("/annonces/{$annonce->id}", [
            'title' => 'Hacked',
            'category_id' => $annonce->category_id,
            'description' => 'Hacked',
            'quartier' => 'Hacked',
            'price' => 1,
            'status' => 'disponible',
        ])->assertForbidden();

        $this->assertSame('en_attente', $annonce->fresh()->status);
    }

    public function test_owner_can_delete_their_own_annonce_and_its_photos(): void
    {
        Storage::fake('public');

        $owner = $this->verifiedProprietaire();
        $annonce = $this->annonceFor($owner);
        $path = UploadedFile::fake()->image('photo.jpg')->store('annonces', 'public');
        $annonce->photos()->create(['path' => $path, 'ordre' => 0]);

        $response = $this->actingAs($owner)->delete("/annonces/{$annonce->id}");

        $response->assertRedirect(route('annonces.mine'));
        $this->assertDatabaseMissing('annonces', ['id' => $annonce->id]);
        $this->assertDatabaseMissing('annonce_photos', ['annonce_id' => $annonce->id]);
        Storage::disk('public')->assertMissing($path);
    }

    public function test_owner_cannot_delete_another_owners_annonce(): void
    {
        $owner = $this->verifiedProprietaire();
        $other = $this->verifiedProprietaire();
        $annonce = $this->annonceFor($other);

        $this->actingAs($owner)->delete("/annonces/{$annonce->id}")->assertForbidden();

        $this->assertDatabaseHas('annonces', ['id' => $annonce->id]);
    }

    public function test_etudiant_cannot_access_any_annonce_management_route(): void
    {
        $etudiant = User::factory()->create([
            'role_id' => Role::where('name', 'etudiant')->firstOrFail()->id,
            'email_verified_at' => now(),
        ]);
        $owner = $this->verifiedProprietaire();
        $annonce = $this->annonceFor($owner);

        $this->actingAs($etudiant)->get('/mes-annonces')->assertForbidden();
        $this->actingAs($etudiant)->get("/annonces/{$annonce->id}/edit")->assertForbidden();
        $this->actingAs($etudiant)->delete("/annonces/{$annonce->id}")->assertForbidden();
    }
}
