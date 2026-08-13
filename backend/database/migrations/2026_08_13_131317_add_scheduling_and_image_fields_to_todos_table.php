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
        Schema::table('todos', function (Blueprint $table) {
            $table->timestamp('start_time')->nullable()->after('description');
            $table->timestamp('end_time')->nullable()->after('start_time');
            $table->unsignedInteger('duration')->nullable()->after('end_time'); // duration in minutes, calculated on the backend
            $table->string('image_path')->nullable()->after('duration');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('todos', function (Blueprint $table) {
            $table->dropColumn(['start_time', 'end_time', 'duration', 'image_path']);
        });
    }
};
