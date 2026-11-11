<?php

namespace App\Services;

use App\Exceptions\ApiException;
use App\Models\Category;
use Illuminate\Database\QueryException;
use PDOException;
use Throwable;

/**
 * Retrieve the available product categories.
 *
 * @author Oriol Plazas
 * @since 1.0.0
 */
class CategoryService
{
    /**
     * Get all the categories
     *
     * @return \Illuminate\Database\Eloquent\Collection<int, Category> Available categories.
     * @throws ApiException when categories cannot be retrieved.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function getAll()
    {
        try {
            return Category::all();
        } catch (QueryException | PDOException $e) {
            throw new ApiException(
                message: 'A database error occurred while fetching categories.',
                errorCode: 'DATABASE_ERROR',
                status: 500,
                previous: $e
            );
        } catch (Throwable $e) {
            // Unexpected system/PHP exceptions
            throw new ApiException(
                message: 'An unexpected internal error occurred.',
                errorCode: 'INTERNAL_SERVER_ERROR',
                status: 500,
                previous: $e
            );
        }
    }
}
