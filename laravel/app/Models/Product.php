<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Represent a user's catalog product and stock level.
 * @property int $id
 * @property int $user_id
 * @property int|null $category_id
 * @property string $barcode
 * @property string $name
 * @property string $price
 * @property int $stock
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read User $user
 * @property-read Category|null $category
 * @property-read \Illuminate\Database\Eloquent\Collection<int, StockHistory> $stockHistory
 * @author Oriol Plazas
 * @since 1.0.0
 */
class Product extends Model
{
    use SoftDeletes;
    protected $fillable = ['category_id', 'barcode', 'name', 'price', 'stock'];
    protected $casts = ['price' => 'decimal:2'];
    /**
     * Get the user who owns this product.
     * @return BelongsTo<User, $this> User relation.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    /**
     * Get the product's category.
     * @return BelongsTo<Category, $this> Category relation.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
    /**
     * Get stock-history records for this product.
     * @return HasMany<StockHistory> Stock-history relation.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function stockHistory(): HasMany
    {
        return $this->hasMany(StockHistory::class);
    }
}
