<?php

namespace App\Models;

use Database\Factories\AnnonceFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Annonce extends Model
{
    /** @use HasFactory<AnnonceFactory> */
    use HasFactory;

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
        'is_suspended',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'surface' => 'integer',
            'views_count' => 'integer',
            'is_suspended' => 'boolean',
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

    /**
     * Apply the public search engine's combinable filters (city, free-text
     * search on quartier/title, category, price range, surface range).
     * Extracted onto the model so it can be unit-tested independently of
     * the controller/HTTP stack.
     *
     * @param  array<string, mixed>  $filters
     */
    public function scopeFilter(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['city'] ?? null, fn ($q, $value) => $q->where('city', $value))
            ->when($filters['search'] ?? null, fn ($q, $value) => $q->where(
                fn ($sub) => $sub->where('quartier', 'like', "%{$value}%")
                    ->orWhere('title', 'like', "%{$value}%")
            ))
            ->when($filters['category_id'] ?? null, fn ($q, $value) => $q->where('category_id', $value))
            ->when($filters['min_price'] ?? null, fn ($q, $value) => $q->where('price', '>=', $value))
            ->when($filters['max_price'] ?? null, fn ($q, $value) => $q->where('price', '<=', $value))
            ->when($filters['min_surface'] ?? null, fn ($q, $value) => $q->where('surface', '>=', $value))
            ->when($filters['max_surface'] ?? null, fn ($q, $value) => $q->where('surface', '<=', $value));
    }
}
