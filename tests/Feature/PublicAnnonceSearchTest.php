<?php

namespace Tests\Feature;

use App\Models\Annonce;
use App\Models\Category;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicAnnonceSearchTest extends TestCase
{
    use RefreshDatabase;

    private function owner(): User
    {
        return User::factory()->create([
            'role_id' => Role::where('name', 'proprietaire')->firstOrFail()->id,
        ]);
    }

    private function annonce(array $attributes = []): Annonce
    {
        return Annonce::create(array_merge([
            'user_id' => $this->owner()->id,
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

    public function test_guest_can_view_only_available_annonces(): void
    {
        $available = $this->annonce(['title' => 'Disponible']);
        $this->annonce(['title' => 'En attente', 'status' => 'en_attente']);
        $this->annonce(['title' => 'Louee', 'status' => 'loue']);

        $response = $this->get('/annonces');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('annonces.data', 1)
            ->where('annonces.data.0.id', $available->id)
        );
    }

    public function test_etudiant_connecte_peut_aussi_consulter_les_annonces(): void
    {
        $this->annonce();

        $etudiant = User::factory()->create([
            'role_id' => Role::where('name', 'etudiant')->firstOrFail()->id,
        ]);

        $this->actingAs($etudiant)->get('/annonces')->assertOk();
    }

    public function test_search_filter_matches_quartier_partially(): void
    {
        $maarif = $this->annonce(['quartier' => 'Maarif']);
        $this->annonce(['quartier' => 'Gauthier']);

        $response = $this->get('/annonces?search=aari');

        $response->assertInertia(fn ($page) => $page
            ->has('annonces.data', 1)
            ->where('annonces.data.0.id', $maarif->id)
        );
    }

    public function test_search_filter_also_matches_title(): void
    {
        $match = $this->annonce(['title' => 'Studio pres Universite Hassan II', 'quartier' => 'Ain Chock']);
        $this->annonce(['title' => 'Chambre simple', 'quartier' => 'Gauthier']);

        $response = $this->get('/annonces?search=Universite');

        $response->assertInertia(fn ($page) => $page
            ->has('annonces.data', 1)
            ->where('annonces.data.0.id', $match->id)
        );
    }

    public function test_category_filter(): void
    {
        $categories = Category::all();
        $studio = $this->annonce(['category_id' => $categories[0]->id]);
        $this->annonce(['category_id' => $categories[1]->id]);

        $response = $this->get('/annonces?category_id='.$categories[0]->id);

        $response->assertInertia(fn ($page) => $page
            ->has('annonces.data', 1)
            ->where('annonces.data.0.id', $studio->id)
        );
    }

    public function test_price_range_filter(): void
    {
        $this->annonce(['title' => 'Trop cher', 'price' => 9000]);
        $inRange = $this->annonce(['title' => 'Dans le budget', 'price' => 3000]);
        $this->annonce(['title' => 'Trop bas', 'price' => 500]);

        $response = $this->get('/annonces?min_price=1000&max_price=5000');

        $response->assertInertia(fn ($page) => $page
            ->has('annonces.data', 1)
            ->where('annonces.data.0.id', $inRange->id)
        );
    }

    public function test_surface_range_filter(): void
    {
        $this->annonce(['title' => 'Trop petit', 'surface' => 10]);
        $inRange = $this->annonce(['title' => 'Bonne taille', 'surface' => 30]);
        $this->annonce(['title' => 'Trop grand', 'surface' => 100]);

        $response = $this->get('/annonces?min_surface=20&max_surface=50');

        $response->assertInertia(fn ($page) => $page
            ->has('annonces.data', 1)
            ->where('annonces.data.0.id', $inRange->id)
        );
    }

    public function test_filters_combine_together(): void
    {
        $categories = Category::all();
        $match = $this->annonce([
            'quartier' => 'Maarif',
            'category_id' => $categories[0]->id,
            'price' => 2500,
            'surface' => 25,
        ]);
        $this->annonce([
            'quartier' => 'Maarif',
            'category_id' => $categories[1]->id, // wrong category
            'price' => 2500,
            'surface' => 25,
        ]);

        $response = $this->get('/annonces?'.http_build_query([
            'search' => 'Maarif',
            'category_id' => $categories[0]->id,
            'min_price' => 2000,
            'max_price' => 3000,
        ]));

        $response->assertInertia(fn ($page) => $page
            ->has('annonces.data', 1)
            ->where('annonces.data.0.id', $match->id)
        );
    }

    public function test_results_are_paginated_by_12_and_sorted_by_most_recent(): void
    {
        $first = $this->annonce(['title' => 'Ancienne']);
        sleep(1);
        $second = $this->annonce(['title' => 'Recente']);

        for ($i = 0; $i < 11; $i++) {
            $this->annonce();
        }

        $response = $this->get('/annonces');

        $response->assertInertia(fn ($page) => $page
            ->has('annonces.data', 12)
            ->where('annonces.total', 13)
            ->where('annonces.data.0.id', $second->id)
        );
    }

    public function test_defaults_to_casablanca_when_no_city_is_given(): void
    {
        $casablanca = $this->annonce(['city' => 'Casablanca']);
        $this->annonce(['city' => 'Rabat']);

        $response = $this->get('/annonces');

        $response->assertInertia(fn ($page) => $page
            ->has('annonces.data', 1)
            ->where('annonces.data.0.id', $casablanca->id)
            ->where('filters.city', 'Casablanca')
        );
    }
}
