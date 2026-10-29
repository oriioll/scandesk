<?php

namespace App\Http\Controllers;

use App\Http\Requests\orders\LoginUserRequest;
use App\Http\Requests\orders\RegisterUserRequest;
use App\Http\Resources\UserResource;
use App\Services\UserService;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct(private UserService $userService) {}

    /**
     * Handles a POST request to log in a user
     * @param Request $request
     */
    public function login(LoginUserRequest $request)
    {
        $userToken = $this->userService->loginUser($request->validated());
        if (!$userToken) {
            return response()->json(['error' => true, 'message' => "Couldn't login the user error credentials"], 401);
        }
        return response()->json([
            'message' => 'User logged in successfully',
            'access_token' => $userToken,
            'token_type' => 'Bearer',
        ]);
    }
    /**
     * Handles a POST request to create a user
     * @param Request $request
     */
    public function register(RegisterUserRequest $request)
    {
        $userToken = $this->userService->createUser($request->validated());
        return response()->json([
            'message' => 'User created successfully successfully',
            'access_token' => $userToken,
            'token_type' => 'Bearer',
        ], 201);
    }

    /**
     * Deletes the current access token from the user to log out
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->noContent();
    }

    /**
     * Handles GET Request to get the current user
     */
    public function me(Request $request)
    {
        return new UserResource($request->user());
    }
}
