<?php

namespace App\Http\Controllers;

use App\Http\Requests\orders\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use App\Services\OrderService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Request;

/**
 * Handle order listing and creation endpoints.
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
     * List the authenticated user's orders.
     *
     * @param Request $request Authenticated request.
     * @return AnonymousResourceCollection Collection of the user's orders.
     * @throws \App\Exceptions\ApiException when orders cannot be retrieved.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        return OrderResource::collection(
            $this->orderService->getAll($request->user())
        );
    }

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
