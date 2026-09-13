<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContactLog extends Model
{
    const UPDATED_AT = null;

    protected $table = 'contacts_logs';

    protected $fillable = [
        'user_id',
        'annonce_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function annonce(): BelongsTo
    {
        return $this->belongsTo(Annonce::class);
    }
}
