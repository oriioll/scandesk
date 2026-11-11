<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Expose a stock-history change and its loaded product summary.
 * @author Oriol Plazas
 * @since 1.0.0
 */
class HistoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     * @param Request $request Request used to resolve the resource.
     * @return array<string, mixed> Array with id, optionally loaded product {id, name}, user_id, field, old_value, new_value, operation, and created_at.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (int) $this->id,
            'product'    => $this->whenLoaded('product', fn() => [
                'id'      => $this->product->id,
                'name'    => $this->product->name,
            ]),
            'user_id' => $this->user_id,
            'field' => $this->field,
            'old_value' => $this->old_value,
            'new_value' => $this->new_value,
            'operation' => $this->operation,
            'created_at' => $this->created_at,
        ];
    }
}
