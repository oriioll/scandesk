<?php

namespace App\Services;

use App\Exceptions\ApiException;
use App\Models\PairingSession;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\QueryException;
use PDOException;
use Throwable;

class PairingSessionService
{
    /**
     * Creates a session in the server for the logged user
     * @param User $user Logged User
     */
    public function createSession(User $user): PairingSession
    {
        try {
            $token = bin2hex(random_bytes(32));

            return $user->pairingSessions()->create([
                'token_hash' => $token,
                'expires_at' => now()->addMinutes(10),
            ]);
        } catch (QueryException | PDOException $e) {
            throw new ApiException(
                message: 'A database error occurred while creating the pairing session.',
                errorCode: 'PAIRING_SESSION_CREATE_DATABASE_ERROR',
                status: 500,
                previous: $e
            );
        } catch (Throwable $e) {
            throw new ApiException(
                message: 'An unexpected error occurred while generating the pairing session.',
                errorCode: 'PAIRING_SESSION_CREATE_ERROR',
                status: 500,
                previous: $e
            );
        }
    }
    /**
     * Verifies if a pairing session exists
     * @param string $token token of the session to verify
     * @return PairingSession if exists or null
     */
    public function verifySession(string $token): ?PairingSession
    {
        try {
            $session = PairingSession::where('token_hash', $token)->first();
            if ($session) {
                $session->update(['is_active' => true]);
            }
            return $session;
        } catch (QueryException | PDOException $e) {
            throw new ApiException(
                message: 'A database error occurred while verifying the pairing session.',
                errorCode: 'PAIRING_SESSION_VERIFY_DATABASE_ERROR',
                status: 500,
                previous: $e
            );
        } catch (Throwable $e) {
            throw new ApiException(
                message: 'An unexpected error occurred while verifying the session.',
                errorCode: 'PAIRING_SESSION_VERIFY_ERROR',
                status: 500,
                previous: $e
            );
        }
    }
}
