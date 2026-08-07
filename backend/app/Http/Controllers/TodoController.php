<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Todo;

class TodoController extends Controller
{
    public function store(Request $request)
{
    $validated = $request->validate([
        'title' => 'required|string|max:255', // Ensures title is required, must be a string and should not exceed 255 characters
        'description' => 'nullable|string', // Description is optional but must be text if provided.
    ]);

    $todo = Todo::create([ // inserts a new row into PostgreSQL.
        'title' => $validated['title'],
        'description' => $validated['description'] ?? null, // If description exists use it
        'completed' => false, // Every new Todo starts as incomplete.
        'user_id' => auth()->id(), // gets the ID of the currently authenticated user from the Sanctum token.
    ]);

    return response()->json([
        'message' => 'Todo created successfully',
        'todo' => $todo,
    ], 201);
}
}
