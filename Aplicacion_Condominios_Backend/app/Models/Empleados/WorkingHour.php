<?php

namespace App\Models\Empleados;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkingHour extends Model
{
    use HasFactory;
    protected $fillable = [
        'dia',
        'hora_entrada',
        'hora_salida',
        'empleado'
    ];
}
