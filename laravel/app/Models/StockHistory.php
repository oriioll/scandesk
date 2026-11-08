<?php

namespace App\Models;

use App\HistoryAction;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockHistory extends Model
{
    public const UPDATED_AT = null;
    protected $fillable = ['product_id', 'user_id', 'field', 'operation', 'old_value', 'new_value'];

    protected $casts = [
        'operation' => HistoryAction::class,
    ];
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
