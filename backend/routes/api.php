<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TodoController;

// Public Routes
Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () { //check whether this req is authenticated using Laravel Sanctum

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/todos', [TodoController::class, 'store']);
    Route::get('/todos', [TodoController::class, 'index']);
    Route::get('/todos/{id}', [TodoController::class, 'show']);
    Route::put('/todos/{id}', [TodoController::class, 'update']);
    // Multipart updates (e.g. replacing an image) must arrive as POST with
    // a Laravel `_method=PUT` spoof field, since PHP only parses multipart
    // bodies for POST requests.
    Route::post('/todos/{id}', [TodoController::class, 'update']);
    Route::delete('/todos/{id}', [TodoController::class, 'destroy']);
    Route::patch('/todos/{todo}', [TodoController::class, 'toggleComplete']); //changes the completion status (pending/completed) of a todo item.

});

// Protected Route (default)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) { //get current authenticated user.
    return $request->user();
});
