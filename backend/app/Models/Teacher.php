<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{


     protected $fillable = [
        'user_id',
        'subject_specialization',
        'employee_id',
        'phone_number',
        'date_of_joining',
        'status',
    ];
    public function user() 
    {
        return $this->belongsTo(User::class);
    }

    public function students() 
    {
        return $this->hasMany(Student::class, 'assigned_teacher_id');
    }

}
