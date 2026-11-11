<?php

namespace App\Services;

use App\Exceptions\ApiException;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use PDOException;
use Throwable;

/**
 * Manage products belonging to users.
 * @author Oriol Plazas
 * @since 1.0.0
 */
class ProductService
{
    /**
     * Create the service with its history recorder.
     * @param HistoryService $historyService Product change-history operations.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function __construct(private HistoryService $historyService) {}
    /**
     * Get all products created by the user
     * @param User $user Owner whose products are requested.
     * @return \Illuminate\Database\Eloquent\Collection<int, Product> Products with their categories loaded.
     * @throws ApiException when products cannot be retrieved.
     * @author Oriol Plazas
     * @since 1.0.0
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
     * @param User $user Owner whose product is requested.
     * @param string $barcode Barcode to search for.
     * @return Product Matching product with its category loaded.
     * @throws ApiException when the product is missing or cannot be retrieved.
     * @author Oriol Plazas
     * @since 1.0.0
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
     * @param User $user Owner whose product is requested.
     * @param string $id Product identifier.
     * @return Product Matching product with its category loaded.
     * @throws ApiException when the product is missing or cannot be retrieved.
     * @author Oriol Plazas
     * @since 1.0.0
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
     * @param User $user Owner of the new product.
     * @param array $products Validated product attributes.
     * @return Product Created product with its category loaded.
     * @throws ApiException when product creation or history recording fails.
     * @author Oriol Plazas
     * @since 1.0.0
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
     * @param User $user Owner of the product.
     * @param string $id Product identifier.
     * @param array $data Validated attributes to apply.
     * @return Product Updated product with its category loaded.
     * @throws ApiException when the product is missing or the update fails.
     * @author Oriol Plazas
     * @since 1.0.0
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
     * @param User $user Owner of the product.
     * @param string $id Product identifier.
     * @return bool Whether the product was deleted.
     * @throws ApiException when the product is missing or deletion fails.
     * @author Oriol Plazas
     * @since 1.0.0
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
