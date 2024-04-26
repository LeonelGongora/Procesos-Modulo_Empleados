<?php

namespace App\Http\Controllers\Departamento;

use App\Http\Controllers\Controller;
use App\Models\GestDepartamento\Contrato;
use Illuminate\Http\Request;

class ContratoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        return Contrato::all();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
        $contrato = new Contrato();
        $validatedData = $request->validate([
            'fecha_inicio_contrato' => 'required|date',
            'fecha_fin_contrato' => 'required|date',
            'precio_contrato' => 'required|numeric',
            'tipo_contrato' => 'required|string',
            'vigente_contrato' => 'required|boolean',
            'departamento_id' => 'nullable|numeric'
        ]);
        $contrato->fill($validatedData);
        try{
            $contrato->save();
            return response()->json([
                'status' => 200,
                'message' => 'Contrato creado exitosamente'
            ]);
        }catch(\Exception $e){
            return response()->json([
                'status' => 500,
                'message' => 'Error al crear el contrato'
            ]);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\GestDepartamento\Contrato  $contrato
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
        $contrato = Contrato::find($id);
        return $contrato;
    }
    /* public function show(Contrato $contrato)
    {
        //
        if(!$contrato){
            return response()->json([
                'status' => 404,
                'message' => 'Contrato no encontrado'
            ]);
        }
        return response()->json([
            'status' => 200,
            'data' => $contrato
        ]);
    } */
    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\GestDepartamento\Contrato  $contrato
     * @return \Illuminate\Http\Response
     */
    public function edit(Contrato $contrato)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\GestDepartamento\Contrato  $contrato
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
        $contrato = Contrato::find($id);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\GestDepartamento\Contrato  $contrato
     * @return \Illuminate\Http\Response
     */
    public function destroy($id){
        //
        try{
            $contrato = Contrato::find($id);
            $contrato->delete();
            return response()->json([
                'status' => 200,
                'message' => 'Contrato eliminado exitosamente'
            ]);
        }catch(\Exception $e){
            return response()->json([
                'status' => 500,
                'message' => 'Error al eliminar el contrato'
            ]);
        }
    }
    /* public function destroy(Contrato $contrato)
    {
        //
        try{
            $contrato->delete();
            return response()->json([
                'status' => 200,
                'message' => 'Contrato eliminado exitosamente'
            ]);
        }catch(\Exception $e){
            return response()->json([
                'status' => 500,
                'message' => 'Error al eliminar el contrato'
            ]);
        }
        
    } */
}
