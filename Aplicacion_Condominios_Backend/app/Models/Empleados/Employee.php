<?php

namespace App\Models\Empleados;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Empleados\Contract;
use App\Models\Empleados\WorkingHour;
class Employee extends Model
{
    use HasFactory;
    protected $fillable = [
        'nombre',
        'apellido',
        'correo',
        'celular',
        'genero',
        'estado_contrato',
        'ci'
    ];

    protected $with = ['contracts', 'working_hours'];

    public function contracts(){

        return $this->hasMany(Contract::class, 'empleado', 'id');

    }

    public function working_hours(){

        return $this->hasMany(WorkingHour::class, 'empleado', 'id');

    }

    public function asistencias(){
        return $this->hasMany(Asistencia::class, 'id_empleado', 'id');
    }
}
