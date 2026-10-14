<?php

namespace App\Services;

use App\Models\PairingSession;
use App\Models\Product;
use App\Models\User;

class PairingSessionService
{
    /**
     * Creates a session in the server for the logged user
     * @param User $user Logged User
     */
    public function createSession(User $user)
    {
        $token = bin2hex(random_bytes(32));
        return $user->pairingSessions()->create([
            'token_hash' => $token,
            'expires_at' => now()->addMinutes(10),
        ]);
    }
}
