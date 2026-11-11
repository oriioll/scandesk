<?php

namespace App\Http\Controllers;

use App\Http\Requests\orders\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use App\Services\OrderService;
use Illuminate\Http\Request;

/**
 * Handle order creation endpoints.
 *
 * @author Oriol Plazas
 * @since 1.0.0
 */
class OrderController extends Controller
{
    /**
     * Create the controller with its order service.
     *
     * @param OrderService $orderService Order creation operations.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function __construct(private OrderService $orderService) {}
    /**
     * Handles a POST request of an Order
     *
     * @param StoreOrderRequest $request Validated order details.
     * @return OrderResource Created order.
     * @throws \App\Exceptions\ApiException when order creation fails.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function store(StoreOrderRequest $request): OrderResource
    {
        return OrderResource::make(
            $this->orderService->postOrder($request->user(), $request->validated())
        );
    }
}
