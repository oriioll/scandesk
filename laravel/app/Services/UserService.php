<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserService
{
    //Logs in a user by checking credentials an generating a token
    public function loginUser(array $user): string | null
    {
        $userExists = User::where('email', $user['email'])->first();
        //Compare with hashs the password sent and the real password
        if (!$userExists || !Hash::check($user['password'], $userExists->password)) {
            return null;
        }
        //Update the last login parameter
        $userExists->last_login = now();
        $userExists->save();

        return $userExists->createToken('auth_token')->plainTextToken;
    }

    //Registers in a user an generating a token
    public function createUser(array $user): string | null
    {
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
    }
}
