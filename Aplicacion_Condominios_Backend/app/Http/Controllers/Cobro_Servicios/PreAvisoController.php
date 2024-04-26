<?php

namespace App\Http\Controllers\Cobro_Servicios;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Cobro_Servicios\PreAvisoModel;
use App\Models\GestDepartamento\Departamento;

class PreAvisoController extends Controller
{
    public function obtenerNombresDepartamentos()
    {
        $departamentos = Departamento::pluck('nombre_departamento','id');
        return $departamentos;
    }
}
