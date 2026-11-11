<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Expose a product and its category when that relation is loaded.
 * @author Oriol Plazas
 * @since 1.0.0
 */
class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     * @param Request $request Request used to resolve the resource.
     * @return array<string, mixed> Array with product id, barcode, name, price, stock, and an optionally loaded category.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function toArray(Request $request): array
    {
        return [
            'id'       => (int) $this->id,
            'barcode'  => $this->barcode,
            'name'     => $this->name,
            'price'    => (float) $this->price,
            'stock'    => (int) $this->stock,
            'category' => $this->whenLoaded(
                'category',
                fn() => $this->category ? new CategoryResource($this->category) : null
            ),
        ];
    }
}
