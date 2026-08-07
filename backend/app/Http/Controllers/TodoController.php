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

public function index()
{
    // Fetch all todos for the authenticated user
        $todos = auth()->user()->todos;

    return response()->json([
        'todos' => $todos,
    ], 200);
}

public function show($id)
{
    $todo = Todo::where('user_id', auth()->id()) //Only search todos that belong to the currently logged in user.
                ->findOrFail($id);

    return response()->json([
        'todo' => $todo
    ], 200);
}

public function update(Request $request, $id)
{
    $todo = Todo::where('user_id', auth()->id())
                ->findOrFail($id);

    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'nullable|string',
        'completed' => 'required|boolean',
    ]);

    $todo->update($validated);

    return response()->json([
        'message' => 'Todo updated successfully',
        'todo' => $todo
    ], 200);
}

public function destroy($id)
{
    $todo = Todo::where('user_id', auth()->id()) // ensures only the owner can delete the todo.
                ->findOrFail($id);

    $todo->delete();

    return response()->json([
        'message' => 'Todo deleted successfully'
    ], 200);
}
}
