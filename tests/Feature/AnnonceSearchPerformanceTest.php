<?php

namespace Tests\Feature;

use App\Models\Annonce;
use App\Models\Category;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\AnnonceLoadTestSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class AnnonceSearchPerformanceTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Generates 1000+ annonces (via the load-test seeder) spread across
     * several quartiers and price ranges, then asserts /annonces still
     * answers with a bounded, non-growing number of queries and within a
     * reasonable time - i.e. pagination + eager loading are doing their
     * job instead of scanning/loading the whole table per request.
     */
    public function test_annonces_page_stays_fast_with_a_realistic_data_volume(): void
    {
        $owner = User::factory()->create([
            'role_id' => Role::where('name', 'proprietaire')->firstOrFail()->id,
        ]);

        Annonce::create([
            'user_id' => $owner->id,
            'category_id' => Category::first()->id,
            'title' => 'Seule annonce avant le volume de test',
            'description' => 'Description test',
            'city' => 'Casablanca',
            'quartier' => 'Maarif',
            'price' => 2500,
            'status' => 'disponible',
        ]);

        DB::enableQueryLog();
        $this->get('/annonces')->assertOk();
        $queriesWithOneAnnonce = count(DB::getQueryLog());
        DB::flushQueryLog();
        DB::disableQueryLog();

        $this->seed(AnnonceLoadTestSeeder::class);

        DB::enableQueryLog();
        $start = microtime(true);
        $response = $this->get('/annonces');
        $elapsedSeconds = microtime(true) - $start;
        $queriesWithAThousandAnnonces = count(DB::getQueryLog());
        DB::disableQueryLog();

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->where('annonces.total', 1001));

        $this->assertSame(
            $queriesWithOneAnnonce,
            $queriesWithAThousandAnnonces,
            'Le nombre de requetes SQL ne doit pas augmenter avec le volume de donnees (pagination + eager loading).'
        );

        $this->assertLessThan(
            3.0,
            $elapsedSeconds,
            'La page /annonces est devenue trop lente avec un volume realiste de donnees (1000+ annonces).'
        );
    }
}
