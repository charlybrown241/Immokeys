<?php

namespace App\Http\Requests;

use App\Models\Annonce;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AnnonceUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('annonce'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'description' => ['required', 'string'],
            'quartier' => ['required', 'string', 'max:100'],
            'surface' => ['nullable', 'integer', 'min:1'],
            'rooms' => ['nullable', 'integer', 'min:1', 'max:20'],
            'is_furnished' => ['nullable', 'boolean'],
            'available_from' => ['nullable', 'date'],
            'price' => ['required', 'numeric', 'min:0'],
            'charges' => ['nullable', 'numeric', 'min:0'],
            'deposit' => ['nullable', 'numeric', 'min:0'],
            'amenities' => ['nullable', 'array'],
            'amenities.*' => ['distinct', Rule::in(array_keys(Annonce::AMENITIES))],
            'status' => ['required', Rule::in(['en_attente', 'disponible', 'loue'])],
        ];
    }
}
