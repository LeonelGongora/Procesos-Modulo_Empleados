import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { CreateReservationDTO } from "../interfaces/reservations";
import { createReservation } from "../services/reservation.service";

interface Props {
  idCommonArea: number;
}

export default function useCreateReservation({ idCommonArea }: Props) {
  const [title, setTitle] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [numberPeople, setNumberPeople] = useState<string>("");

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);

  const [submitting, setSubmitting] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);
  };

  const handleStartTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStartTime(event.target.value);
  };

  const handleEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndTime(event.target.value);
  };

  const handleReasonChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setReason(event.target.value);
  };

  const handleNumberPeopleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log(event.target.value);
    setNumberPeople(event.target.value);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data: CreateReservationDTO = {
      idCommonArea,
      title,
      reservationDate: date,
      startTime,
      endTime,
      reason,
      numberPeople: parseInt(numberPeople, 10),
    };

    try {
      setErrorMessage("");
      setErrors([]);
      setSubmitting(true);

      await createReservation(data);

      Swal.fire(
        "¡Reservación creada!",
        "La reservación ha sido creada.",
        "success"
      );

      clearFields();

      navigate(`/areas-comunes/calendario/${idCommonArea}`);
    } catch (error: any) {
      setErrorMessage(error.message);
      setErrors(error.errors);
    } finally {
      setSubmitting(false);
    }
  };

  const clearFields = () => {
    setTitle("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setReason("");
    setNumberPeople("");
  };

  return {
    title,
    date,
    startTime,
    endTime,
    reason,
    numberPeople,
    handleTitleChange,
    handleDateChange,
    handleStartTimeChange,
    handleEndTimeChange,
    handleReasonChange,
    handleNumberPeopleChange,
    onSubmit,
    errorMessage,
    errors,
    submitting,
  };
}
