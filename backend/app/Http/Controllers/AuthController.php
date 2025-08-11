<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    // User Registration (teacher or student only)
    public function register(Request $request)
    {
        
       

        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'role'     => 'required|in:teacher,student,admin'  // admin role not allowed here
        ]);

        if ($request->role === 'admin') {
            $adminExists = User::where('role', 'admin')->exists();
            if ($adminExists) {
                return response()->json(['error' => 'Admin account already exists'], 403);
            }
        } 
        else if (!in_array($request->role, ['teacher', 'student'])) {
            return response()->json(['error' => 'Invalid role specified'], 400);
        }

        $user = User::create([
            'name'     => $request->first_name . ' ' . $request->last_name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => $request->role
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'user'  => $user,
            'access_token' => $token
        ], 201);
    }

    // User Login
    
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }
         // Generate "refresh" token 
        $refreshToken = JWTAuth::fromUser(auth()->user());

        return response()->json([
            'user'  => auth()->user(),
            'role'  => auth()->user()->role,
            'refresh_token' => $refreshToken,
            'access_token' => $token
        ]);
    }

// Refresh JWT Token
    // This method is used to refresh the JWT token when it expires
    // It will return a new access token if the refresh token is valid
    // If the refresh token is invalid or expired, it will return an error
    public function refreshWithToken(Request $request)
    {
        try {
            $refreshToken = $request->bearerToken();

            JWTAuth::setToken($refreshToken);
            $newAccessToken = JWTAuth::refresh();

            return response()->json([
                'access_token' => $newAccessToken,
            ]);

        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['error' => 'Token has expired and can’t be refreshed'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json(['error' => 'Invalid refresh token'], 401);
        }
    }
    // User Logout (correct for JWT)
    public function logout()
    {
        auth()->logout();  
        return response()->json(['message' => 'Successfully logged out']);
    }

    // Get Current User
    public function me()
    {
        return response()->json(auth()->user());  
    }
}
