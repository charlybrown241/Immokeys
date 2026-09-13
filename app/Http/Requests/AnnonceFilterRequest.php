<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AnnonceFilterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'city' => ['nullable', 'string', 'max:100'],
            'quartier' => ['nullable', 'string', 'max:100'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'min_price' => ['nullable', 'numeric', 'min:0'],
            'max_price' => ['nullable', 'numeric', 'min:0', 'gte:min_price'],
            'min_surface' => ['nullable', 'integer', 'min:0'],
            'max_surface' => ['nullable', 'integer', 'min:0', 'gte:min_surface'],
        ];
    }
}
