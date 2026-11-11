<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Represent a product and quantity recorded in an order.
 * @property int $id
 * @property int $order_id
 * @property int $product_id
 * @property int $quantity
 * @property string $unit_price
 * @property string $product_name
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read Order $order
 * @property-read Product $product
 * @author Oriol Plazas
 * @since 1.0.0
 */
class OrderItem extends Model
{
    // OrderItem.php
    protected $table = 'orders_items';
    protected $fillable = ['product_id', 'quantity', 'unit_price', 'product_name'];
    protected $casts = ['unit_price' => 'decimal:2'];
    /**
     * Get the order containing this item.
     * @return BelongsTo<Order, $this> Order relation.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
    /**
     * Get the product referenced by this item.
     * @return BelongsTo<Product, $this> Product relation.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
