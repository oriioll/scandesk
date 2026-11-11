<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Represent a user's completed order and total price.
 * @property int $id
 * @property int $user_id
 * @property string $total_price
 * @property string $idempotency_key
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read User $user
 * @property-read \Illuminate\Database\Eloquent\Collection<int, OrderItem> $items
 * @author Oriol Plazas
 * @since 1.0.0
 */
class Order extends Model
{
    protected $fillable = ['total_price', 'idempotency_key'];
    protected $casts = ['total_price' => 'decimal:2'];
    /**
     * Get the user who placed this order.
     * @return BelongsTo<User, $this> User relation.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    /**
     * Get the items included in this order.
     * @return HasMany<OrderItem> Order-item relation.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
