export interface APIResponseReservations {
  data: Data;
}

export interface Data {
  reservations: Reservation[];
}

export interface Reservation {
  idCommonArea: number;
  idReservation: number;
  reservationDate: Date;
  startTime: string;
  endTime: string;
  reason: string;
  numberPeople: number;
  title: string;
}

export interface CreateReservationDTO {
  idCommonArea: number;
  reservationDate: string;
  startTime: string;
  endTime: string;
  reason: string;
  numberPeople: number;
  title: string;
}
