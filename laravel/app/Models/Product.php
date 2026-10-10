<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    // Product.php
    protected $fillable = ['category_id', 'barcode', 'name', 'price', 'stock'];
    protected $casts = ['price' => 'decimal:2'];
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
    public function stockHistory(): HasMany
    {
        return $this->hasMany(StockHistory::class);
    }
}
