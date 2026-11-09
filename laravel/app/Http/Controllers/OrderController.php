<?php

namespace App\Http\Controllers;

use App\Http\Requests\orders\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use App\Services\OrderService;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function __construct(private OrderService $orderService) {}
    /**
     * Handles a POST request of an Order
     * @param Request $request
     * @return OrderResource
     */
    public function store(StoreOrderRequest $request): OrderResource
    {
        return OrderResource::make(
            $this->orderService->postOrder($request->user(), $request->validated())
        );
    }
}
