<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Represent a temporary session used to pair a device with a user.
 * @property int $id
 * @property int $user_id
 * @property string $token_hash
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon $expires_at
 * @property \Illuminate\Support\Carbon|null $claimed_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read User $user
 * @author Oriol Plazas
 * @since 1.0.0
 */
class PairingSession extends Model
{
    // PairingSession.php
    protected $fillable = ['token_hash', 'expires_at'];
    protected $casts = ['is_active' => 'boolean', 'expires_at' => 'datetime', 'claimed_at' => 'datetime'];
    /**
     * Get the user who owns this pairing session.
     * @return BelongsTo<User, $this> User relation.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
