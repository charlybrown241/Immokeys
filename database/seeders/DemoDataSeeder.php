<?php

namespace Database\Seeders;

use App\Models\Annonce;
use App\Models\Certification;
use App\Models\ContactLog;
use App\Models\Report;
use App\Models\Role;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Demo data for the dashboards (local only, never called by
 * DatabaseSeeder): run `php artisan db:seed --class=DemoDataSeeder`
 * after the base seeders. Everything it creates is recognisable:
 * "*.demo*@immokeys.test" emails and "[Démo]" annonce titles.
 *
 * - proprietaire@immokeys.test gets 6 annonces with ~90 days of daily
 *   views and WhatsApp contacts (owner dashboard);
 * - etudiant@immokeys.test gets a contact history and favourites;
 * - 3 new owners wait for identity certification and 2 annonces are
 *   reported (admin dashboard).
 *
 * Remove it all with `php artisan immokeys:demo-clear`.
 */
class DemoDataSeeder extends Seeder
{
    private const QUARTIERS = ['Maarif', 'Gauthier', 'Racine', 'Bourgogne', 'CIL', 'Sidi Belyout'];

    public function run(): void
    {
        if (User::where('email', 'etudiant.demo1@immokeys.test')->exists()) {
            $this->command?->info('Données de démonstration déjà présentes : rien à faire.');

            return;
        }

        $roles = Role::pluck('id', 'name');
        $owner = User::where('email', 'proprietaire@immokeys.test')->first();
        $student = User::where('email', 'etudiant@immokeys.test')->first();

        if (! $owner || ! $student) {
            $this->command?->error('Lance d\'abord les seeders de base (php artisan db:seed).');

            return;
        }

        $students = collect(range(1, 15))->map(fn (int $i) => User::factory()->create([
            'name' => fake('fr_FR')->name(),
            'email' => "etudiant.demo{$i}@immokeys.test",
            'role_id' => $roles['etudiant'],
            'email_verified_at' => now(),
        ]))->push($student);

        $statuses = ['disponible', 'disponible', 'disponible', 'loue', 'loue', 'en_attente'];
        $annonces = collect($statuses)->map(fn (string $status, int $i) => Annonce::factory()->create([
            'user_id' => $owner->id,
            'title' => '[Démo] '.fake('fr_FR')->randomElement(['Studio lumineux', 'Chambre calme', 'Colocation conviviale', 'Appartement meublé']).' '.self::QUARTIERS[$i],
            'quartier' => self::QUARTIERS[$i],
            'status' => $status,
            'views_count' => 0,
            'created_at' => now()->subDays(fake()->numberBetween(5, 120)),
        ]));

        // Contacts over 90 days, a bit busier recently, only on listings
        // that were online.
        $online = $annonces->where('status', '!=', 'en_attente')->values();
        foreach (range(89, 0) as $daysAgo) {
            $perDay = fake()->numberBetween(0, $daysAgo < 30 ? 4 : 2);
            for ($n = 0; $n < $perDay; $n++) {
                ContactLog::forceCreate([
                    'user_id' => $students->random()->id,
                    'annonce_id' => $online->random()->id,
                    'created_at' => now()->subDays($daysAgo)->setTime(fake()->numberBetween(8, 22), fake()->numberBetween(0, 59)),
                ]);
            }
        }

        // Daily views over 90 days; views_count is their total.
        foreach ($online as $annonce) {
            $rows = collect(range(89, 0))
                ->map(fn (int $daysAgo) => [
                    'annonce_id' => $annonce->id,
                    'day' => now()->subDays($daysAgo)->toDateString(),
                    'count' => fake()->numberBetween(0, $daysAgo < 30 ? 9 : 5),
                ])
                ->filter(fn (array $row) => $row['count'] > 0);
            DB::table('annonce_views')->insert($rows->values()->all());
            $annonce->update(['views_count' => $rows->sum('count')]);
        }

        $student->favoriteAnnonces()->syncWithoutDetaching($online->take(3)->pluck('id'));

        foreach ([['arnaque', 'On me demande un virement avant la visite.'], ['deja_loue', null]] as $index => [$reason, $message]) {
            Report::create([
                'annonce_id' => $online[$index]->id,
                'user_id' => $students[$index]->id,
                'reason' => $reason,
                'message' => $message,
            ]);
        }

        // Owners waiting for identity certification.
        foreach (range(1, 3) as $i) {
            $pending = User::factory()->create([
                'name' => fake('fr_FR')->name(),
                'email' => "proprietaire.demo{$i}@immokeys.test",
                'role_id' => $roles['proprietaire'],
                'email_verified_at' => now(),
                'is_verified' => false,
            ]);
            Subscription::create(['user_id' => $pending->id, 'type' => 'gratuit']);
            Certification::forceCreate([
                'user_id' => $pending->id,
                'document_path' => 'certifications/demo.pdf',
                'status' => 'en_attente',
                'created_at' => now()->subDays($i),
            ]);
        }

        $this->command?->info('Données de démonstration créées.');
    }
}
