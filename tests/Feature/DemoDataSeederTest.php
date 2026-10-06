<?php

namespace Tests\Feature;

use App\Models\Annonce;
use App\Models\Certification;
use App\Models\ContactLog;
use App\Models\User;
use Database\Seeders\DemoDataSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
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

        $contacts = ContactLog::count();
        $this->seed(DemoDataSeeder::class);
        $this->assertSame($contacts, ContactLog::count());
    }
}
