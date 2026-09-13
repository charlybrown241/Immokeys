<?php

namespace Tests\Feature;

use App\Models\Annonce;
use App\Models\Category;
use App\Models\Role;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class SharedSubscriptionPropTest extends TestCase
{
    use RefreshDatabase;

    private function etudiant(string $subscriptionType = 'gratuit'): User
    {
        $user = User::factory()->create([
            'role_id' => Role::where('name', 'etudiant')->firstOrFail()->id,
        ]);

        Subscription::create(['user_id' => $user->id, 'type' => $subscriptionType]);

        return $user;
    }

    private function annonce(): Annonce
    {
        $owner = User::factory()->create([
            'role_id' => Role::where('name', 'proprietaire')->firstOrFail()->id,
        ]);

        return Annonce::create([
            'user_id' => $owner->id,
            'category_id' => Category::first()->id,
            'title' => 'Studio meuble',
            'description' => 'Description test',
            'city' => 'Casablanca',
            'quartier' => 'Maarif',
            'price' => 2500,
            'status' => 'disponible',
        ]);
    }

    public function test_shared_auth_user_includes_role_name_and_subscription_type(): void
    {
        $etudiant = $this->etudiant('gratuit');

        $response = $this->actingAs($etudiant)->get('/annonces');

        $response->assertInertia(fn ($page) => $page
            ->where('auth.user.role.name', 'etudiant')
            ->where('auth.user.subscription.type', 'gratuit')
        );
    }

    public function test_sharing_role_and_subscription_does_not_grow_with_page_content(): void
    {
        // Two distinct, freshly-authenticated students so neither request
        // benefits from relations already cached in memory by the other.
        $etudiantWithOne = $this->etudiant('gratuit');
        $this->annonce();

        $etudiantWithTen = $this->etudiant('gratuit');
        for ($i = 0; $i < 10; $i++) {
            $this->annonce();
        }

        DB::enableQueryLog();
        $this->actingAs($etudiantWithOne)->get('/annonces');
        $queriesForOneAnnonce = count(DB::getQueryLog());
        DB::flushQueryLog();

        $this->actingAs($etudiantWithTen)->get('/annonces');
        $queriesForTenAnnonces = count(DB::getQueryLog());
        DB::disableQueryLog();

        $this->assertSame($queriesForOneAnnonce, $queriesForTenAnnonces);
    }

    public function test_guest_has_no_auth_user_and_sees_no_subscription_data(): void
    {
        $response = $this->get('/annonces');

        $response->assertInertia(fn ($page) => $page
            ->where('auth.user', null)
        );
    }

    public function test_upgrading_to_premium_is_reflected_on_the_next_inertia_visit(): void
    {
        $etudiant = $this->etudiant('gratuit');

        $before = $this->actingAs($etudiant)->get('/annonces');
        $before->assertInertia(fn ($page) => $page
            ->where('auth.user.subscription.type', 'gratuit')
        );

        $this->actingAs($etudiant)->post('/abonnement/upgrade');

        $after = $this->actingAs($etudiant)->get('/annonces');
        $after->assertInertia(fn ($page) => $page
            ->where('auth.user.subscription.type', 'premium')
        );
    }
}
