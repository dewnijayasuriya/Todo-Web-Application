<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([ 
            'name' => 'required|string|max:255', 
            'email' => 'required|email|unique:users,email', 
            'password' => 'required|min:6|confirmed', // password has at least 6 characters and password_confirmation matches password
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken; //creating authentication token for the user using Laravel Sanctum.

        return response()->json([
            'message' => 'User registered successfully',
            'token' => $token,
            'user' => $user,
        ], 201);
    }

    public function login(Request $request)
    {
    $validated = $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    if (!Auth::attempt($validated)) {
        return response()->json([
            'message' => 'Invalid credentials'
        ], 401);
    }

    $user = Auth::user();

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'message' => 'Login successful',
        'token' => $token,
        'user' => $user,
    ], 200);
}

public function logout(Request $request)
{
    $request->user()->currentAccessToken()->delete(); // gives current authenticated user and gets the current access token and deletes it.

    return response()->json([
        'message' => 'Logged out successfully'
    ]);
}
}
