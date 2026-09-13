<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    /**
     * RefreshDatabase-based tests need roles seeded (users.role_id is not nullable).
     */
    protected bool $seed = true;
}
