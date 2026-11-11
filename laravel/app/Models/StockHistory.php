<?php

namespace App\Models;

use App\HistoryAction;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Record a user's product creation, update, or removal.
 * @property int $id
 * @property int|null $product_id
 * @property int|null $user_id
 * @property string|null $field
 * @property HistoryAction|null $operation
 * @property string|null $old_value
 * @property string|null $new_value
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read Product|null $product
 * @property-read User|null $user
 * @author Oriol Plazas
 * @since 1.0.0
 */
class StockHistory extends Model
{
    public const UPDATED_AT = null;
    protected $fillable = ['product_id', 'user_id', 'field', 'operation', 'old_value', 'new_value'];

    protected $casts = [
        'operation' => HistoryAction::class,
    ];
    /**
     * Get the product associated with this history entry, including soft-deleted products.
     * @return BelongsTo<Product, $this> Product relation.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class)->withTrashed();
    }

    /**
     * Get the user associated with this history entry.
     * @return BelongsTo<User, $this> User relation.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
