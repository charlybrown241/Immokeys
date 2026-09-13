<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        foreach (['Studio', 'Appartement', "Chambre chez l'habitant", 'Colocation'] as $name) {
            Category::firstOrCreate(['name' => $name]);
        }
    }
}
