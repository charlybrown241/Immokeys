<?php

namespace App\Http\Requests;

use App\Models\Annonce;
use Illuminate\Foundation\Http\FormRequest;

class AnnonceStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create', Annonce::class);
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
            'price' => ['required', 'numeric', 'min:0'],
            'photos' => ['nullable', 'array'],
            'photos.*' => ['file', 'image', 'max:5120'],
        ];
    }
}
