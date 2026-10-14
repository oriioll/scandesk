<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class DevAutoLogin
{
    public function handle(Request $request, Closure $next)
    {
        if (app()->environment('local') && config('app.dev_auto_login')) {
            $user = User::firstOrCreate(
                ['email' => 'dev@scandesk.test'],
                ['name' => 'Dev', 'password' => Hash::make('password')]
            );
            Auth::guard('sanctum')->setUser($user);
        }

        return $next($request);
    }
}
