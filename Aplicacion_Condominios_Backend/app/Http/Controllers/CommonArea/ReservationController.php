<?php

namespace App\Http\Controllers\CommonArea;

use App\Http\Controllers\Controller;
use App\Http\Requests\CommonArea\ReservationRequest;
use App\Models\CommonArea\CommonArea;
use App\Models\CommonArea\Reservation;
use App\Services\CommonArea\CommonAreaService;
use Illuminate\Http\Request;

class ReservationController extends Controller
{

    private $commonAreaService;

    public function __construct(
        CommonAreaService $commonAreaService
    )
    {
        $this->commonAreaService = $commonAreaService;
    }

    public function index()
    {
        //
    }

    public function store(ReservationRequest $request)
    {
        [
            "idCommonArea" => $id_common_area,
            "reservationDate" => $reserved_date,
            "startTime" => $start_time,
            "endTime" => $end_time,
            "reason" => $reason,
            "numberPeople" => $number_people,
            "title" => $title,
        ] = $request->all();

        $isValidate = $this->commonAreaService->validateTimeReservation($id_common_area, $reserved_date, $start_time, $end_time);

        if(!$isValidate){
            return response()->json(['message' => 'El horario no esta disponible.',"errors" => []], 400);
        }

        $commonArea = CommonArea::find($id_common_area);

        if(!$commonArea){
            return response()->json(['message' => 'Area comun no encontrada',"errors" => []], 404);
        }

        $commonArea->reservations()->create([
            'reserved_date' => $reserved_date,
            'start_time' => $start_time,
            'end_time' => $end_time,
            'reason' => $reason,
            'number_of_people' => $number_people,
            'title' => $title
        ]);


        return response()->json(['message' => 'Reservacion creada correctamente'], 201);
    }

    public function show(Reservation $reservation)
    {
        //
    }

    public function update(Request $request, Reservation $reservation)
    {
        //
    }

    public function destroy(Reservation $reservation)
    {
        //
    }
}
