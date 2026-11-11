<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Services\CategoryService;
use Illuminate\Http\Request;

/**
 * Handle category listing endpoints.
 *
 * @author Oriol Plazas
 * @since 1.0.0
 */
class CategoryController extends Controller
{
    /**
     * Create the controller with its category service.
     *
     * @param CategoryService $categoryService Category lookup operations.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function __construct(private CategoryService $categoryService) {}

    /**
     * Handles a GET request to get the categories
     *
     * @param Request $request Authenticated request.
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection Available categories.
     * @throws \App\Exceptions\ApiException when categories cannot be retrieved.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function index(Request $request)
    {
        return CategoryResource::collection(
            $this->categoryService->getAll()
        );
    }
}
