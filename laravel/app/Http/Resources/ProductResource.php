<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
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
