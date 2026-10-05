<?php

namespace Tests\Feature;

use Tests\TestCase;

class DesignSystemPageTest extends TestCase
{
    public function test_design_system_page_is_not_exposed_outside_local(): void
    {
        $this->get('/design-system')->assertNotFound();
    }
}
