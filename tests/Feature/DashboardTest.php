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

        // Owner's annonces: 1 en_attente, 1 disponible, 2 loue, 1 suspended.
        $this->annonceFor($owner, ['status' => 'en_attente', 'views_count' => 5]);
        $this->annonceFor($owner, ['status' => 'disponible', 'views_count' => 40]);
        $loue1 = $this->annonceFor($owner, ['status' => 'loue', 'views_count' => 10]);
        $loue2 = $this->annonceFor($owner, ['status' => 'loue']);
        $this->annonceFor($owner, ['status' => 'disponible', 'is_suspended' => true]);

        // "created_at" isn't mass-assignable, so forceCreate() to backdate it.
        ContactLog::forceCreate(['user_id' => $student->id, 'annonce_id' => $loue1->id, 'created_at' => now()->subDays(2)]);
        ContactLog::forceCreate(['user_id' => $student->id, 'annonce_id' => $loue2->id, 'created_at' => now()->subDays(10)]);
        ContactLog::forceCreate(['user_id' => $student->id, 'annonce_id' => $loue2->id, 'created_at' => now()->subDays(45)]);

        // Another owner's data must never leak into these stats.
        $otherAnnonce = $this->annonceFor($other, ['status' => 'loue', 'views_count' => 999]);
        ContactLog::create(['user_id' => $student->id, 'annonce_id' => $otherAnnonce->id]);

        $response = $this->actingAs($owner)->get('/dashboard');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Dashboard')
            ->where('stats.activeAnnoncesCount', 1) // disponible and not suspended
            ->where('stats.contactsCount', 3)
            ->where('stats.contactsLast30', 2)
            ->where('stats.contactsDelta', 100) // 2 vs 1 over the previous 30 days
            ->where('stats.viewsTotal', 55)
            ->where('annoncesByStatus.disponible', 1)
            ->where('annoncesByStatus.loue', 2)
            ->where('annoncesByStatus.en_attente', 1)
            ->where('annoncesByStatus.suspendue', 1)
            ->has('contactsSeries', 90)
        );
    }

    public function test_contacts_series_counts_contacts_per_day(): void
    {
        $owner = $this->verifiedProprietaire();
        $student = User::factory()->create([
            'role_id' => Role::where('name', 'etudiant')->firstOrFail()->id,
        ]);
        $annonce = $this->annonceFor($owner, ['status' => 'disponible']);
        ContactLog::forceCreate(['user_id' => $student->id, 'annonce_id' => $annonce->id, 'created_at' => now()->subDays(3)]);
        ContactLog::forceCreate(['user_id' => $student->id, 'annonce_id' => $annonce->id, 'created_at' => now()->subDays(3)]);
        ContactLog::create(['user_id' => $student->id, 'annonce_id' => $annonce->id]);

        $this->actingAs($owner)->get('/dashboard')->assertInertia(fn ($page) => $page
            ->where('contactsSeries.89.date', now()->toDateString())
            ->where('contactsSeries.89.count', 1)
            ->where('contactsSeries.86.date', now()->subDays(3)->toDateString())
            ->where('contactsSeries.86.count', 2)
            ->where('contactsSeries.0.count', 0));
    }

    public function test_views_series_and_this_month_total(): void
    {
        $owner = $this->verifiedProprietaire();
        $mine = $this->annonceFor($owner, ['status' => 'disponible']);
        $other = $this->annonceFor($this->verifiedProprietaire(), ['status' => 'disponible']);

        DB::table('annonce_views')->insert([
            ['annonce_id' => $mine->id, 'day' => now()->toDateString(), 'count' => 4],
            ['annonce_id' => $mine->id, 'day' => now()->subDays(2)->toDateString(), 'count' => 3],
            ['annonce_id' => $mine->id, 'day' => now()->subDays(120)->toDateString(), 'count' => 50],
            ['annonce_id' => $other->id, 'day' => now()->toDateString(), 'count' => 99],
        ]);

        $expectedMonth = 4 + (now()->subDays(2)->isSameMonth(now()) ? 3 : 0);

        $this->actingAs($owner)->get('/dashboard')->assertInertia(fn ($page) => $page
            ->has('viewsSeries', 90)
            ->where('viewsSeries.89.count', 4)
            ->where('viewsSeries.87.count', 3)
            ->where('stats.viewsThisMonth', $expectedMonth));
    }

    public function test_recent_contacts_and_top_viewed_annonces(): void
    {
        $owner = $this->verifiedProprietaire();
        $student = User::factory()->create([
            'role_id' => Role::where('name', 'etudiant')->firstOrFail()->id,
            'name' => 'Amine Etudiant',
        ]);

        $popular = $this->annonceFor($owner, ['title' => 'Populaire', 'views_count' => 42]);
        $this->annonceFor($owner, ['title' => 'Discrete', 'views_count' => 3]);
        ContactLog::forceCreate(['user_id' => $student->id, 'annonce_id' => $popular->id, 'created_at' => now()->subDays(20), 'status' => 'traite']);
        ContactLog::forceCreate(['user_id' => $student->id, 'annonce_id' => $popular->id, 'created_at' => now()->subDays(30), 'status' => 'archive']);
        ContactLog::create(['user_id' => $student->id, 'annonce_id' => $popular->id]);

        $this->actingAs($owner)->get('/dashboard')->assertInertia(fn ($page) => $page
            ->has('recentContacts', 2)
            ->where('recentContacts.0.student', 'Amine Etudiant')
            ->where('recentContacts.0.annonce.title', 'Populaire')
            ->where('recentContacts.0.status', 'nouveau')
            ->where('recentContacts.1.status', 'traite')
            ->where('topViewed.0.title', 'Populaire')
            ->where('topViewed.0.views_count', 42)
            ->where('topViewed.0.contacts_count', 3) // archived contacts still count
            ->where('topViewed.1.title', 'Discrete'));
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
