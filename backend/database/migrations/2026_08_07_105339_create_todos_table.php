<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('todos', function (Blueprint $table) {
    $table->id(); //Every todo gets a unique ID.

    $table->string('title'); 
    $table->text('description')->nullable(); // allows longer content. nullable() means the user doesn't have to provide a description.

    $table->boolean('completed')->default(false);

    $table->foreignId('user_id')
          ->constrained() // call tells Laravel to create the relationship with the users table automatically.
          ->onDelete('cascade'); // if a user is deleted, all of their todos are deleted automatically as well

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('todos');
    }
};
