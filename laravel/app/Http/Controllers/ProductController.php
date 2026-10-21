<?php

namespace App\Http\Controllers;

use App\Http\Requests\products\StoreProductRequest;
use App\Http\Requests\products\UpdateProductRequest;
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
     * Handles a GET request to get the product with a barcode from a user
     * @param Request $request
     * @return ProductResource
     */
    public function showByBarcode(Request $request, string $barcode): ProductResource
    {
        return new ProductResource(
            $this->productService->getByBarcode($request->user(), $barcode)
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

    /**
     * Handles a PUT request to update a product of a user
     * @param UpdateProductRequest $request
     * @param string $id The id of the product to update
     * @return ProductResource
     */
    public function update(UpdateProductRequest $request, string $id): ProductResource
    {
        return ProductResource::make(
            $this->productService->updateProduct($request->user(), $id, $request->validated())
        );
    }
}
