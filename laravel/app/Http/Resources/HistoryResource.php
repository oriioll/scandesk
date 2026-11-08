<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HistoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
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
