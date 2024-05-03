import useCreateReservation from "../../hooks/useCreateReservation";
import Loader from "../Loader/Loader";
import "./reservation-form.css";

interface ReservationFormProps {
  idCommonArea: number;
}

export default function ReservationForm({
  idCommonArea,
}: ReservationFormProps) {
  const {
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
    errorMessage,
    errors,
    onSubmit,
    submitting,
  } = useCreateReservation({ idCommonArea });

  return (
    <form onSubmit={onSubmit} className="form">
      <div className="form-group">
        <label htmlFor="title">Título</label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={handleTitleChange}
        />
      </div>

      <div className="form-group-container">
        <div
          className="form-group"
          style={{
            flex: "1",
          }}
        >
          <label htmlFor="date">Fecha</label>
          <input
            type="date"
            id="date"
            name="date"
            value={date}
            onChange={handleDateChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="numberOfPeople">Número de personas</label>
          <input
            type="number"
            min={0}
            id="numberOfPeople"
            name="numberOfPeople"
            value={numberPeople}
            onChange={handleNumberPeopleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="time">Hora Inicio</label>
        <input
          type="time"
          id="time"
          name="time"
          value={startTime}
          onChange={handleStartTimeChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="endTime">Hora Finalización</label>
        <input
          type="time"
          id="endTime"
          name="endTime"
          value={endTime}
          onChange={handleEndTimeChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="residente">Residente</label>
        <select id="residente" name="residente">
          <option value="1">Residente 1</option>
          <option value="2">Residente 2</option>
          <option value="3">Residente 3</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="description">Motivo</label>
        <textarea
          rows={7}
          id="description"
          name="description"
          value={reason}
          onChange={handleReasonChange}
        ></textarea>
      </div>

      {submitting && (
        <div className="loader-container">
          <Loader />
        </div>
      )}

      {errorMessage !== "" && (
        <div className="errors-container">
          <h3
            style={{
              padding: 0,
              margin: 0,
              textAlign: "center",
            }}
          >
            {errorMessage}
          </h3>

          <ul>
            {errors.map((error, index) => {
              return <li key={index}>{error}</li>;
            })}
          </ul>
        </div>
      )}

      <button className="btn" type="submit">
        Reservar
      </button>
    </form>
  );
}
