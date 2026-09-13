<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Annonce extends Model
{
    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'description',
        'price',
        'city',
        'quartier',
        'surface',
        'status',
        'views_count',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'surface' => 'integer',
            'views_count' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function photos(): HasMany
    {
        return $this->hasMany(Photo::class);
    }

    public function contactLogs(): HasMany
    {
        return $this->hasMany(ContactLog::class);
    }
}
