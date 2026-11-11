<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Expose order totals and loaded order items.
 * @author Oriol Plazas
 * @since 1.0.0
 */
class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     * @param Request $request Request used to resolve the resource.
     * @return array<string, mixed> Array with order id, total price, and items when loaded.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'total_price' => $this->total_price,
            'items'       => OrderItemResource::collection($this->whenLoaded('items')),
        ];
    }
}
