<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

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

    /**
     * The first photo (lowest "ordre"), fetched efficiently as a single
     * row per annonce instead of loading every photo to pick one in PHP.
     */
    public function mainPhoto(): HasOne
    {
        return $this->hasOne(Photo::class)->ofMany('ordre', 'min');
    }

    public function contactLogs(): HasMany
    {
        return $this->hasMany(ContactLog::class);
    }
}
