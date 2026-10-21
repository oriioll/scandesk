<?php

namespace App\Services;

use App\Models\Category;

class CategoryService
{
    /**
     * Get all the categories
     */
    public function getAll()
    {
        return Category::all();
    }
}
