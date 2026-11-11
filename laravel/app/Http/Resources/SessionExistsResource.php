<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Expose whether a pairing session was found and its status message.
 * @author Oriol Plazas
 * @since 1.0.0
 */
class SessionExistsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     * @param Request $request Request used to resolve the resource.
     * @return array<string, mixed> Array with an exists flag and message.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function toArray(Request $request): array
    {
        return [
            'exists'  => $this->resource['exists'],
            'message' => $this->resource['message'],
        ];
    }
}
