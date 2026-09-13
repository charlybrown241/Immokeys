<?php

namespace Tests\Unit;

use App\Http\Requests\AnnonceStoreRequest;
use App\Http\Requests\AnnonceUpdateRequest;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

class AnnoncePriceValidationTest extends TestCase
{
    /**
     * @return array<string, mixed>
     */
    private function priceRules(): array
    {
        return (new AnnonceStoreRequest)->rules()['price'];
    }

    public function test_a_negative_price_is_rejected(): void
    {
        $validator = Validator::make(['price' => -100], ['price' => $this->priceRules()]);

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('price', $validator->errors()->toArray());
    }

    public function test_a_non_numeric_price_is_rejected(): void
    {
        $validator = Validator::make(['price' => 'gratuit'], ['price' => $this->priceRules()]);

        $this->assertTrue($validator->fails());
    }

    public function test_a_missing_price_is_rejected(): void
    {
        $validator = Validator::make([], ['price' => $this->priceRules()]);

        $this->assertTrue($validator->fails());
    }

    public function test_zero_is_an_accepted_price(): void
    {
        $validator = Validator::make(['price' => 0], ['price' => $this->priceRules()]);

        $this->assertFalse($validator->fails());
    }

    public function test_a_valid_positive_price_is_accepted(): void
    {
        $validator = Validator::make(['price' => 2500.50], ['price' => $this->priceRules()]);

        $this->assertFalse($validator->fails());
    }

    public function test_the_update_request_applies_the_same_price_rule(): void
    {
        $rules = (new AnnonceUpdateRequest)->rules()['price'];

        $validator = Validator::make(['price' => -1], ['price' => $rules]);

        $this->assertTrue($validator->fails());
    }
}
