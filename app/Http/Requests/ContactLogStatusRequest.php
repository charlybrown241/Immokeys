<?php

namespace App\Http\Requests;

use App\Models\ContactLog;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ContactLogStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('contactLog'));
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in(ContactLog::STATUSES)],
        ];
    }
}
