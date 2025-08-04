<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\TeacherController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Authenticated routes
Route::middleware('auth:api')->group(function () {

    // Common Auth Routes
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Role-based Dashboard Routes
    Route::get('/admin/dashboard', fn () => response()->json(['message' => 'Welcome, Admin']))
        ->middleware('role:admin');

    Route::get('/teacher/dashboard', fn () => response()->json(['message' => 'Welcome, Teacher']))
        ->middleware('role:teacher');

    Route::get('/student/dashboard', fn () => response()->json(['message' => 'Welcome, Student']))
        ->middleware('role:student');

    // ========================
    // Admin Routes
    // ========================
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('teachers', TeacherController::class);
        Route::apiResource('students', StudentController::class);

        // Admin: List students assigned to a specific teacher
        Route::get('/teachers/{id}/students', [TeacherController::class, 'students'])
            ->name('teachers.students');
    });

    // ========================
    // Teacher Routes
    // ========================
    Route::middleware('role:teacher')->group(function () {
        Route::get('my-students', [StudentController::class, 'myStudents']);
        Route::get('my-students/{id}', [StudentController::class, 'showAssigned']);
        Route::put('my-students/{id}', [StudentController::class, 'updateAssigned']);
        Route::patch('my-students/{id}', [StudentController::class, 'updateAssigned']); // Add PATCH support
        Route::delete('my-students/{id}', [StudentController::class, 'destroyAssigned']);
        Route::post('my-students', [StudentController::class, 'storeAssigned']);

        // Teacher Profile
        Route::get('/teacher/profile', [TeacherController::class, 'profile']);
    });

//student routes
    Route::middleware('role:student')->group(function () {
        Route::get('/student/profile', [StudentController::class, 'profile']);
    });
});
