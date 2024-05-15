<?php

namespace App\Http\Controllers\Empleados;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Empleados\Employee;
use App\Models\Empleados\Asistencia;
class EmployeeController extends Controller
{
    public function store(Request $request){

        $empleado = new Employee();

        $empleado-> nombre = $request -> nombre;
        $empleado-> apellido = $request -> apellido;
        $empleado-> correo = $request -> correo;
        $empleado-> celular = $request -> celular;
        $empleado-> genero = $request -> genero;
        $empleado-> ci = $request -> ci;
        $empleado-> estado_contrato = $request -> estado_contrato;

        $empleado -> save();

        return response()->json([
            'status' => 200,
            'message' => 'Empleado añadido exitosamente',
        ]);
    }

    public function getAll(){
        $empleados = Employee::all();
        return response()->json([
            'status' => 200,
            'empleados' => $empleados,
        ]);
    }

    public function delete($id){
        $empleado = Employee::find($id);
        $empleado->delete();
        return response()->json([
            'status' => 200,
            'message' =>'Empleado eliminado exitosamente']);
    }

    public function getById($id){
        $empleado = Employee::find($id);
        return response()->json([
            'status' => 200,
            'message' =>'Empleado eliminado exitosamente',
            'empleado' => $empleado]);
    }

    public function update(Request $request, $id){

        $empleado = Employee::find($id);

        $empleado-> nombre = $request -> nombre;
        $empleado-> apellido = $request -> apellido;
        $empleado-> correo = $request -> correo;
        $empleado-> celular = $request -> celular;

        $empleado -> update();

        return response()->json([
            'status' => 200,
            'message' =>'Empleado actualizado exitosamente']);
    }

    public function updateContractStatus(Request $request, $id){

        $empleado = Employee::find($id);

        $empleado-> estado_contrato = $request -> estado_contrato;

        $empleado -> update();

        return response()->json([
            'status' => 200,
            'message' =>'Estado contrato actualizado exitosamente']);
    }

    public function getEmployeeWithContract(){

        $empleadosConContrato = Employee::has('contracts')->get();

        return response()->json([
            'status' => 200,
            'message' =>'Empleados con contrato obtenidos exitosamente',
            'empleados' => $empleadosConContrato
        ]);
    }

    public function marcarHora(Request $request){
        $ci = $request -> ci;
        
        $empleadoId = Employee::select('id')
                              ->where('ci',$ci)
                              ->first();
        if($empleadoId){
            $id = $empleadoId -> id;
            //$diaActual = Carbon::now()->isoFormat('dddd');
            date_default_timezone_set('America/La_Paz');
            $horaActual = date('H:i:s');
            $fechaActual = date('Y-m-d');
            
            $horaMarcada = Asistencia::where('id_empleado',$id)
                                      ->where('fecha',$fechaActual)
                                      ->where('hora_salida',null)
                                      ->first();
            
            if($horaMarcada){
                $horaMarcada -> hora_salida = $horaActual;

                $horaMarcada -> save();
                return response()->json([
                        'status' => 200,
                        'mensaje' => 'Update realizado',
                ]);
            }
            else{
                $horaMarcadaEntradaSalida = Asistencia::where('id_empleado',$id)
                                                       ->where('fecha',$fechaActual)
                                                       ->whereNotNull('hora_salida')
                                                       ->first();
                if($horaMarcadaEntradaSalida){
                    return response()->json([
                        'status' => 200,
                        'mensaje' => 'Ya marco entrada y salida',
                    ]);
                }
                else{
                    $asistencia = new Asistencia();
                    $asistencia-> id_empleado = $id;
                    $asistencia-> hora_entrada = $horaActual;
                    $asistencia -> save();
    
                    return response()->json([
                        'status' => 200,
                        'mensaje' => 'Ingreso realizado',
                    ]);
                }

            }
        }
        else{
            return response()->json([
                'status' => 200,
                'mensaje' => 'No existe el usuario',
            ]);
        }
    }
}
