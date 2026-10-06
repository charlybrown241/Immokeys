<?php

namespace Tests\Feature;

use App\Models\Annonce;
use App\Models\Certification;
use App\Models\ContactLog;
use App\Models\Report;
use App\Models\User;
use Database\Seeders\DemoDataSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class DemoDataSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_demo_seeder_fills_the_dashboards_and_runs_only_once(): void
    {
        $this->seed(DemoDataSeeder::class);

        $owner = User::where('email', 'proprietaire@immokeys.test')->firstOrFail();
        $this->assertSame(6, Annonce::where('user_id', $owner->id)->count());
        $this->assertGreaterThan(0, ContactLog::count());
        $this->assertSame(3, Certification::where('status', 'en_attente')->count());

        $this->assertGreaterThan(0, DB::table('annonce_views')->count());
        $this->assertSame(2, Report::count());
        $this->assertSame(3, User::where('email', 'etudiant@immokeys.test')->first()->favoriteAnnonces()->count());

        $contacts = ContactLog::count();
        $this->seed(DemoDataSeeder::class);
        $this->assertSame($contacts, ContactLog::count());
    }

    public function test_demo_clear_removes_only_demo_data(): void
    {
        $this->seed(DemoDataSeeder::class);
        $realAnnonce = Annonce::factory()->create(['title' => 'Vraie annonce']);

        $this->artisan('immokeys:demo-clear', ['--force' => true])->assertSuccessful();

        $this->assertSame(0, User::where('email', 'like', '%.demo%@immokeys.test')->count());
        $this->assertSame(0, Annonce::where('title', 'like', '[Démo]%')->count());
        $this->assertSame(0, Report::count());
        $this->assertSame(0, DB::table('annonce_views')->count());
        $this->assertModelExists($realAnnonce);
        $this->assertNotNull(User::where('email', 'proprietaire@immokeys.test')->first());
        $this->assertNotNull(User::where('email', 'etudiant@immokeys.test')->first());
    }
}
