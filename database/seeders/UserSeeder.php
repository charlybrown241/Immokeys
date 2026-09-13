<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Comptes de test crees (mot de passe : "password") :
 * - admin@immokeys.test        (role admin)
 * - proprietaire@immokeys.test (role proprietaire, verifie, abonnement pro actif)
 * - etudiant@immokeys.test     (role etudiant, abonnement gratuit)
 */
class UserSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::where('name', 'admin')->firstOrFail();
        $proprietaireRole = Role::where('name', 'proprietaire')->firstOrFail();
        $etudiantRole = Role::where('name', 'etudiant')->firstOrFail();

        $admin = User::firstOrCreate(
            ['email' => 'admin@immokeys.test'],
            [
                'name' => 'Admin ImmoKeys',
                'password' => Hash::make('password'),
                'role_id' => $adminRole->id,
                'is_verified' => true,
                'email_verified_at' => now(),
            ]
        );

        $proprietaire = User::firstOrCreate(
            ['email' => 'proprietaire@immokeys.test'],
            [
                'name' => 'Proprietaire Test',
                'password' => Hash::make('password'),
                'role_id' => $proprietaireRole->id,
                'is_verified' => true,
                'phone' => '+212600000001',
                'email_verified_at' => now(),
            ]
        );

        Subscription::firstOrCreate(
            ['user_id' => $proprietaire->id],
            [
                'type' => 'pro',
                'started_at' => now(),
                'expires_at' => now()->addYear(),
            ]
        );

        $etudiant = User::firstOrCreate(
            ['email' => 'etudiant@immokeys.test'],
            [
                'name' => 'Etudiant Test',
                'password' => Hash::make('password'),
                'role_id' => $etudiantRole->id,
                'is_verified' => false,
                'email_verified_at' => now(),
            ]
        );

        Subscription::firstOrCreate(
            ['user_id' => $etudiant->id],
            [
                'type' => 'gratuit',
            ]
        );
    }
}
