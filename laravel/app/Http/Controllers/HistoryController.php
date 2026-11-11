<?php

namespace App\Http\Controllers;

use App\Http\Resources\HistoryResource;
use App\Services\HistoryService;
use Illuminate\Http\Request;

/**
 * Handle product-history endpoints.
 *
 * @author Oriol Plazas
 * @since 1.0.0
 */
class HistoryController extends Controller
{
    /**
     * Create the controller with its history service.
     *
     * @param HistoryService $historyService Product-history operations.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function __construct(private HistoryService $historyService) {}

    /**
     * Handles a GET request to get the products from a user
     *
     * @param Request $request Authenticated request.
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection Collection of product-history entries.
     * @throws \App\Exceptions\ApiException when history cannot be retrieved.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function index(Request $request)
    {
        return HistoryResource::collection(
            $this->historyService->getAll($request->user())
        );
    }
}
