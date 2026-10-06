<?php

namespace Tests\Feature;

use App\Models\NewsletterSubscriber;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NewsletterTest extends TestCase
{
    use RefreshDatabase;

    public function test_an_address_can_sign_up(): void
    {
        $this->from('/')->post(route('newsletter.store'), ['email' => ' Salma@Exemple.MA '])
            ->assertRedirect('/')
            ->assertSessionHas('newsletter');

        $this->assertDatabaseHas('newsletter_subscribers', ['email' => 'salma@exemple.ma']);
    }

    public function test_signing_up_twice_gives_the_same_answer_without_duplicates(): void
    {
        $this->post(route('newsletter.store'), ['email' => 'deja@exemple.ma'])->assertSessionHas('newsletter');
        $this->post(route('newsletter.store'), ['email' => 'DEJA@exemple.ma'])->assertSessionHas('newsletter');

        $this->assertSame(1, NewsletterSubscriber::count());
    }

    public function test_an_invalid_address_is_rejected(): void
    {
        $this->post(route('newsletter.store'), ['email' => 'pas-un-email'])->assertSessionHasErrors('email');
        $this->assertSame(0, NewsletterSubscriber::count());
    }
}
