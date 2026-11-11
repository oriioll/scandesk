<?php

namespace App\Http\Controllers;

use App\Http\Requests\auth\LoginUserRequest;
use App\Http\Requests\auth\RegisterUserRequest;
use App\Http\Resources\AuthTokenResource;
use App\Http\Resources\UserResource;
use App\Services\UserService;
use Illuminate\Http\Request;

/**
 * Handle user authentication and account endpoints.
 *
 * @author Oriol Plazas
 * @since 1.0.0
 */
class UserController extends Controller
{
    /**
     * Create the controller with its user service.
     *
     * @param UserService $userService User account and authentication operations.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function __construct(private UserService $userService) {}

    /**
     * Handles a POST request to log in a user
     *
     * @param LoginUserRequest $request Validated login credentials.
     * @return AuthTokenResource Authentication token response.
     * @throws \App\Exceptions\ApiException when authentication fails.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function login(LoginUserRequest $request)
    {
        $userToken = $this->userService->loginUser($request->validated());
        return AuthTokenResource::make([
            'message' => 'User logged in successfully',
            'access_token' => $userToken,
            'token_type' => 'Bearer',
        ]);
    }
    /**
     * Handles a POST request to create a user
     *
     * @param RegisterUserRequest $request Validated account details.
     * @return \Illuminate\Http\JsonResponse Created account token response.
     * @throws \App\Exceptions\ApiException when account creation fails.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function register(RegisterUserRequest $request)
    {
        $userToken = $this->userService->createUser($request->validated());
        return AuthTokenResource::make([
            'message' => 'User created successfully successfully',
            'access_token' => $userToken,
            'token_type' => 'Bearer',
        ])->response()->setStatusCode(201);
    }

    /**
     * Deletes the current access token from the user to log out
     *
     * @param Request $request Authenticated request whose token is revoked.
     * @return \Illuminate\Http\Response Empty response after logout.
     * @throws \Illuminate\Database\QueryException when token deletion fails.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->noContent();
    }

    /**
     * Handles GET Request to get the current user
     *
     * @param Request $request Authenticated request.
     * @return UserResource Current user's public profile.
     * @author Oriol Plazas
     * @since 1.0.0
     */
    public function me(Request $request)
    {
        return new UserResource($request->user());
    }
}
