<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('students', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->string('roll_number')->unique();
        $table->string('phone_number');
        $table->string('student_class');
        $table->date('date_of_birth');
        $table->date('admission_date');
        $table->enum('status', ['active', 'inactive']);
        $table->foreignId('assigned_teacher_id')->constrained('teachers')->onDelete('cascade');
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
