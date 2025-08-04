<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\StoreTeacherRequest;

class TeacherController extends Controller
{
    // Admin: List all teachers
    public function index()
    {
        return Teacher::with('user')->paginate(10);
    }

    // Admin: Create teacher
    public function store(StoreTeacherRequest $request)
    {
        $user = User::create([
            'name' => $request->first_name . ' ' . $request->last_name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => 'teacher',
        ]);

        $teacher = Teacher::create([
            'user_id' => $user->id,
            'subject_specialization' => $request->subject_specialization,
            'employee_id' => $request->employee_id,
            'phone_number' => $request->phone_number,
            'date_of_joining' => $request->date_of_joining,
            'status' => $request->status,
        ]);

        return response()->json($teacher->load('user'), 201);
    }

    // Admin: Show specific teacher
    public function show($id)
    {
        $teacher = Teacher::with('user')->findOrFail($id);
        return response()->json($teacher);
    }

    // Admin: Update teacher
    public function update(StoreTeacherRequest $request, $id)
    {
        $teacher = Teacher::findOrFail($id);

        // Safely collect only non-null values for teacher update
        $teacherData = $request->only([
            'subject_specialization',
            'employee_id',
            'phone_number',
            'date_of_joining',
            'status'
        ]);

        $teacher->update($teacherData);

        // Safely collect only non-null values for user update
        $userData = [];
        if ($request->filled('first_name') && $request->filled('last_name')) {
            $userData['name'] = $request->first_name . ' ' . $request->last_name;
        }
        if ($request->filled('email')) {
            $userData['email'] = $request->email;
        }

        if (!empty($userData)) {
            $teacher->user->update($userData);
        }

        return response()->json($teacher->load('user'));
    }

    // Admin: Delete teacher
    public function destroy($id)
    {
        $teacher = Teacher::findOrFail($id);
        $teacher->user->delete();
        $teacher->delete();

        return response()->json(['message' => 'Teacher deleted']);
    }

    // Admin: List students under a teacher
    public function students($id)
    {
        $teacher = Teacher::with('students.user')->findOrFail($id);
        return response()->json($teacher->students);
    }

    // Teacher: View own profile
    public function profile()
    {
        $teacher = auth()->user()->teacher()->with('user')->first();

        if (!$teacher) {
            return response()->json(['error' => 'Teacher profile not found'], 404);
        }

        return response()->json($teacher);
    }
}
