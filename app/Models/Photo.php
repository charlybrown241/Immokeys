<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Photo extends Model
{
    protected $table = 'annonce_photos';

    protected $fillable = [
        'annonce_id',
        'path',
        'ordre',
    ];

    protected function casts(): array
    {
        return [
            'ordre' => 'integer',
        ];
    }

    public function annonce(): BelongsTo
    {
        return $this->belongsTo(Annonce::class);
    }
}
