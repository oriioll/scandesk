<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AuthTokenResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, string>
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
