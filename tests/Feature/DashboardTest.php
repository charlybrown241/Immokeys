<?php

namespace Tests\Feature;

use App\Models\Annonce;
use App\Models\Category;
use App\Models\ContactLog;
use App\Models\Photo;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class DashboardTest extends TestCase
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
            'price' => 2000,
            'status' => 'en_attente',
            'views_count' => 0,
        ], $attributes));
    }

    public function test_dashboard_computes_stats_for_the_authenticated_owner_only(): void
    {
        $owner = $this->verifiedProprietaire();
        $other = $this->verifiedProprietaire();
        $student = User::factory()->create([
            'role_id' => Role::where('name', 'etudiant')->firstOrFail()->id,
        ]);

        // Owner's annonces: 1 en_attente, 1 disponible, 2 loue.
        $this->annonceFor($owner, ['status' => 'en_attente', 'price' => 1000]);
        $this->annonceFor($owner, ['status' => 'disponible', 'price' => 2000]);
        $loue1 = $this->annonceFor($owner, ['status' => 'loue', 'price' => 3000]);
        $loue2 = $this->annonceFor($owner, ['status' => 'loue', 'price' => 4500]);

        // Recent + old contact logs on the owner's annonces.
        // "created_at" isn't mass-assignable, so forceCreate() to backdate it.
        ContactLog::forceCreate(['user_id' => $student->id, 'annonce_id' => $loue1->id, 'created_at' => now()->subDays(2)]);
        ContactLog::forceCreate(['user_id' => $student->id, 'annonce_id' => $loue2->id, 'created_at' => now()->subDays(10)]);

        // Another owner's data must never leak into these stats.
        $otherAnnonce = $this->annonceFor($other, ['status' => 'loue', 'price' => 9999]);
        ContactLog::create(['user_id' => $student->id, 'annonce_id' => $otherAnnonce->id]);

        $response = $this->actingAs($owner)->get('/dashboard');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->where('stats.activeAnnoncesCount', 3) // disponible + 2 loue
            ->where('stats.occupancyRate', 67) // round(2/3 * 100)
            ->where('stats.newLeadsCount', 1) // only the 2-day-old log
            ->where('stats.monthlyRevenue', 7500) // 3000 + 4500
            ->has('annonces', 4)
        );
    }

    public function test_registry_exposes_main_photo_views_and_leads_count(): void
    {
        $owner = $this->verifiedProprietaire();
        $student = User::factory()->create([
            'role_id' => Role::where('name', 'etudiant')->firstOrFail()->id,
            'name' => 'Amine Etudiant',
        ]);

        $annonce = $this->annonceFor($owner, ['views_count' => 42]);
        Photo::create(['annonce_id' => $annonce->id, 'path' => 'annonces/second.jpg', 'ordre' => 1]);
        Photo::create(['annonce_id' => $annonce->id, 'path' => 'annonces/first.jpg', 'ordre' => 0]);
        ContactLog::create(['user_id' => $student->id, 'annonce_id' => $annonce->id]);

        $response = $this->actingAs($owner)->get('/dashboard');

        $response->assertInertia(fn ($page) => $page
            ->where('annonces.0.views_count', 42)
            ->where('annonces.0.contact_logs_count', 1)
            ->where('annonces.0.main_photo.path', 'annonces/first.jpg')
            ->where('annonces.0.contact_logs.0.user.name', 'Amine Etudiant')
        );
    }

    public function test_dashboard_query_count_does_not_grow_with_the_number_of_annonces(): void
    {
        // Two distinct, freshly-authenticated owners so neither request can
        // benefit from relations already cached in memory by the other.
        $ownerWithOne = $this->verifiedProprietaire();
        $this->annonceFor($ownerWithOne);

        $ownerWithTen = $this->verifiedProprietaire();
        for ($i = 0; $i < 10; $i++) {
            $annonce = $this->annonceFor($ownerWithTen);
            Photo::create(['annonce_id' => $annonce->id, 'path' => "annonces/{$i}.jpg", 'ordre' => 0]);
        }

        DB::enableQueryLog();
        $this->actingAs($ownerWithOne)->get('/dashboard');
        $queriesForOne = count(DB::getQueryLog());
        DB::flushQueryLog();

        $this->actingAs($ownerWithTen)->get('/dashboard');
        $queriesForTen = count(DB::getQueryLog());
        DB::disableQueryLog();

        $this->assertSame($queriesForOne, $queriesForTen);
    }
}
