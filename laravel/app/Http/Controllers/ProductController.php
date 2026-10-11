<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Resources\ProductResource;
use App\Services\ProductService;
use Exception;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(private ProductService $productService) {}

    /**
     * Handles a GET request to get the products from a user
     * @param Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        return ProductResource::collection(
            $this->productService->getAll($request->user())
        );
    }

    /**
     * Handles a POST request of a product
     * @param Request $request
     * @return ProductResource
     */
    public function store(StoreProductRequest $request): ProductResource
    {
        return ProductResource::make(
            $this->productService->postProduct($request->user(), $request->validated())
        );
    }
}
