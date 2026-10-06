<?php

namespace App\Console\Commands;

use App\Models\Annonce;
use App\Models\Photo;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

/**
 * Remove what DemoDataSeeder created: "*.demo*@immokeys.test" accounts and
 * "[Démo]" annonces, with everything attached to them (contacts, views,
 * favourites, reports, certifications, photos).
 */
class ClearDemoData extends Command
{
    protected $signature = 'immokeys:demo-clear {--force : Ne pas demander de confirmation}';

    protected $description = 'Supprime les données de démonstration créées par DemoDataSeeder';

    public function handle(): int
    {
        $users = User::where('email', 'like', '%.demo%@immokeys.test');
        $annonces = Annonce::where('title', 'like', '[Démo]%');

        $userCount = $users->count();
        $annonceCount = $annonces->count();

        if ($userCount === 0 && $annonceCount === 0) {
            $this->info('Aucune donnée de démonstration à supprimer.');

            return self::SUCCESS;
        }

        $this->line("Comptes de démo : {$userCount}");
        $this->line("Annonces [Démo] : {$annonceCount}");

        if (! $this->option('force') && ! $this->confirm('Supprimer définitivement ces données ?')) {
            $this->warn('Annulé.');

            return self::FAILURE;
        }

        $photoPaths = Photo::whereIn('annonce_id', (clone $annonces)->pluck('id'))->pluck('path');

        DB::transaction(function () use ($users, $annonces) {
            // Database cascades take contacts, views, favourites, reports,
            // subscriptions and certifications with them.
            $annonces->delete();
            $users->delete();
        });

        Storage::disk('public')->delete($photoPaths->all());

        $this->info('Données de démonstration supprimées.');

        return self::SUCCESS;
    }
}
