<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Expose the product and quantity details recorded for an order item.
 * @author Oriol Plazas
 * @since 1.0.0
 */
class OrderItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     * @param Request $request Request used to resolve the resource.
     * @return array<string, mixed> Array with item id, product id, quantity, unit price, and product name.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'product_id'   => $this->product_id,
            'quantity'     => $this->quantity,
            'unit_price'   => $this->unit_price,
            'product_name' => $this->product_name,
        ];
    }
}
