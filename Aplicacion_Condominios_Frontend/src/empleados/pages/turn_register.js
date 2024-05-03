import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBRadio,
    MDBCheckbox
  }
  from 'mdb-react-ui-kit';

import axios from 'axios';
import Cookies from 'universal-cookie';
import '../css/contract_register_style.css'
const cookies = new Cookies();
function TurnRegister() {
  const empleado = cookies.get("id_empleado_seleccionado");

    const empleado = cookies.get('id_empleado_seleccionado');

    const [errors, setErrors] = useState({});

    const [diasConfirmados, setDiasConfirmados] = useState([
      false, false, false, false, false, false, false
    ]);

    const [diasHorarios, setDiasHorarios] = useState({
      Lunes: { hora_inferior: "", hora_superior: "" },
      Martes: { hora_inferior: "", hora_superior: "" },
      Miercoles: { hora_inferior: "", hora_superior: "" },
      Jueves: { hora_inferior: "", hora_superior: "" },
      Viernes: { hora_inferior: "", hora_superior: "" },
      Sabado: { hora_inferior: "", hora_superior: "" },
      Domingo: { hora_inferior: "", hora_superior: "" }
    });

    useEffect(()=>{

    }, []);
  
    const [values, setValues] = useState({
        tipo_contrato: "",
        fecha_inicio : "",
        fecha_final : "",
        area : "",
        cargo : "",
        beneficios : "",
        salario : "",
      });

      const [dias, setDias] = useState([
        "Lunes",
        "Martes",
        "Miercoles",
        "Jueves",
        "Viernes",
        "Sabado",
        "Domingo"
      ]);

    const handleInput = (e) => {
        const { name, value } = e.target;
        setValues({
          ...values,
          [name]: value,
        });

        if (e.target.name === "tipo_contrato") {
          if (e.target.value === "Fijo") {
            document.getElementById("fecha_final").disabled = true;
          } else {
            document.getElementById("fecha_final").disabled = false;
          }
        }
    };
    
    const handleSubmit =  async (e) => {
        e.preventDefault(); 
        const validationErrors = {};
        console.log(empleado.id)

        for (let i = 0; i < dias.length; i++) {
          let confirmacionDia = document.getElementById(dias[i]);

          if(confirmacionDia.checked && !diasHorarios[dias[i]].hora_inferior.trim()){
            validationErrors[dias[i] + "_inferior"] = "Este campo es obligatorio"
          }

          if(confirmacionDia.checked && !diasHorarios[dias[i]].hora_superior.trim()){
            validationErrors[dias[i] + "_superior"] = "Este campo es obligatorio"
          }
        }

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {

          for (let i = 0; i < dias.length; i++) {
            if(diasHorarios[dias[i]].hora_inferior){
              const data = new FormData();
              data.append("dia", dias[i]);
              data.append("hora_entrada", diasHorarios[dias[i]].hora_inferior);
              data.append("hora_salida", diasHorarios[dias[i]].hora_superior);
              data.append("empleado", empleado.id);
              const respuesta_horario = await axios.post(
                `http://127.0.0.1:8000/api/add_working_hour`,
                data
              );
              if(respuesta_horario.data.status === 200){
                console.log(respuesta_horario.data)
              }
            }
          }
          window.location.href = "./assignTurn";
        }
    };

    diasHorarios["Domingo"] = {
      hora_inferior: "",
      hora_superior: "",
    };
  }, []);

  const [values, setValues] = useState({
    tipo_contrato: "",
    fecha_inicio: "",
    fecha_final: "",
    area: "",
    cargo: "",
    beneficios: "",
    salario: "",
  });

  const [dias, setDias] = useState([
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
    "Domingo",
  ]);

  let diasHorarios = {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!values.fecha_inicio.trim()) {
      validationErrors.fecha_inicio = "Este campo es obligatorio";
    }

    if (!values.fecha_final.trim() && values.tipo_contrato === "Temporal") {
      validationErrors.fecha_final = "Este campo es obligatorio";
    }

    if (!values.area.trim()) {
      validationErrors.area = "Seleccione una area";
    }

    if (!values.cargo.trim()) {
      validationErrors.cargo = "Seleccione un cargo";
    }

    if (!values.salario.trim()) {
      validationErrors.salario = "Este campo es obligatorio";
    } else if (!(Number(values.salario) > 2123)) {
      validationErrors.salario =
        "El salario debe ser un numero entero igual o mayor a 2124 (Minimo Nacional)";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const data = new FormData();

      data.append("tipo_contrato", values.tipo_contrato);
      data.append("fecha_inicio", values.fecha_inicio);
      data.append("fecha_final", values.fecha_final);
      data.append("area", values.area);
      data.append("cargo", values.cargo);
      data.append("beneficios", values.beneficios);
      data.append("salario", values.salario);
      data.append("empleado", empleado.id);

      const res = await axios.post(
        `http://127.0.0.1:8000/api/add_contract`,
        data
      );

      if (res.data.status === 200) {
        const data_contrato = new FormData();
        data_contrato.append("estado_contrato", "Contratado");
        console.log(res);
        const respuesta_estado = await axios.post(
          `http://127.0.0.1:8000/api/updateContractStatus/${empleado.id}`,
          data_contrato
        );
        if (respuesta_estado.data.status === 200) {
          console.log(respuesta_estado);
        }
        window.location.href = "./assignContract";
      }
    }
  };

  const [selectedHorario, setSelectedHorario] = useState("personalizado");

  const cambiarHorario = (dia) => {
    const checkBox = document.getElementById(dia);

    setHorarios((prevHorarios) => ({
      ...prevHorarios,
      [dia]: {
        ...prevHorarios[dia],
        hora1: "",
        hora2: "",
        checked: checkBox.checked,
      },
    }));
  };

  const cambiarHorarioInferior = (e) => {
    const dia = e.target.name;
    const value = e.target.value;

    setHorarios((prevHorarios) => ({
      ...prevHorarios,
      [dia]: {
        ...prevHorarios[dia],
        hora1: value,
        checked: true,
      },
    }));
  };

  const cambiarHorarioSuperior = (e) => {
    const dia = e.target.name;
    const value = e.target.value;

    setHorarios((prevHorarios) => ({
      ...prevHorarios,
      [dia]: {
        ...prevHorarios[dia],
        hora2: value,
        checked: true,
      },
    }));
  };

  const [horarios, setHorarios] = useState({
    Lunes: { hora1: "", hora2: "", checked: false },
    Martes: { hora1: "", hora2: "", checked: false },
    Miercoles: { hora1: "", hora2: "", checked: false },
    Jueves: { hora1: "", hora2: "", checked: false },
    Viernes: { hora1: "", hora2: "", checked: false },
    Sabado: { hora1: "", hora2: "", checked: false },
    Domingo: { hora1: "", hora2: "", checked: false },
  });

  const handleHorarios = (horario, radioB) => {
    const nuevosHorarios = { ...horarios };
    for (const dia of dias) {
      switch (horario) {
        case 1:
          nuevosHorarios[dia] = {
            hora1: "06:00",
            hora2: "18:00",
            checked: true,
          };
          break;
        case 2:
          nuevosHorarios[dia] = {
            hora1: "18:00",
            hora2: "06:00",
            checked: true,
          };
          break;
        case 3:
          if (dia === "Domingo")
            nuevosHorarios[dia] = {
              hora1: "",
              hora2: "",
              checked: false,
            };
          else
            nuevosHorarios[dia] = {
              hora1: "08:00",
              hora2: "16:00",
              checked: true,
            };
          break;
        case 4:
          if (dia === "Domingo")
            nuevosHorarios[dia] = {
              hora1: "",
              hora2: "",
              checked: false,
            };
          else
            nuevosHorarios[dia] = {
              hora1: "16:00",
              hora2: "23:00",
              checked: true,
            };
          break;
        case 5:
          if (dia === "Domingo")
            nuevosHorarios[dia] = {
              hora1: "",
              hora2: "",
              checked: false,
            };
          else
            nuevosHorarios[dia] = {
              hora1: "23:00",
              hora2: "06:00",
              checked: true,
            };
          break;
        default:
          nuevosHorarios[dia] = {
            hora1: "",
            hora2: "",
            checked: false,
          };
      }
    }
    setHorarios(nuevosHorarios);
    setSelectedHorario(radioB);
  };

