<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\User;
use App\Models\Teacher;
use Illuminate\Http\Request;
use App\Http\Requests\StoreStudentRequest;

class StudentController extends Controller
{
    // Admin can view all students
    public function index()
    {
        return Student::with(['user', 'teacher.user'])->paginate(10);
    }

    // Admin creates student
    public function store(StoreStudentRequest $request)
    {
        $user = User::create([
            'name' => $request->first_name . ' ' . $request->last_name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => 'student',
        ]);

        $student = Student::create([
            'user_id' => $user->id,
            'roll_number' => $request->roll_number,
            'student_class' => $request->student_class,
            'phone_number' => $request->phone_number,
            'date_of_birth' => $request->date_of_birth,
            'admission_date' => $request->admission_date,
            'status' => $request->status,
            'assigned_teacher_id' => $request->assigned_teacher_id,
        ]);

        return response()->json($student->load(['user', 'teacher.user']), 201);
    }

    // Admin views student
    public function show($id)
    {
        $student = Student::with(['user', 'teacher.user'])->findOrFail($id);
        return response()->json($student);
    }

    // Admin updates student
    public function update(StoreStudentRequest $request, string $id)
    {
        $student = Student::findOrFail($id);

        $student->update($request->only([
            'roll_number', 'student_class', 'phone_number',
            'date_of_birth', 'admission_date', 'status', 'assigned_teacher_id'
        ]));

        $userData = [];
        if ($request->has('first_name') && $request->has('last_name')) {
            $userData['name'] = $request->first_name . ' ' . $request->last_name;
        }
        if ($request->has('email')) {
            $userData['email'] = $request->email;
        }
        if (!empty($userData)) {
            $student->user->update($userData);
        }

        return response()->json($student->load(['user', 'teacher.user']));
    }

    // Admin deletes student
    public function destroy(string $id)
    {
        $student = Student::findOrFail($id);
        $student->user->delete();
        $student->delete();

        return response()->json(['message' => 'Student deleted']);
    }

    // Teacher lists their students
    public function myStudents()
    {
        $teacher = auth()->user()->teacher;
        $students = $teacher->students()->with('user')->paginate(10);
        return response()->json($students);
    }

    // Teacher views assigned student
    public function showAssigned($id)
    {
        $teacher = auth()->user()->teacher;
        $student = $teacher->students()->with('user')->findOrFail($id);
        return response()->json($student);
    }

    // Teacher updates assigned student
    public function updateAssigned(StoreStudentRequest $request, $id)
    {
        $teacher = auth()->user()->teacher;
        $student = $teacher->students()->findOrFail($id);

        $student->update($request->only([
            'roll_number', 'student_class', 'phone_number',
            'date_of_birth', 'admission_date', 'status'
        ]));

        $userData = [];
        if ($request->has('first_name') && $request->has('last_name')) {
            $userData['name'] = $request->first_name . ' ' . $request->last_name;
        }
        if ($request->has('email')) {
            $userData['email'] = $request->email;
        }
        if (!empty($userData)) {
            $student->user->update($userData);
        }

        return response()->json($student->load('user'));
    }

    // Teacher deletes assigned student
    public function destroyAssigned($id)
    {
        $teacher = auth()->user()->teacher;
        $student = $teacher->students()->findOrFail($id);
        $student->user->delete();
        $student->delete();

        return response()->json(['message' => 'Student deleted']);
    }

    // Teacher creates student assigned to self
    public function storeAssigned(StoreStudentRequest $request)
    {
        $teacher = auth()->user()->teacher;

        $user = User::create([
            'name' => $request->first_name . ' ' . $request->last_name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => 'student',
        ]);

        $student = Student::create([
            'user_id' => $user->id,
            'roll_number' => $request->roll_number,
            'student_class' => $request->student_class,
            'phone_number' => $request->phone_number,
            'date_of_birth' => $request->date_of_birth,
            'admission_date' => $request->admission_date,
            'status' => $request->status,
            'assigned_teacher_id' => $teacher->id,
        ]);

        return response()->json($student->load('user'), 201);
    }

    // Student self profile
    public function profile()
    {
        $student = auth()->user()->student()->with('user', 'teacher.user')->first();

        if (!$student) {
            return response()->json(['error' => 'Student profile not found'], 404);
        }

        return response()->json($student);
    }
}
