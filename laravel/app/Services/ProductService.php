<?php

namespace App\Services;

use ApiException;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use PDOException;
use Ramsey\Collection\Collection;
use Throwable;

class ProductService
{
    public function __construct(private HistoryService $historyService) {}
    /**
     * Get all products created by the user
     * @param User $user
     */
    public function getAll(User $user): Collection
    {
        try {
            return $user->products()->with('category')->get();
        } catch (QueryException | PDOException $e) {
            throw new ApiException(
                message: 'A database error occurred while fetching products.',
                errorCode: 'PRODUCT_FETCH_DATABASE_ERROR',
                status: 500,
                previous: $e
            );
        } catch (Throwable $e) {
            throw new ApiException(
                message: 'An unexpected error occurred while fetching products.',
                errorCode: 'PRODUCT_FETCH_ERROR',
                status: 500,
                previous: $e
            );
        }
    }

    /**
     * Get the product with a barcode if created by the user
     * @param User $user
     * @param string $barcode The barcode to search the product
     * @return Product
     */
    public function getByBarcode(User $user, string $barcode): Product
    {
        try {
            return $user->products()->with('category')->where('barcode', $barcode)->firstOrFail();
        } catch (ModelNotFoundException $e) {
            throw new ApiException(
                message: 'Product not found with the provided barcode.',
                errorCode: 'PRODUCT_NOT_FOUND',
                status: 404,
                previous: $e
            );
        } catch (QueryException | PDOException $e) {
            throw new ApiException(
                message: 'A database error occurred while searching for the product.',
                errorCode: 'PRODUCT_SEARCH_DATABASE_ERROR',
                status: 500,
                previous: $e
            );
        } catch (Throwable $e) {
            throw new ApiException(
                message: 'An unexpected error occurred while searching for the product.',
                errorCode: 'PRODUCT_SEARCH_ERROR',
                status: 500,
                previous: $e
            );
        }
    }

    /**
     * Get the product with a id if created by the user
     * @param User $user
     * @param string $id The id to search the product
     * @return Product
     */
    public function getById(User $user, string $id): Product
    {
        try {
            return $user->products()->with('category')->where('id', $id)->firstOrFail();
        } catch (ModelNotFoundException $e) {
            throw new ApiException(
                message: 'Product not found with the provided ID.',
                errorCode: 'PRODUCT_NOT_FOUND',
                status: 404,
                previous: $e
            );
        } catch (QueryException | PDOException $e) {
            throw new ApiException(
                message: 'A database error occurred while fetching the product.',
                errorCode: 'PRODUCT_FETCH_DATABASE_ERROR',
                status: 500,
                previous: $e
            );
        } catch (Throwable $e) {
            throw new ApiException(
                message: 'An unexpected error occurred while fetching the product.',
                errorCode: 'PRODUCT_FETCH_ERROR',
                status: 500,
                previous: $e
            );
        }
    }

    /**
     * Inserts a user into the db, for the logged user
     * @param User $user
     * @param array $products Array of products gotten from request
     * @return Product Inserted
     */
    public function postProduct(User $user, array $products): Product
    {
        try {
            $created = $user->products()->create($products)->load('category');
            $this->historyService->productCreation($user, $created);
            return $created;
        } catch (QueryException | PDOException $e) {
            throw new ApiException(
                message: 'Failed to create product due to a database error.',
                errorCode: 'PRODUCT_CREATE_DATABASE_ERROR',
                status: 500,
                previous: $e
            );
        } catch (Throwable $e) {
            throw new ApiException(
                message: 'An unexpected error occurred while creating the product.',
                errorCode: 'PRODUCT_CREATE_ERROR',
                status: 500,
                previous: $e
            );
        }
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
        try {
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
        } catch (ModelNotFoundException $e) {
            throw new ApiException(
                message: 'Product not found or not owned by user.',
                errorCode: 'PRODUCT_NOT_FOUND',
                status: 404,
                previous: $e
            );
        } catch (QueryException | PDOException $e) {
            throw new ApiException(
                message: 'Failed to update product due to a database error.',
                errorCode: 'PRODUCT_UPDATE_DATABASE_ERROR',
                status: 500,
                previous: $e
            );
        } catch (Throwable $e) {
            throw new ApiException(
                message: 'An unexpected error occurred while updating the product.',
                errorCode: 'PRODUCT_UPDATE_ERROR',
                status: 500,
                previous: $e
            );
        }
    }
    /**
     * Deletes a product if created by the user
     * @param User $user
     * @param string $id The id of the product to update
     * @return bool
     */
    public function deleteProduct(User $user, string $id): bool
    {
        try {
            $product = $user->products()->findOrFail($id);
            $this->historyService->productRemoval($user, $product);
            $product->delete();
            return true;
        } catch (ModelNotFoundException $e) {
            throw new ApiException(
                message: 'Product not found or not owned by user.',
                errorCode: 'PRODUCT_NOT_FOUND',
                status: 404,
                previous: $e
            );
        } catch (QueryException | PDOException $e) {
            throw new ApiException(
                message: 'Failed to delete product due to a database constraint or error.',
                errorCode: 'PRODUCT_DELETE_DATABASE_ERROR',
                status: 500,
                previous: $e
            );
        } catch (Throwable $e) {
            throw new ApiException(
                message: 'An unexpected error occurred while deleting the product.',
                errorCode: 'PRODUCT_DELETE_ERROR',
                status: 500,
                previous: $e
            );
        }
    }
}
