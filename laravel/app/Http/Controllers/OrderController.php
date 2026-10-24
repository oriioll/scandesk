<?php

namespace App\Http\Controllers;

use App\Http\Requests\orders\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use Illuminate\Http\Request;
use OrderService;

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
