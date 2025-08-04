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
         Schema::table('teachers', function (Blueprint $table) {
        // Just add phone_number without specifying 'after email'
        $table->string('phone_number')->nullable();
    });

    Schema::table('students', function (Blueprint $table) {
        $table->string('phone_number')->nullable();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('teachers', function (Blueprint $table) {
            $table->dropColumn('phone_number');
        });

        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn('phone_number');
        });
    }
};
