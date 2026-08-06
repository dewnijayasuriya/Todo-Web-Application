<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// Public Routes
Route::post('/register', [AuthController::class, 'register']);

// Protected Route (default)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
