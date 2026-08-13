<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Todo;

class TodoController extends Controller
{
    private const IMAGE_RULES = ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120']; // max 5MB

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255', // Ensures title is required, must be a string and should not exceed 255 characters
            'description' => 'nullable|string', // Description is optional but must be text if provided.
            'start_time' => 'nullable|date|after_or_equal:now', // new todos can't be scheduled in the past
            'end_time' => 'nullable|date|after_or_equal:start_time',
            'image' => self::IMAGE_RULES,
        ]);

        $imagePath = $request->hasFile('image')
            ? $request->file('image')->store('todos', 'public')
            : null;

        $todo = Todo::create([ // inserts a new row into PostgreSQL. Eloquent method that creates a new Todo model
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null, // If description exists use it
            'completed' => false, // Every new Todo starts as incomplete.
            'user_id' => auth()->id(), // gets the ID of the currently authenticated user from the Sanctum token.
            'start_time' => $validated['start_time'] ?? null,
            'end_time' => $validated['end_time'] ?? null,
            'duration' => $this->calculateDuration($validated['start_time'] ?? null, $validated['end_time'] ?? null),
            'image_path' => $imagePath,
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
            'start_time' => 'nullable|date',
            'end_time' => 'nullable|date|after_or_equal:start_time',
            'image' => self::IMAGE_RULES,
            'remove_image' => 'nullable|boolean',
        ]);

        $oldImagePath = $todo->image_path;
        $newImagePath = $oldImagePath;

        if ($request->hasFile('image')) {
            $newImagePath = $request->file('image')->store('todos', 'public');
        } elseif ($request->boolean('remove_image')) {
            $newImagePath = null;
        }

        $todo->update([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'completed' => $validated['completed'],
            'start_time' => $validated['start_time'] ?? null,
            'end_time' => $validated['end_time'] ?? null,
            'duration' => $this->calculateDuration($validated['start_time'] ?? null, $validated['end_time'] ?? null),
            'image_path' => $newImagePath,
        ]);

        // Only remove the old file once the new state is saved successfully.
        if ($oldImagePath && $oldImagePath !== $newImagePath) {
            Storage::disk('public')->delete($oldImagePath);
        }

        return response()->json([
            'message' => 'Todo updated successfully',
            'todo' => $todo
        ], 200);
    }

    public function destroy($id)
    {
        $todo = Todo::where('user_id', auth()->id()) // ensures only the owner can delete the todo.
                    ->findOrFail($id);

        if ($todo->image_path) {
            Storage::disk('public')->delete($todo->image_path);
        }

        $todo->delete();

        return response()->json([
            'message' => 'Todo deleted successfully'
        ], 200);
    }

    public function toggleComplete(Todo $todo)
    {
        // Ensure the todo belongs to the logged-in user
        if ($todo->user_id !== auth()->id()) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403); // You are authenticated, but you don't have permission to perform this action (403 Forbidden)
        }

        // Toggle the completion status of the todo item. If it was completed, mark it as pending, and vice versa.
        $todo->completed = !$todo->completed;
        $todo->save(); // Save the updated status to the database.

        return response()->json([
            'message' => 'Todo updated successfully',
            'todo' => $todo
        ]);
    }

    /**
     * Calculate duration in whole minutes from start/end timestamps.
     * Always derived on the backend rather than trusting client input.
     */
    private function calculateDuration(?string $startTime, ?string $endTime): ?int
    {
        if (! $startTime || ! $endTime) {
            return null;
        }

        return (int) round(
            (strtotime($endTime) - strtotime($startTime)) / 60
        );
    }
}
