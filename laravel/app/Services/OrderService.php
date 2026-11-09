<?php

namespace App\Services;

use App\Exceptions\ApiException;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\QueryException;
use PDOException;
use Throwable;

class OrderService
{
    /**
     * Inserts an order into the db, for the logged user
     * @param User $user
     * @param array $orders Array of orders gotten from request
     * @return Order Inserted
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
