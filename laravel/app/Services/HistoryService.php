<?php

namespace App\Services;

use ApiException;
use App\HistoryAction;
use App\Models\Product;
use App\Models\StockHistory;
use App\Models\User;
use Illuminate\Database\QueryException;
use PDOException;
use Throwable;

class HistoryService
{
    /**
     * Get all the history changes by the user
     * @param User $user
     */
    public function getAll(User $user)
    {
        try {
            return $user->stockHistories()
                ->with('product:id,name')
                ->latest()
                ->get();
        } catch (QueryException | PDOException $e) {
            throw new ApiException(
                message: 'A database error occurred while fetching stock history.',
                errorCode: 'DATABASE_ERROR',
                status: 500,
                previous: $e
            );
        } catch (Throwable $e) {
            throw new ApiException(
                message: 'An unexpected error occurred while processing stock history.',
                errorCode: 'INTERNAL_SERVER_ERROR',
                status: 500,
                previous: $e
            );
        }
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
            'operation' => HistoryAction::Create,
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
            'operation' => HistoryAction::Delete,
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
            'operation' => HistoryAction::Edit,
            'old_value' => $oldValue === null ? null : (string) $oldValue,
            'new_value' => $newValue === null ? null : (string) $newValue,
        ]);
    }
}
