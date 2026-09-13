<?php

namespace Tests\Unit;

use App\Models\Certification;
use App\Models\Role;
use App\Models\User;
use App\Policies\CertificationPolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CertificationPolicyTest extends TestCase
{
    use RefreshDatabase;

    private CertificationPolicy $policy;

    protected function setUp(): void
    {
        parent::setUp();

        $this->policy = new CertificationPolicy;
    }

    public function test_admin_can_approve_and_reject_certifications(): void
    {
        $admin = User::factory()->create([
            'role_id' => Role::where('name', 'admin')->firstOrFail()->id,
        ]);
        $certification = $this->makeCertification();

        $this->assertTrue($this->policy->approve($admin, $certification));
        $this->assertTrue($this->policy->reject($admin, $certification));
    }

    public function test_proprietaire_cannot_approve_or_reject_certifications(): void
    {
        $user = User::factory()->create([
            'role_id' => Role::where('name', 'proprietaire')->firstOrFail()->id,
        ]);
        $certification = $this->makeCertification();

        $this->assertFalse($this->policy->approve($user, $certification));
        $this->assertFalse($this->policy->reject($user, $certification));
    }

    private function makeCertification(): Certification
    {
        $owner = User::factory()->create([
            'role_id' => Role::where('name', 'proprietaire')->firstOrFail()->id,
        ]);

        return Certification::create([
            'user_id' => $owner->id,
            'document_path' => 'certifications/cin-test.pdf',
        ]);
    }
}
