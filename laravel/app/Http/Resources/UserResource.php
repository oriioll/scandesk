<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Expose a user's public profile fields.
 * @author Oriol Plazas
 * @since 1.0.0
 */
class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     * @param Request $request Request used to resolve the resource.
     * @return array<string, mixed> Array with the user's name and email.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function toArray(Request $request): array
    {
        return [
            'name'       => $this->name,
            'email'  => $this->email,
        ];
    }
}
