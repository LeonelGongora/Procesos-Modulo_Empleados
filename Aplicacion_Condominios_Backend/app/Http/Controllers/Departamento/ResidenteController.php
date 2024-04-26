<?php

namespace App\Http\Controllers\Departamento;

use App\Http\Controllers\Controller;
use App\Models\GestDepartamento\Residente;
use Illuminate\Http\Request;
use League\Csv\Reader;
use Illuminate\Support\Facades\Validator;

class ResidenteController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //mostrar todos los residentes
        
        $residentes = Residente::all();
        return $residentes;
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
        //validacion de datos
        $validate = $request->validate([
            'nombre_residente' => 'required|string|max:50',
            'apellidos_residente' => 'required|string|max:150',
            'cedula_residente' => 'required',
            'telefono_residente' => 'required',
            'fecha_nacimiento_residente' => 'required|date',
            'tipo_residente' => 'required',
            'nacionalidad_residente' => 'required',
            'email_residente' => 'nullable|email|unique:residentes,email_residente',
            'genero_residente' => 'required',
            'estado_residente' => 'required',
            'imagen_residente' => 'sometimes|file|image|mimes:jpeg,png,jpg,gif,svg|max:3048',
            'contrato_id' => 'nullable',
        ]);
        //Residente::create($validate);
        $residente = new Residente($validate);
        if($request->hasFile('imagen_residente')){
            $image = $request->file('imagen_residente');
            $name = time().'.'.$image->getClientOriginalExtension();
            $image->move('departamento/images/residentes/', $name);
            $residente->imagen_residente = "departamento/images/residentes/${name}";
            $residente->save();
            return response()->json([
                'status' => 200,
                'message' => 'Residente creado exitosamente'
            ]);
        }else{
            $errors = $request->file('imagen_residente') ? $request->file('imagen_residente')->getErrorMessage() : 'No file or file has errors';
            \Log::info('Error with image upload: ' . $errors);  // Utiliza Log para verificar qué está pasando


            $residente->imagen_residente = 'departamento/images/residentes/residente_default.png';
            $residente->save();
            return response()->json([
                'status' => 200,
                'message' => 'Residente creado por defecto'
            ]);
        }
        
        /* if(!$request->hasFile('imagen_residente') || !$residente->imagen_residente){
            //añade una imagen predeterminada si no se sube una imagen
            $imagenPredeterminada = 'departamento/images/residentes/residente_default.png';
            $residente->imagen_residente = $imagenPredeterminada;
            $residente->save();
            return response()->json([
                'status' => 200,
                'message' => 'Residente creado exitosamente'
            ]);
        } */
        
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\GestDepartamento\Residente  $residente
     * @return \Illuminate\Http\Response
     */
    public function show(Residente $residente)
    {
        //
    }

    public function getResidentesbyEstado($estado)
    {
        $residentes = Residente::where('estado_residente', $estado)->get();
        return $residentes;
    } 

    public function actualizarEstadoContrato()
    {
        // Busca los residentes con contrato_id null
        $residentesSinContrato = Residente::whereNull('contrato_id')->get();

        // Actualiza el estado_residente a 0 para los residentes encontrados
        foreach ($residentesSinContrato as $residente) {
            $residente->estado_residente = 0;
            $residente->save();
        }

        return response()->json(['mensaje' => 'Estado de residentes actualizado correctamente']);
    }

    public function actualizarEstadoResidente(Request $request, $id)
    {
        $usuario = Residente::findOrFail($id);

        // Actualiza el atributo específico
        $usuario->estado_residente = $request->input('estado_residente');
        $usuario->save();

        return response()->json(['mensaje' => 'Atributo actualizado correctamente']);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\GestDepartamento\Residente  $residente
     * @return \Illuminate\Http\Response
     */
    public function edit(Residente $residente)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\GestDepartamento\Residente  $residente
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Residente $residente)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\GestDepartamento\Residente  $residente
     * @return \Illuminate\Http\Response
     */
    public function destroy(Residente $residente)
    {
        //
    }
    public function import(Request $request){
        $file = $request->file('file');
        //leer el archivo csv
        $csv = Reader::createFromPath($file->getPathname(), 'r');
        $csv->setHeaderOffset(0); //ignora la primera fila asumiendo que son los encabezados

        $records = $csv->getRecords(); //obtiene todos los registros

        foreach($records as $record){
            //validar si el registro ya existe
            $validator = Validator::make($record,[
                'nombre_residente' => 'required|string|max:100',
                'apellidos_residente' => 'required|string|max:150',
                'cedula_residente' => 'required',
                'telefono_residente' => 'required',
                'fecha_nacimiento_residente' => 'required',
                'tipo_residente' => 'required',
                'nacionalidad_residente' => 'required',
                'email_residente' => 'nullable|email|unique:residentes,email_residente',
                'genero_residente' => 'required',
                'estado_residente' => 'required',
                'imagen_residente' => 'required',
                'contrato_id' => 'nullable'
            ]);

            //verificar si la validación falla
            if($validator->fails()){
                //retornar respuesta con errores
                return response()->json([
                    'status' => 400,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ]);
                continue; //continuar con el siguiente registro
            }
            //crear un nuevo residente
            /* $residente = new Residente();
            $residente->nombre_residente = $record['nombre_residente'];
            $residente->apellido_residente = $record['apellido_residente'];
            $residente->cedula_residente = $record['cedula_residente']; */
            //si la validación es exitosa, crear un nuevo residente
            $residente = Residente::create([
                'nombre_residente' => $record['nombre_residente'],
                'apellidos_residente' => $record['apellidos_residente'],
                'cedula_residente' => $record['cedula_residente'],
                'telefono_residente' => $record['telefono_residente'],
                'fecha_nacimiento_residente' => $record['fecha_nacimiento_residente'],
                'tipo_residente' => $record['tipo_residente'],
                'nacionalidad_residente' => $record['nacionalidad_residente'],
                'email_residente' => $record['email_residente'],
                'genero_residente' => $record['genero_residente'],
                'estado_residente' => $record['estado_residente'],
                'imagen_residente' => $record['imagen_residente'],
                'contrato_id' => $record['contrato_id']
            ]);
            //guardar el residente
            $residente->save(); //guardar el residente
        }
        return response()->json([
            'status' => 200,
            'message' => 'Residentes importados exitosamente'
        ]);
    }
}
