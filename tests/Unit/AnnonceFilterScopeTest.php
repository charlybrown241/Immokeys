<?php

namespace Tests\Unit;

use App\Models\Annonce;
use App\Models\Category;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AnnonceFilterScopeTest extends TestCase
{
    use RefreshDatabase;

    private function annonce(array $attributes = []): Annonce
    {
        $owner = User::factory()->create([
            'role_id' => Role::where('name', 'proprietaire')->firstOrFail()->id,
        ]);

        return Annonce::create(array_merge([
            'user_id' => $owner->id,
            'category_id' => Category::first()->id,
            'title' => 'Annonce test',
            'description' => 'Description test',
            'city' => 'Casablanca',
            'quartier' => 'Maarif',
            'price' => 2500,
            'status' => 'disponible',
        ], $attributes));
    }

    public function test_filters_by_city(): void
    {
        $this->annonce(['title' => 'Casa', 'city' => 'Casablanca']);
        $this->annonce(['title' => 'Rabat', 'city' => 'Rabat']);

        $results = Annonce::filter(['city' => 'Casablanca'])->pluck('title');

        $this->assertSame(['Casa'], $results->all());
    }

    public function test_filters_by_price_range(): void
    {
        $this->annonce(['title' => 'Pas cher', 'price' => 1500]);
        $this->annonce(['title' => 'Moyen', 'price' => 3500]);
        $this->annonce(['title' => 'Cher', 'price' => 8000]);

        $results = Annonce::filter(['min_price' => 2000, 'max_price' => 5000])->pluck('title');

        $this->assertSame(['Moyen'], $results->all());
    }

    public function test_min_price_alone_excludes_cheaper_annonces(): void
    {
        $this->annonce(['title' => 'Pas cher', 'price' => 1000]);
        $this->annonce(['title' => 'Cher', 'price' => 9000]);

        $results = Annonce::filter(['min_price' => 5000])->pluck('title');

        $this->assertSame(['Cher'], $results->all());
    }

    public function test_combining_city_and_price_range(): void
    {
        $this->annonce(['title' => 'Match', 'city' => 'Casablanca', 'price' => 3000]);
        $this->annonce(['title' => 'Mauvaise ville', 'city' => 'Rabat', 'price' => 3000]);
        $this->annonce(['title' => 'Trop cher', 'city' => 'Casablanca', 'price' => 9000]);

        $results = Annonce::filter([
            'city' => 'Casablanca',
            'min_price' => 2000,
            'max_price' => 5000,
        ])->pluck('title');

        $this->assertSame(['Match'], $results->all());
    }

    public function test_search_matches_quartier_or_title(): void
    {
        $this->annonce(['title' => 'Studio au calme', 'quartier' => 'Maarif']);
        $this->annonce(['title' => 'Studio pres Universite Hassan II', 'quartier' => 'Ain Chock']);
        $this->annonce(['title' => 'Chambre simple', 'quartier' => 'Gauthier']);

        $results = Annonce::filter(['search' => 'Universite'])->pluck('title');

        $this->assertSame(['Studio pres Universite Hassan II'], $results->all());
    }

    public function test_no_filters_returns_everything(): void
    {
        $this->annonce(['title' => 'Une']);
        $this->annonce(['title' => 'Deux']);

        $this->assertCount(2, Annonce::filter([])->get());
    }
}
