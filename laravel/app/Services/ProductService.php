<?php

namespace App\Services;

use App\Models\Product;
use App\Models\User;

class ProductService
{
    public function __construct(private HistoryService $historyService) {}
    /**
     * Get all products created by the user
     * @param User $user
     * @return \Illuminate\Database\Eloquent\Collection<int, Product> List with products
     */
    public function getAll(User $user)
    {
        return $user->products()->with('category')->get();
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
     * Get the product with a id if created by the user
     * @param User $user
     * @param string $id The id to search the product
     * @return Product
     */
    public function getById(User $user, string $id): Product
    {
        return $user->products()->with('category')->where('id', $id)->firstOrFail();
    }

    /**
     * Inserts a user into the db, for the logged user
     * @param User $user
     * @param array $products Array of products gotten from request
     * @return Product Inserted
     */
    public function postProduct(User $user, array $products): Product
    {
        $created = $user->products()->create($products)->load('category');
        $this->historyService->productCreation($user, $created);
        return $created;
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
        $old = clone $product;
        $product->fill($data);
        $fields = array_keys($product->getDirty());
        $product->save();
        //Loop all the edited fields
        foreach ($fields as $field) {
            $this->historyService->productEdition($user, $old, $product, $field);
        }
        return $product->load('category');
    }
    /**
     * Deletes a product if created by the user
     * @param User $user
     * @param string $id The id of the product to update
     * @return bool
     */
    public function deleteProduct(User $user, string $id): bool
    {
        $product = $user->products()->findOrFail($id);
        $product->delete();
        $this->historyService->productRemoval($user, $product);
        return true;
    }
}
