<?php

namespace App\Http\Requests;

use App\Models\Report;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReportStoreRequest extends FormRequest
{
    /**
     * Anyone signed in may report, except the annonce's own owner.
     */
    public function authorize(): bool
    {
        return $this->route('annonce')->user_id !== $this->user()->id;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'reason' => ['required', Rule::in(array_keys(Report::REASONS))],
            'message' => ['nullable', 'required_if:reason,autre', 'string', 'max:1000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'reason.required' => 'Choisis une raison.',
            'message.required_if' => 'Précise la raison du signalement.',
        ];
    }
}
