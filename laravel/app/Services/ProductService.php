<?php

namespace App\Services;

use App\Models\Product;
use App\Models\User;

class ProductService
{
    /**
     * Get all products created by the user
     * @param User $user
     * @return \Illuminate\Database\Eloquent\Relations\HasMany List with products
     */
    public function getAll(User $user)
    {
        return $user->products();
    }

    /**
     * Inserts a user into the db, for the logged user
     * @param User $user
     * @param array $products Array of products gotten from request
     * @return Product Inserted
     */
    public function postProduct(User $user, array $products): Product
    {
        return $user->products()->create($products);
    }
}
