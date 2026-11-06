<?php

namespace App\Http\Controllers;

use App\Http\Resources\HistoryResource;
use App\Services\HistoryService;
use Illuminate\Http\Request;

class HistoryController extends Controller
{
    public function __construct(private HistoryService $historyService) {}

    /**
     * Handles a GET request to get the products from a user
     * @param Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        return HistoryResource::collection(
            $this->historyService->getAll($request->user())
        );
    }
}
