<?php

namespace Database\Factories;

use App\Models\Annonce;
use App\Models\Category;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Annonce>
 */
class AnnonceFactory extends Factory
{
    protected $model = Annonce::class;

    /**
     * Casablanca neighborhoods used to spread generated annonces across
     * several quartiers, matching the public search filters.
     */
    private const QUARTIERS = [
        'Maarif', 'Gauthier', 'Racine', 'Bourgogne', 'CIL',
        'Sidi Belyout', 'Ain Diab', 'Californie', 'Hay Hassani', 'Ain Sebaa',
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => fn () => User::factory()->state([
                'role_id' => Role::where('name', 'proprietaire')->firstOrFail()->id,
                'is_verified' => true,
            ]),
            'category_id' => fn () => Category::inRandomOrder()->value('id') ?? Category::factory(),
            'title' => fake()->sentence(4),
            'description' => fake()->paragraph(),
            'price' => fake()->numberBetween(1500, 12000),
            'city' => 'Casablanca',
            'quartier' => fake()->randomElement(self::QUARTIERS),
            'surface' => fake()->numberBetween(9, 120),
            'status' => 'disponible',
            'views_count' => 0,
            'is_suspended' => false,
        ];
    }

    /**
     * A listing still awaiting admin/owner publication.
     */
    public function pending(): static
    {
        return $this->state(fn () => ['status' => 'en_attente']);
    }

    /**
     * A listing already rented out.
     */
    public function loue(): static
    {
        return $this->state(fn () => ['status' => 'loue']);
    }
}
