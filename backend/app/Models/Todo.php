<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Todo extends Model
{
    // $fillable defines which model attributes can be assigned through mass assignment methods such as create() and update().
    // This is a security feature to prevent mass assignment vulnerabilities.
    protected $fillable = [
        'title',
        'description',
        'completed',
        'user_id',
        'start_time',
        'end_time',
        'duration',
        'image_path',
    ];

    protected $appends = [
        'image_url',
    ];

    protected function casts(): array
    {
        return [
            'completed' => 'boolean',
            'start_time' => 'datetime',
            'end_time' => 'datetime',
            'duration' => 'integer',
        ];
    }

    /**
     * A todo belongs to one user.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Full public URL for the stored image, if one exists.
     */
    public function getImageUrlAttribute(): ?string
    {
        if (! $this->image_path) {
            return null;
        }

        return Storage::disk('public')->url($this->image_path);
    }
}
