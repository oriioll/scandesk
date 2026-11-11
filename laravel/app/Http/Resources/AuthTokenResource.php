<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Expose the authentication result and issued access token.
 * @author Oriol Plazas
 * @since 1.0.0
 */
class AuthTokenResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     * @param Request $request Request used to resolve the resource.
     * @return array<string, string> Array with the message, access token, and token type.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function toArray(Request $request): array
    {
        return [
            'message' => $this->resource['message'],
            'access_token' => $this->resource['access_token'],
            'token_type' => $this->resource['token_type'],
        ];
    }
}
