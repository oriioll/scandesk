<?php

namespace App\Http\Controllers;

use App\Http\Requests\orders\LoginUserRequest;
use App\Http\Requests\orders\RegisterUserRequest;
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
            return response()->json(['error' => true, 'message' => "Couldn't login the user error credentials"], 402);
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
        ]);
    }
}
