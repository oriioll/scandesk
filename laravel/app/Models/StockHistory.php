<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockHistory extends Model
{
    // StockHistory.php
    protected $table = 'stock_history';
    public const UPDATED_AT = null;
    protected $fillable = ['product_id', 'operation', 'old_value', 'new_value'];
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
