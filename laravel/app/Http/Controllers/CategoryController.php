<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Services\CategoryService;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function __construct(private CategoryService $categoryService) {}

    /**
     * Handles a GET request to get the categories
     * @param Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        return CategoryResource::collection(
            $this->categoryService->getAll()
        );
    }
}
