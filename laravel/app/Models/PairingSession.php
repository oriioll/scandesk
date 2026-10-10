<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PairingSession extends Model
{
    // PairingSession.php
    protected $fillable = ['token_hash', 'expires_at'];
    protected $casts = ['is_active' => 'boolean', 'expires_at' => 'datetime'];
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
