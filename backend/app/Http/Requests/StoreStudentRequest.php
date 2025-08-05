<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Student;

class StoreStudentRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $rules = [];

        if ($this->isMethod('post')) {
            // Creation - required fields
            $rules = [
                'first_name' => 'required|string|max:50',
                'last_name' => 'required|string|max:50',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:3',
                'phone_number' => 'required|string|max:20',
                'roll_number' => 'required|string|unique:students,roll_number',
                'student_class' => 'required|string|max:100',
                'date_of_birth' => 'required|date',
                'admission_date' => 'required|date',
                'status' => 'required|in:active,inactive',
                
            ];
            if (auth()->user()->role === 'admin') {
                $rules['assigned_teacher_id'] = 'required|exists:teachers,id';
            } elseif (auth()->user()->role === 'teacher') {
            $rules['assigned_teacher_id'] = 'prohibited';
            }
        }

        if ($this->isMethod('put') || $this->isMethod('patch')) {
            $studentId = $this->route('id');
            $student = Student::find($studentId);
            $userId = $student ? $student->user_id : null;

            $baseRules = [
                'first_name' => 'sometimes|required|string|max:50',
                'last_name' => 'sometimes|required|string|max:50',
                'email' => 'sometimes|required|email|unique:users,email,' . $userId,
                'phone_number' => 'sometimes|required|string|max:20',
                'roll_number' => 'sometimes|required|string|unique:students,roll_number,' . $studentId,
                'student_class' => 'sometimes|required|string|max:100',
                'date_of_birth' => 'sometimes|required|date',
                'admission_date' => 'sometimes|required|date',
                'status' => 'sometimes|required|in:active,inactive',
            ];

            $rules = $baseRules;

            if ($this->routeIs('students.update')) {
                // Admin updating - allow assigned_teacher_id
                $rules['assigned_teacher_id'] = 'sometimes|required|exists:teachers,id';
            } elseif ($this->routeIs('students.updateAssigned')) {
                // Teacher updating - block assigned_teacher_id
                $rules['assigned_teacher_id'] = 'prohibited';
            }
        }

        return $rules;
    }
}
