<?php

namespace App\Services;

use App\Models\Product;
use App\Models\StockHistory;
use App\Models\User;

class HistoryService
{
    /**
     * Get all the history changes by the user
     * @param User $user
     */
    public function getAll(User $user)
    {
        return $user->stockHistories()->get();
    }

    /**
     * Handles the history of a product creation
     * @param User $user
     * @param Product $product
     * @return StockHistory
     */
    public function productCreation(User $user, Product $product): StockHistory
    {
        return StockHistory::create([
            'product_id' => $product->id,
            'user_id' => $user->id,
            'field' => 'all',
            'operation' => 'CREATE',
            'old_value' => null,
            'new_value' => $product->name === null ? null : (string) $product->name,
        ]);
    }
    /**
     * Handles the history of a product delete
     * @param User $user
     * @param Product $product
     * @return StockHistory
     */
    public function productRemoval(User $user, Product $product): StockHistory
    {
        return StockHistory::create([
            'product_id' => $product->id,
            'user_id' => $user->id,
            'field' => 'all',
            'operation' => 'DELETE',
            'old_value' => $product->name === null ? null : (string) $product->name,
            'new_value' => null,
        ]);
    }
    /**
     * Handles the history of a product edition
     * @param User $user
     * @param Product $old_product
     * @param Product $new_product
     * @return StockHistory
     */
    public function productEdition(User $user, Product $old_product, Product $new_product, string $editedField): StockHistory
    {
        $oldValue = $old_product->{$editedField};
        $newValue = $new_product->{$editedField};

        return StockHistory::create([
            'product_id' => $new_product->id,
            'user_id' => $user->id,
            'field' => $editedField,
            'operation' => 'EDIT',
            'old_value' => $oldValue === null ? null : (string) $oldValue,
            'new_value' => $newValue === null ? null : (string) $newValue,
        ]);
    }
}
