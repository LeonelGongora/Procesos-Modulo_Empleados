import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
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

    const cambiarHorario = (dia) => {
        let checkBox = document.getElementById(dia);
    
        let hora1 = document.getElementById("hora1"+dia);
        let hora2 = document.getElementById("hora2"+dia);
    
        if (checkBox.checked == true) {
          hora1.disabled = false;
          
          hora2.disabled = false;
    
        } else {
          hora1.disabled = true;
          hora1.value = '';
    
          hora2.disabled = true;
          hora2.value = '';
        }
      };
    
      const cambiarHorarioInferior = (e) => {
        diasHorarios[e.target.name].hora_inferior = e.target.value;
      };
    
      const cambiarHorarioSuperior = (e) => {
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
                <MDBCardBody className="px-4">
                  <MDBRow className="align-items-center pt-4 pb-3">
                    <MDBCol md="3" className="ps-5">
                      <h6 className="mb-0">Empleado</h6>
                    </MDBCol>

                    <MDBCol md="9" className="pe-5">
                      <MDBInput
                        id="form2"
                        type="email"
                        value={empleado.nombre + " " + empleado.apellido}
                      />
                    </MDBCol>
                  </MDBRow>

                  <hr className="mx-n3" />

                  <MDBRow className="align-items-center pt-4 pb-3">
                    <MDBRow>
                      <MDBCol md="3" className="ps-5">
                        <h6 className="mb-0">Turnos</h6>
                      </MDBCol>
                    </MDBRow>

                    <MDBRow>
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
                                  name={dia}
                                  onChange={cambiarHorarioInferior}
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
                                  name={dia}
                                  onChange={cambiarHorarioSuperior}
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
                                  name="vehicle1"
                                  value="Bike"
                                  onClick={() => cambiarHorario(dia)}
                                />
                              </MDBCol>
                            </MDBRow>
                          </>
                        );
                      })}
                    </MDBRow>
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