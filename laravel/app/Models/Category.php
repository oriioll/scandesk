<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    // Category.php
    protected $fillable = ['name'];
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
