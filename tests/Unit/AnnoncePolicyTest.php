<?php

namespace Tests\Unit;

use App\Models\Annonce;
use App\Models\Category;
use App\Models\Role;
use App\Models\User;
use App\Policies\AnnoncePolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AnnoncePolicyTest extends TestCase
{
    use RefreshDatabase;

    private AnnoncePolicy $policy;

    protected function setUp(): void
    {
        parent::setUp();

        $this->policy = new AnnoncePolicy;
    }

    public function test_verified_proprietaire_can_create_annonces(): void
    {
        $user = User::factory()->create([
            'role_id' => Role::where('name', 'proprietaire')->firstOrFail()->id,
            'is_verified' => true,
        ]);

        $this->assertTrue($this->policy->create($user));
    }

    public function test_unverified_proprietaire_cannot_create_annonces(): void
    {
        $user = User::factory()->create([
            'role_id' => Role::where('name', 'proprietaire')->firstOrFail()->id,
            'is_verified' => false,
        ]);

        $this->assertFalse($this->policy->create($user));
    }

    public function test_etudiant_cannot_create_annonces(): void
    {
        $user = User::factory()->create([
            'role_id' => Role::where('name', 'etudiant')->firstOrFail()->id,
            'is_verified' => true,
        ]);

        $this->assertFalse($this->policy->create($user));
    }

    public function test_owner_can_update_and_delete_their_annonce(): void
    {
        $owner = User::factory()->create([
            'role_id' => Role::where('name', 'proprietaire')->firstOrFail()->id,
        ]);
        $annonce = $this->makeAnnonce($owner);

        $this->assertTrue($this->policy->update($owner, $annonce));
        $this->assertTrue($this->policy->delete($owner, $annonce));
    }

    public function test_another_user_cannot_update_or_delete_the_annonce(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $annonce = $this->makeAnnonce($owner);

        $this->assertFalse($this->policy->update($otherUser, $annonce));
        $this->assertFalse($this->policy->delete($otherUser, $annonce));
    }

    private function makeAnnonce(User $owner): Annonce
    {
        return Annonce::create([
            'user_id' => $owner->id,
            'category_id' => Category::first()->id,
            'title' => 'Studio meuble',
            'description' => 'Description test',
            'price' => 2500,
            'city' => 'Casablanca',
            'quartier' => 'Maarif',
        ]);
    }
}
