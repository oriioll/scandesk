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
        return $user->products()->get();
    }

    /**
     * Get the product with a barcode if created by the user
     * @param User $user
     * @param string $barcode The barcode to search the product
     * @return Product
     */
    public function getByBarcode(User $user, string $barcode): Product
    {
        return $user->products()->with('category')->where('barcode', $barcode)->firstOrFail();
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

    /**
     * Updates a product if created by the user
     * @param User $user
     * @param string $id The id of the product to update
     * @param array $data Validated data gotten from request
     * @return Product Updated
     */
    public function updateProduct(User $user, string $id, array $data): Product
    {
        $product = $user->products()->findOrFail($id);
        $product->update($data);

        return $product;
    }
}
