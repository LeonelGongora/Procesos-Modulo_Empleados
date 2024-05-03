<?php

namespace App\Http\Controllers\Cobro_Servicios;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Cobro_Servicios\PreAvisoModel;
use App\Models\Cobro_Servicios\ExpensaModel;
use App\Models\GestDepartamento\Departamento;

class PreAvisoController extends Controller
{
    public function obtenerNombresDepartamentos()
    {
        $departamentos = Departamento::pluck('nombre_departamento','id');
        return $departamentos;
    }
    public function store(Request $request)
    {
        $expensa = new ExpensaModel();
        $expensa->departamento_id = $request->departamento_id;
        $expensa->fecha = $request->fecha;
        $expensa->propietario_pagar = $request->propietario_pagar; // Agregar punto y coma aquí
        $expensa->descripcion_servicios = $request->descripcion_servicios;
        $expensa->servicio_pagar = $request->servicio_pagar; // Agregar punto y coma aquí
        $expensa->monto = $request->monto;
        $expensa->save();
        
        return response()->json([
            'status' => 200,
            'message' => 'Expensa generada existosamente',
        ]);
    }
}
