<?php

namespace App\Http\Controllers\Cobro_Servicios;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Cobro_Servicios\PreAvisoModel;
use App\Models\Cobro_Servicios\ExpensaModel;
use App\Models\GestDepartamento\departamento;

class PreAvisoController extends Controller
{
    public function obtenerNombresDepartamentos()
    {
        $departamentos = departamento::pluck('nombre_departamento','id');
        return $departamentos;
    }
    public function store(Request $request)
    {
        $expensa = new ExpensaModel();
        $expensa->departamento_id = $request->departamento_id;
        $expensa->fecha = $request->fecha;
        $expensa->propietario_pagar = $request->propietario_pagar; 
        $expensa->descripcion_servicios = $request->descripcion_servicios;
        $expensa->servicio_pagar = $request->servicio_pagar;
        $expensa->monto = $request->monto;
        $expensa->save();

        return response()->json([
            'status' => 200,
            'message' => 'Pre aviso de Expensa generado existosamente',
        ]);
    }


    /*public function obtenerTodosPreAvisos()
    {
        $preAvisos = ExpensaModel::all()->toArray(); // Convertimos los resultados a un array
        return response()->json([
            'status' => 200,
            'preAvisos' => $preAvisos,
        ]);
    }*/

    public function obtenerTodosPreAvisos()
{
    $preAvisos = ExpensaModel::with('departamento:id,nombre_departamento')->get()->toArray();
    return response()->json([
        'status' => 200,
        'preAvisos' => $preAvisos,
    ]);
}
}
