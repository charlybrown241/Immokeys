<?php

namespace App\Http\Requests;

use App\Models\Annonce;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;

class AnnoncePhotoStoreRequest extends FormRequest
{
    /** Same cap as AnnonceStoreRequest. */
    public const MAX_PHOTOS = 10;

    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('annonce'));
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var Annonce $annonce */
        $annonce = $this->route('annonce');
        $room = max(self::MAX_PHOTOS - $annonce->photos()->count(), 0);

        return [
            'photos' => ['required', 'array', 'min:1', "max:{$room}"],
            'photos.*' => File::types(['jpg', 'jpeg', 'png', 'webp'])->max(5 * 1024),
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'photos.max' => 'Une annonce peut avoir au maximum '.self::MAX_PHOTOS.' photos.',
        ];
    }
}
