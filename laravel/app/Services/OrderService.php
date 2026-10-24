<?php

use App\Models\Order;
use App\Models\User;

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
        return $user->orders()->create($orders);
    }
}
