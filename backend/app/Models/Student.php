<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{

    protected $fillable = [
        'user_id',
        'roll_number',
        'student_class',
        'phone_number',
        'date_of_birth',
        'admission_date',
        'status',
        'assigned_teacher_id',
    ];
    public function user() 
    {
        return $this->belongsTo(User::class);
    }

    public function teacher() 
    {
        return $this->belongsTo(Teacher::class, 'assigned_teacher_id');
    }

}
