<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class StaticPagesTest extends TestCase
{
    // The public layout's info bar counts active annonces on every page.
    use RefreshDatabase;

    public static function pagesProvider(): array
    {
        return [
            'comment ca marche' => ['/comment-ca-marche', 'Static/CommentCaMarche'],
            'securite' => ['/securite-certification', 'Static/Securite'],
            'mentions legales' => ['/mentions-legales', 'Static/MentionsLegales'],
            'confidentialite' => ['/confidentialite', 'Static/Confidentialite'],
        ];
    }

    #[DataProvider('pagesProvider')]
    public function test_static_page_is_publicly_accessible(string $url, string $component): void
    {
        $this->get($url)
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component($component));
    }
}
