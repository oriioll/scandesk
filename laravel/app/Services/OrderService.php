<?php

namespace App\Services;

use App\Exceptions\ApiException;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\QueryException;
use PDOException;
use Throwable;

/**
 * Create orders for users.
 *
 * @author Oriol Plazas
 * @since 1.0.0
 */
class OrderService
{
    /**
     * Inserts an order into the db, for the logged user
     *
     * @param User $user Owner of the new order.
     * @param array $orders Validated order data and items.
     * @return Order Created order.
     * @throws ApiException when order creation fails.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function postOrder(User $user, array $orders): Order
    {
        try {
            return $user->orders()->create($orders);
        } catch (QueryException | PDOException $e) {
            throw new ApiException(
                message: 'Failed to create order due to a database error.',
                errorCode: 'ORDER_CREATE_DATABASE_ERROR',
                status: 500,
                previous: $e
            );
        } catch (Throwable $e) {
            throw new ApiException(
                message: 'An unexpected error occurred while processing the order.',
                errorCode: 'ORDER_CREATE_ERROR',
                status: 500,
                previous: $e
            );
        }
    }
}
