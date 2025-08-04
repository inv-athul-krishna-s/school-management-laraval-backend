<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Teacher;

class StoreTeacherRequest extends FormRequest
{
    public function authorize()
    {
        return true; 
    }

    public function rules()
    {
        // Default: assume all optional (only validated if present)
        $rules = [
            'first_name' => 'sometimes|required|string|max:50',
            'last_name' => 'sometimes|required|string|max:50',
            'subject_specialization' => 'sometimes|required|string|max:255',
            'employee_id' => 'sometimes|required|string|max:50',
            'phone_number' => 'sometimes|required|string|max:20',
            'date_of_joining' => 'sometimes|required|date',
            'status' => 'sometimes|required|in:active,inactive',
        ];

        if ($this->isMethod('post')) {
            // On create — all required
            $rules = [
                'first_name' => 'required|string|max:50',
                'last_name' => 'required|string|max:50',
                'subject_specialization' => 'required|string|max:255',
                'employee_id' => 'required|string|max:50|unique:teachers,employee_id',
                'phone_number' => 'required|string|max:20',
                'date_of_joining' => 'required|date',
                'status' => 'required|in:active,inactive',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|min:6',
            ];
        }

        if ($this->isMethod('put') || $this->isMethod('patch')) {
            // Update teacher — get teacher ID from route and related user ID
            $teacherId = $this->route('id');
            $teacher = Teacher::find($teacherId);
            $userId = $teacher ? $teacher->user_id : null;

            $rules['email'] = 'sometimes|required|email|unique:users,email,' . $userId;
            $rules['employee_id'] = 'sometimes|required|string|unique:teachers,employee_id,' . $teacherId;
            $rules['password'] = 'sometimes|nullable|min:6';
        }

        return $rules;
    }
}
