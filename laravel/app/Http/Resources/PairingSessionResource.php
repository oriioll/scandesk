<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Expose the pairing token and its claim timestamp.
 * @author Oriol Plazas
 * @since 1.0.0
 */
class PairingSessionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     * @param Request $request Request used to resolve the resource.
     * @return array<string, mixed> Array with the token hash and claimed timestamp.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function toArray(Request $request): array
    {
        return [
            'token_hash'   => $this->token_hash,
            'claimed_at' => $this->claimed_at,
        ];
    }
}
