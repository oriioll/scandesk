<?php

namespace App\Services;

use App\Exceptions\ApiException;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Hash;
use PDOException;
use Throwable;

/**
 * Authenticate users and create accounts.
 * @author Oriol Plazas
 * @since 1.0.0
 */
class UserService
{
    //Logs in a user by checking credentials an generating a token
    /**
     * Authenticate a user and issue an access token.
     * @param array{email: string, password: string} $user Validated login credentials.
     * @return string|null Plain-text access token.
     * @throws ApiException when credentials are invalid or authentication fails.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function loginUser(array $user): string | null
    {
        try {
            $userExists = User::where('email', $user['email'])->first();
            //Compare with hashs the password sent and the real password
            if (!$userExists || !Hash::check($user['password'], $userExists->password)) {
                throw new ApiException(
                    message: 'Invalid credentials provided.',
                    errorCode: 'INVALID_CREDENTIALS',
                    status: 401
                );
            }
            //Update the last login parameter
            $userExists->last_login = now();
            $userExists->save();
            return $userExists->createToken('auth_token')->plainTextToken;
        } catch (ApiException $e) {
            throw $e;
        } catch (QueryException | PDOException $e) {
            throw new ApiException(
                message: 'A database error occurred during login.',
                errorCode: 'AUTH_LOGIN_DATABASE_ERROR',
                status: 500,
                previous: $e
            );
        } catch (Throwable $e) {
            throw new ApiException(
                message: 'An unexpected error occurred during login.',
                errorCode: 'AUTH_LOGIN_ERROR',
                status: 500,
                previous: $e
            );
        }
    }

    /**
     * Create a user account and issue an access token.
     * @param array{name: string, email: string, password: string} $user Validated registration details.
     * @return string|null Plain-text access token.
     * @throws ApiException when registration fails or the email is already in use.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function createUser(array $user): string | null
    {
        try {
            //Build user to introduce hashed password
            $user = User::create(
                [
                    'name' => $user['name'],
                    'email' => $user['email'],
                    'password' => Hash::make($user['password']),
                ]
            );
            //Update the last login parameter
            $user->last_login = now();
            $user->save();
            return $user->createToken('auth_token')->plainTextToken;
        } catch (QueryException | PDOException $e) {
            // Check if it's a unique constraint failure (e.g., email already registered)
            if ($e->getCode() === '23000' || str_contains($e->getMessage(), 'Duplicate entry')) {
                throw new ApiException(
                    message: 'A user with this email address already exists.',
                    errorCode: 'EMAIL_ALREADY_EXISTS',
                    status: 409,
                    previous: $e
                );
            }
            throw new ApiException(
                message: 'A database error occurred during registration.',
                errorCode: 'AUTH_REGISTER_DATABASE_ERROR',
                status: 500,
                previous: $e
            );
        } catch (Throwable $e) {
            throw new ApiException(
                message: 'An unexpected error occurred during registration.',
                errorCode: 'AUTH_REGISTER_ERROR',
                status: 500,
                previous: $e
            );
        }
    }
}
