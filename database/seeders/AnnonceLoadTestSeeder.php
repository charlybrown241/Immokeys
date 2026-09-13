<?php

namespace Database\Seeders;

use App\Models\Annonce;
use App\Models\Category;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Generates a realistic volume of annonces (1000 by default) spread across
 * several quartiers, price ranges and owners, to manually check that the
 * public search page (/annonces) stays fast under load.
 *
 * Not part of the default DatabaseSeeder chain (it would slow down every
 * `migrate:fresh --seed` and every RefreshDatabase-based test run). Run it
 * explicitly when needed:
 *
 *   php artisan db:seed --class=Database\\Seeders\\AnnonceLoadTestSeeder
 */
class AnnonceLoadTestSeeder extends Seeder
{
    public function run(): void
    {
        $proprietaireRole = Role::where('name', 'proprietaire')->firstOrFail();

        $owners = User::factory()
            ->count(20)
            ->state([
                'role_id' => $proprietaireRole->id,
                'is_verified' => true,
            ])
            ->create();

        $categories = Category::all();

        if ($categories->isEmpty()) {
            $categories = Category::factory()->count(4)->create();
        }

        Annonce::factory()
            ->count(1000)
            ->state(fn () => [
                'user_id' => $owners->random()->id,
                'category_id' => $categories->random()->id,
            ])
            ->create();

        $this->command?->info('1000 annonces de test creees (20 proprietaires).');
    }
}
