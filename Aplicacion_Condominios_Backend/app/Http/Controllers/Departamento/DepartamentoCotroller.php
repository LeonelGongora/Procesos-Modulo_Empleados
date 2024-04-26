<?php

namespace App\Http\Controllers\Departamento;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\GestDepartamento\departamento;

class DepartamentoCotroller extends Controller
{
    
    public function index()
    {
        $departamentos = departamento::all();
        return $departamentos;
    }
   
    public function store(Request $request)
    {

        $departamento = new departamento();
        $departamento-> nombre_departamento = $request -> nombre_departamento;
        $departamento-> numero_habitaciones = $request -> numero_habitaciones;
        $departamento-> numero_personas = $request -> numero_personas;
        $departamento-> superficie = $request -> superficie;
        $departamento-> disponibilidad = $request -> disponibilidad;
        $departamento-> amoblado = $request -> amoblado;
        $departamento-> descripcion_departamento = $request -> descripcion_departamento;
        $departamento-> piso = $request -> piso;

        $departamento-> edificio_id = $request -> edificio_id;

        if($request -> hasFile ('imagen_departamento')){
            $image = $request->file('imagen_departamento');
            $name = time().'.'.$image->getClientOriginalExtension();
            $image->move('departamento/images/departamentos/', $name);

            $departamento-> imagen_departamento = "departamento/images/departamentos/${name}";
            $departamento-> save();

            return response()->json([
                'status' => 200,
                'message' =>'Evento añadido exitosamente',
            ]);

        }
        if (!$request->hasFile('imagen_departamento') || !$departamento->imagen_departamento) {
            // Ruta de la imagen predeterminada
            $imagenPredeterminada = 'departamento/images/departamentos/departamento_pred.jpeg';
            $departamento->imagen_departamento = $imagenPredeterminada;
        }

        $departamento->save();
    }

    public function show($id)
    {
        $departamento = departamento::find($id);
        return $departamento;
    }

    public function update(Request $request, $id)
    {
        $departamento = departamento::findOrFail($id);
        $departamento-> nombre_departamento = $request -> nombre_departamento;
        $departamento-> numero_habitaciones = $request -> numero_habitaciones;
        $departamento-> numero_personas = $request -> numero_personas;
        $departamento-> superficie = $request -> superficie;
        $departamento-> disponibilidad = $request -> disponibilidad;
        $departamento-> amoblado = $request -> amoblado;
        $departamento-> descripcion_departamento = $request -> descripcion_departamento;
        $departamento-> piso = $request -> piso;
        /* $departamento-> edificio_id = $request -> edificio_id; */

        if ($request->hasFile('imagen_departamento')) {
            $image = $request->file('imagen_departamento');
            $name = time() . '.' . $image->getClientOriginalExtension();
            $image->move('departamento/images/departamentos/', $name);
    
            $departamento->imagen_departamento = "departamento/images/departamentos/{$name}";
        }
    
        // Guardar los cambios en el departamento
        $departamento->save();

        $departamento->update();
    }

    public function destroy($id)
    {
        $departamento = departamento::destroy($id);
        return response()->json([
            'message' => 'Departameto eliminado'
            ]);        
    }

    public function actualizarDisponibilidadDepa(Request $request, $id)
    {
        $departamento = Departamento::findOrFail($id);

        // Actualiza el atributo específico
        $departamento->disponibilidad = $request->input('disponibilidad');
        $departamento->save();

        return response()->json(['mensaje' => 'Atributo actualizado correctamente']);
    }
}
