<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Todo extends Model
{
    // $fillable defines which model attributes can be assigned through mass assignment methods such as create() and update().
    // This is a security feature to prevent mass assignment vulnerabilities.
    protected $fillable = [
        'title',
        'description',
        'completed',
        'user_id',
    ];

    /**
     * A todo belongs to one user.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