const cambiarHorarioInferior1 = (e) => {
        diasHorarios[e.target.name].hora_inferior = e.target.value;
      };
    
      const cambiarHorarioSuperior1 = (e) => {
        diasHorarios[e.target.name].hora_superior = e.target.value;
      };

  return (
    <>
      <MDBContainer fluid>
        <MDBRow className="d-flex justify-content-center align-items-center">
          <MDBCol lg="9" className="my-5">
            <MDBRow>
              <MDBCol className="d-flex align-items-center justify-content-center">
                <h1 class="mb-4">Registro de turno</h1>
              </MDBCol>
            </MDBRow>

            <MDBCard>
              <MDBCardBody className="p-5 ">
                <div className="employee-info">
                  <h4 className="mb-3 ">Empleado</h4>
                  <div
                    className="employee-details"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      justifyItems: "start",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <h6 className="mb-0">Nombre:</h6>
                      <p className="mb-0">
                        {empleado.nombre} {empleado.apellido}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <h6 className="mb-0">CI:</h6>
                      <p className="mb-0">{empleado.ci}</p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <h6 className="mb-0">Fecha de inicio de contrato:</h6>
                      <p className="mb-0">
                        {empleado.contracts[0].fecha_inicio}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <h6 className="mb-0">Fecha de fin de contrato:</h6>
                      <p className="mb-0">
                        {empleado.contracts[0].fecha_final === null
                          ? "Indefinido"
                          : empleado.contracts[0].fecha_final}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <h6 className="mb-0">Area:</h6>
                      <p className="mb-0">{empleado.contracts[0].area}</p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <h6 className="mb-0">Cargo:</h6>
                      <p className="mb-0">{empleado.contracts[0].cargo}</p>
                    </div>
                  </div>
                </div>

                <hr className="mx-n3" />
                <MDBRow className="align-items-center pt-4 pb-3">
                  <MDBRow>
                    <MDBCol md="3" className="ps-5">
                      <h6 className="mb-0">HORARIO DE TRABAJO</h6>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBRow className="justify-content-center align-items-center pt-4 pb-4">
                      <MDBCol md="9" className="pe-5">
                        <MDBRadio
                          name="HorariosTrabajo"
                          id="inlineRadio0"
                          value="Personalizado"
                          label="Personalizado"
                          inline
                          checked={selectedHorario === "personalizado"}
                          onChange={() => handleHorarios(0, "personalizado")} //Misma funcion que la anterior.
                        />
                        {/* Horario de Seguridad */}
                        {empleado.contracts[0].area === "Seguridad" && (
                          <>
                            <MDBRadio
                              name="HorariosTrabajo"
                              id="inlineRadio1"
                              value="Diurno"
                              label="Diurno"
                              inline
                              checked={selectedHorario === "diurno"}
                              onChange={() => handleHorarios(1, "diurno")} //Cambiar funcion
                            />
                            <MDBRadio
                              name="HorariosTrabajo"
                              id="inlineRadio2"
                              value="Nocturno"
                              label="Nocturno"
                              inline
                              checked={selectedHorario === "nocturno"}
                              onChange={() => handleHorarios(2, "nocturno")} //Misma funcion que la anterior.
                            />
                          </>
                        )}
                        {/* Horario de Limepieza */}
                        {empleado.contracts[0].area === "Limpieza" && (
                          <>

                            <MDBRadio
                              name="HorariosTrabajo"
                              id="inlineRadio3"
                              value="Mañana"
                              label="Mañana"
                              inline
                              checked={selectedHorario === "maniana"}
                              onChange={() => handleHorarios(3, "maniana")} //Cambiar funcion
                            />
                            <MDBRadio
                              name="HorariosTrabajo"
                              id="inlineRadio4"
                              value="Tarde"
                              label="Tarde"
                              inline
                              checked={selectedHorario === "tarde"}
                              onChange={() => handleHorarios(4, "tarde")} //Misma funcion que la anterior.
                            />
                            <MDBRadio
                              name="HorariosTrabajo"
                              id="inlineRadio5"
                              value="Noche"
                              label="Noche"
                              inline
                              checked={selectedHorario === "noche"}
                              onChange={() => handleHorarios(5, "noche")} //Misma funcion que la anterior.
                            />

                          </>
                        )}
                      </MDBCol>
                    </MDBRow>


                    {dias.map((dia) => {
                      return (
                        <>
                          <MDBRow className="justify-content-center align-items-center mb-2">
                            <MDBCol md="2">
                              <h5>{dia}</h5>
                            </MDBCol>

                            <MDBCol md="3" className="mb-2">
                              <MDBInput
                                type="time"
                                id={"hora1" + dia}
                                value={horarios[dia].hora1}
                                onChange={(e) => cambiarHorarioInferior(e)}
                                disabled={!horarios[dia].checked}
                                onBlur={cambiarHorarioInferior1}
                              />
                                  {errors[dia + "_inferior"] && (
                                  <span className="advertencia-creEve">
                                    {errors[dia + "_inferior"]}
                                  </span>
                                )}
                            </MDBCol>

                            <MDBCol md="3" className="mb-2">
                              <MDBInput
                                type="time"
                                id={"hora2" + dia}
                                value={horarios[dia].hora2}
                                onChange={(e) => cambiarHorarioSuperior(e)}
                                disabled={!horarios[dia].checked}
                                onBlur={cambiarHorarioSuperior1}
                              />
                                  {errors[dia + "_superior"] && (
                                  <span className="advertencia-creEve">
                                    {errors[dia + "_superior"]}
                                  </span>
                                )}
                            </MDBCol>

                            <MDBCol md="1">
                              <input
                                type="checkbox"
                                id={dia}
                                name={dia}
                                checked={horarios[dia].checked}
                                onClick={() => cambiarHorario(dia)}
                              />
                            </MDBCol>
                          </MDBRow>
                        </>
                      );
                    })}
                </MDBRow>

                <hr className="mx-n3" />

                <MDBRow>
                  <MDBCol className="d-flex align-items-center justify-content-center">
                    <Button
                      block
                      className="my-4"
                      size="lg"
                      onClick={handleSubmit}
                      style={{
                        backgroundColor: "#65B8A6",
                        borderColor: "#65B8A6",
                      }}
                    >
                      Contratar
                    </Button>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </>
  );
}

export default TurnRegister;
