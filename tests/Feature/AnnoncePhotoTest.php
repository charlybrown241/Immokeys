<?php

namespace Tests\Feature;

use App\Models\Annonce;
use App\Models\Photo;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AnnoncePhotoTest extends TestCase
{
    use RefreshDatabase;

    private function owner(): User
    {
        return User::factory()->create([
            'role_id' => Role::where('name', 'proprietaire')->firstOrFail()->id,
            'email_verified_at' => now(),
            'is_verified' => true,
        ]);
    }

    private function annonceWithPhotos(User $owner, int $count): Annonce
    {
        $annonce = Annonce::factory()->create(['user_id' => $owner->id]);
        for ($i = 0; $i < $count; $i++) {
            $path = UploadedFile::fake()->image("p{$i}.jpg")->store('annonces', 'public');
            $annonce->photos()->create(['path' => $path, 'ordre' => $i]);
        }

        return $annonce;
    }

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
    }

    public function test_owner_can_add_photos_after_the_existing_ones(): void
    {
        $owner = $this->owner();
        $annonce = $this->annonceWithPhotos($owner, 2);

        $this->actingAs($owner)
            ->from(route('annonces.edit', $annonce))
            ->post(route('annonces.photos.store', $annonce), [
                'photos' => [UploadedFile::fake()->image('a.jpg'), UploadedFile::fake()->image('b.png')],
            ])
            ->assertRedirect(route('annonces.edit', $annonce))
            ->assertSessionHas('success');

        $this->assertSame([0, 1, 2, 3], $annonce->photos()->orderBy('ordre')->pluck('ordre')->all());
        $annonce->photos->each(fn (Photo $photo) => Storage::disk('public')->assertExists($photo->path));
    }

    public function test_an_annonce_cannot_exceed_ten_photos(): void
    {
        $owner = $this->owner();
        $annonce = $this->annonceWithPhotos($owner, 9);

        $this->actingAs($owner)
            ->post(route('annonces.photos.store', $annonce), [
                'photos' => [UploadedFile::fake()->image('a.jpg'), UploadedFile::fake()->image('b.jpg')],
            ])
            ->assertSessionHasErrors('photos');

        $this->assertSame(9, $annonce->photos()->count());
    }

    public function test_invalid_files_are_rejected(): void
    {
        $owner = $this->owner();
        $annonce = $this->annonceWithPhotos($owner, 0);

        $this->actingAs($owner)
            ->post(route('annonces.photos.store', $annonce), [
                'photos' => [UploadedFile::fake()->create('cv.pdf', 100, 'application/pdf')],
            ])
            ->assertSessionHasErrors('photos.0');
    }

    public function test_deleting_a_photo_removes_the_file_and_renumbers(): void
    {
        $owner = $this->owner();
        $annonce = $this->annonceWithPhotos($owner, 3);
        $middle = $annonce->photos()->where('ordre', 1)->first();

        $this->actingAs($owner)
            ->delete(route('annonces.photos.destroy', [$annonce, $middle]))
            ->assertSessionHas('success');

        Storage::disk('public')->assertMissing($middle->path);
        $this->assertSame([0, 1], $annonce->photos()->orderBy('ordre')->pluck('ordre')->all());
    }

    public function test_any_photo_can_become_the_main_one(): void
    {
        $owner = $this->owner();
        $annonce = $this->annonceWithPhotos($owner, 3);
        $last = $annonce->photos()->where('ordre', 2)->first();

        $this->actingAs($owner)->patch(route('annonces.photos.main', [$annonce, $last]));

        $this->assertSame($last->id, $annonce->fresh()->mainPhoto->id);
        $this->assertSame([0, 1, 2], $annonce->photos()->orderBy('ordre')->pluck('ordre')->all());
    }

    public function test_another_owner_cannot_manage_the_photos(): void
    {
        $annonce = $this->annonceWithPhotos($this->owner(), 1);
        $photo = $annonce->photos()->first();
        $intruder = $this->owner();

        $this->actingAs($intruder)
            ->post(route('annonces.photos.store', $annonce), ['photos' => [UploadedFile::fake()->image('x.jpg')]])
            ->assertForbidden();
        $this->actingAs($intruder)->delete(route('annonces.photos.destroy', [$annonce, $photo]))->assertForbidden();
        $this->actingAs($intruder)->patch(route('annonces.photos.main', [$annonce, $photo]))->assertForbidden();
        $this->assertSame(1, $annonce->photos()->count());
    }

    public function test_a_photo_of_another_annonce_is_not_found(): void
    {
        $owner = $this->owner();
        $mine = $this->annonceWithPhotos($owner, 1);
        $other = $this->annonceWithPhotos($this->owner(), 1);

        $this->actingAs($owner)
            ->delete(route('annonces.photos.destroy', [$mine, $other->photos()->first()]))
            ->assertNotFound();
        $this->assertSame(1, $other->photos()->count());
    }
}
