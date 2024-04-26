<?php

namespace App\Models\Empleados;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Empleados\Contract;
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

    protected $with = ['contracts'];

    public function contracts(){

        return $this->hasMany(Contract::class, 'empleado', 'id');

    }
}
