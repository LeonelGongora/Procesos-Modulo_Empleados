<?php

namespace App\Http\Controllers\CommonArea;

use App\Http\Controllers\Controller;
use App\Http\Requests\CommonArea\CommonAreaRequest;
use App\Http\Requests\CommonArea\ReservationRequest;
use App\Http\Requests\CommonArea\UpdateCommonAreaRequest;
use App\Http\Resources\CommonArea\CommonAreaCollection;
use App\Http\Resources\CommonArea\CommonAreaResource;
use App\Http\Resources\CommonArea\ReservationCollection;
use App\Models\CommonArea\CommonArea;
use App\Models\CommonArea\Policy;
use App\Models\CommonArea\Schedule;
use Illuminate\Support\Facades\DB;

class CommonAreaController extends Controller
{
    public function index()
    {
        $commonAreas = CommonArea::all();
        $commonAreas = new CommonAreaCollection($commonAreas);
        return response()->json(['data' => [
           'commonAreas' => $commonAreas]
        ], 200);
    }

    public function store(CommonAreaRequest $request)
    {
        $policies = $request->get('policies');
        $schedule = $request->get('schedule');
        $dataCommonArea = [
            'common_area_name' => $request->get('name'),
            'description' => $request->get('description'),
            'capacity' => $request->get('capacity')
        ];

        $file = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $request->get('file')));
        $name = time() . '.jpg';
        $path = public_path('CommonAreas/images/' . $name);
        file_put_contents($path, $file);

        $dataCommonArea['url_image'] = 'CommonAreas/images/' . $name;

        

        try{
            $commonArea = null;
        DB::transaction(function () use ($policies, $schedule, &$commonArea, $dataCommonArea) {
                $commonArea = CommonArea::create($dataCommonArea);
                $schedule = collect($schedule)->map(function ($item) use ($commonArea) {
                    return [
                        'schedule_day' => $item['day'],
                        'start_hour' => $item['startHour'],
                        'end_hour' => $item['endHour'],
                        'id_common_area' => $commonArea->id_common_area
                    ];
                });
    
                $policies = collect($policies)->map(function ($item) use ($commonArea) {
                    return [
                        'description' => $item,
                        'id_common_area' => $commonArea->id_common_area
                    ];
                });
                
                Schedule::insert($schedule->toArray());
                Policy::insert($policies->toArray());
            });

            return response()->json(['data' => [
                'message' => 'Area comun creada correctamente',
                'common_area' => $commonArea
            ]], 201);
        }catch(\Exception $e){
            return response()->json(['message' => 'Error al crear el area comun',
            'errors' => [$e->getMessage()]
        ], 500);
        }
    }

    public function show($idCommonArea)
    {
        $commonArea = CommonArea::find($idCommonArea);
        if(!$commonArea){
            return response()->json(['message' => 'Area comun no encontrada'], 404);
        }
        return response()->json(['data' => [
            'commonArea' => new CommonAreaResource($commonArea)
        ]], 200);
    }

    public function update(UpdateCommonAreaRequest $request, $idCommonArea)
    {
        $policies = $request->get('policies');
        $schedule = $request->get('schedule');
        $name = $request->get('name');
        $description = $request->get('description');
        $capacity = $request->get('capacity');

        $commonArea = CommonArea::find($idCommonArea);

        $oldName = $commonArea->common_area_name;
        $oldDescription = $commonArea->description;
        $oldCapacity = $commonArea->capacity;

        $commonArea->common_area_name = isset($name) ? $name : $oldName;
        $commonArea->description = isset($description) ? $description : $oldDescription;
        $commonArea->capacity = isset($capacity) ? $capacity : $oldCapacity;

        if($schedule) {
            $commonArea->schedules()->delete();
            $values = collect($schedule)->map(function ($item) use ($commonArea) {
                return [
                    "schedule_day" => $item['day'],
                    "start_hour" => $item['startHour'],
                    "end_hour" => $item['endHour'],
                    "id_common_area" => $commonArea->id_common_area
                ];
            })->toArray();
            Schedule::insert($values);
        }

        if($policies) {
            $commonArea->policies()->delete();
            $values = collect($policies)->map(function ($item) use ($commonArea) {
                return [
                    "description" => $item,
                    "id_common_area" => $commonArea->id_common_area
                ];
            })->toArray();
            Policy::insert($values);
        }

        $commonArea->save();
        return response()->json(['data' => [
            'message' => 'Area comun actualizada correctamente',
            'commonArea' => new CommonAreaResource($commonArea)
        ]], 200);
    }

    public function destroy($idCommonArea)
    {
        $commonArea = CommonArea::find($idCommonArea);
        if(!$commonArea){
            return response()->json(['message' => 'Area comun no encontrada'], 404);
        }
        // delete file image
        $path = public_path($commonArea->url_image);
        if(file_exists($path)){
            unlink($path);
        }
        
        $commonArea->delete();
        return response()->json(['message' => 'Area comun eliminada correctamente'], 200);
    }

    public function reservations($idCommonArea) {
        $commonArea = CommonArea::find($idCommonArea);
        if(!$commonArea){
            return response()->json(['message' => 'Area comun no encontrada'], 404);
        }
        $reservations = $commonArea->reservations;
        return response()->json(['data' => [
            'reservations' => new ReservationCollection($reservations)
        ]], 200);
    }
}
