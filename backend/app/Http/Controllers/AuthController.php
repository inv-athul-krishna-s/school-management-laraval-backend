<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    // User Registration
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'role'     => 'required|in:admin,teacher,student'
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => $request->role
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'user'  => $user,
            'token' => $token
        ], 201);
    }

    // User Login
    public function login(Request $request)
{
    $credentials = $request->only('email', 'password');

    if (!$token = auth('api')->attempt($credentials)) {
        return response()->json(['error' => 'Invalid credentials'], 401);
    }

    return response()->json([
        'user'  => auth('api')->user(),
        'role'  => auth('api')->user()->role,
        'token' => $token

    ]);
}

    // User Logout
    public function logout()
    {
        Auth::logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    // Get Current User
    public function me()
    {
        return response()->json(Auth::user());
    }
}
