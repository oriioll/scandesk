<?php

namespace App\Http\Controllers;

use App\Http\Requests\products\StoreProductRequest;
use App\Http\Requests\products\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Services\ProductService;
use Exception;
use Illuminate\Http\Request;

/**
 * Handle product listing and management endpoints.
 *
 * @author Oriol Plazas
 * @since 1.0.0
 */
class ProductController extends Controller
{
    /**
     * Create the controller with its product service.
     *
     * @param ProductService $productService Product operations.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function __construct(private ProductService $productService) {}

    /**
     * Handles a GET request to get the products from a user
     *
     * @param Request $request Authenticated request.
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection Collection of the user's products.
     * @throws \App\Exceptions\ApiException when products cannot be retrieved.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function index(Request $request)
    {
        return ProductResource::collection(
            $this->productService->getAll($request->user())
        );
    }

    /**
     * Handles a GET request to get the product with a barcode from a user
     *
     * @param Request $request Authenticated request.
     * @param string $barcode Barcode to look up.
     * @return ProductResource Matching product.
     * @throws \App\Exceptions\ApiException when the product cannot be found or retrieved.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function showByBarcode(Request $request, string $barcode): ProductResource
    {
        return new ProductResource(
            $this->productService->getByBarcode($request->user(), $barcode)
        );
    }

    /**
     * Handles a GET request to get the product with an id
     *
     * @param Request $request Authenticated request.
     * @param string $id Product identifier.
     * @return ProductResource Matching product.
     * @throws \App\Exceptions\ApiException when the product cannot be found or retrieved.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function show(Request $request, string $id): ProductResource
    {
        return new ProductResource(
            $this->productService->getById($request->user(), $id)
        );
    }

    /**
     * Handles a POST request of a product
     *
     * @param StoreProductRequest $request Validated product details.
     * @return ProductResource Created product.
     * @throws \App\Exceptions\ApiException when product creation fails.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function store(StoreProductRequest $request): ProductResource
    {
        return ProductResource::make(
            $this->productService->postProduct($request->user(), $request->validated())
        );
    }

    /**
     * Handles a PUT request to update a product of a user
     *
     * @param UpdateProductRequest $request Validated product attributes.
     * @param string $id The id of the product to update
     * @return ProductResource Updated product.
     * @throws \App\Exceptions\ApiException when the product cannot be found or updated.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function update(UpdateProductRequest $request, string $id): ProductResource
    {
        return ProductResource::make(
            $this->productService->updateProduct($request->user(), $id, $request->validated())
        );
    }

    /**
     * Handles a DELETE request to delete a product of a user
     *
     * @param Request $request Authenticated request.
     * @param string $id The id of the product to delete
     * @return \Illuminate\Http\Response Empty response after deletion.
     * @throws \App\Exceptions\ApiException when the product cannot be found or deleted.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function destroy(Request $request, string $id)
    {
        $this->productService->deleteProduct($request->user(), $id);
        return response()->noContent();
    }
}
