<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Represent a category used to classify products.
 * @property int $id
 * @property string $name
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Product> $products
 * @author Oriol Plazas
 * @since 1.0.0
 */
class Category extends Model
{
    protected $fillable = ['name'];
    /**
     * Get products assigned to this category.
     * @return HasMany<Product> Product relation.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
