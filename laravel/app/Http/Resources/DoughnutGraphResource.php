<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Expose the category and the number of products of it.
 * @author Oriol Plazas
 * @since 1.0.0
 */
class DoughnutGraphResource extends JsonResource
{
    /**
     * Transform the doughnut stats of categories into the response array.
     * @param Request $request Request used to resolve the resource.
     * @return array<string, mixed> Array with categoryId, categoryName and total_products.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function toArray(Request $request): array
    {
        return [
            'categoryId' => $this->resource['categoryId'],
            'categoryName' => $this->resource['categoryName'],
            'total_products' => $this->resource['total_products'],
        ];
    }
}
