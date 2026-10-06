<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Report extends Model
{
    /** Reasons a user can pick, key => label. */
    public const REASONS = [
        'arnaque' => 'Arnaque ou demande de paiement suspecte',
        'deja_loue' => 'Logement déjà loué',
        'infos_fausses' => 'Informations ou photos trompeuses',
        'contenu_inapproprie' => 'Contenu inapproprié',
        'autre' => 'Autre raison',
    ];

    /** Review states, in workflow order. */
    public const STATUSES = ['nouveau', 'traite', 'rejete'];

    protected $fillable = [
        'annonce_id',
        'user_id',
        'reason',
        'message',
        'status',
        'handled_by',
        'handled_at',
    ];

    protected function casts(): array
    {
        return [
            'handled_at' => 'datetime',
        ];
    }

    public function annonce(): BelongsTo
    {
        return $this->belongsTo(Annonce::class);
    }

    /** The user who reported the annonce. */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function handler(): BelongsTo
    {
        return $this->belongsTo(User::class, 'handled_by');
    }
}
