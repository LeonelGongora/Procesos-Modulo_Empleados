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
import Form from 'react-bootstrap/Form';

import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
function TurnRegister() {

    const empleado = cookies.get('id_empleado_seleccionado');

    const [errors, setErrors] = useState({});

    useEffect(()=>{
        diasHorarios["Lunes"] = {
            hora_inferior: "",
            hora_superior: "",
          };
      
          diasHorarios["Martes"] = {
            hora_inferior: "",
            hora_superior: "",
          };
      
          diasHorarios["Miercoles"] = {
            hora_inferior: "",
            hora_superior: "",
          };
      
          diasHorarios["Jueves"] = {
            hora_inferior: "",
            hora_superior: "",
          };
      
          diasHorarios["Viernes"] = {
            hora_inferior: "",
            hora_superior: "",
          };
      
          diasHorarios["Sabado"] = {
            hora_inferior: "",
            hora_superior: "",
          };
      
          diasHorarios["Domingo"] = {
            hora_inferior: "",
            hora_superior: "",
          };

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

      let diasHorarios = {};
    
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

        if(!values.fecha_inicio.trim()){
            validationErrors.fecha_inicio = "Este campo es obligatorio"
        }

        if(!values.fecha_final.trim() && values.tipo_contrato === "Temporal"){
            validationErrors.fecha_final = "Este campo es obligatorio"
        }

        if(!values.area.trim()){
            validationErrors.area = "Seleccione una area"
        }

        if(!values.cargo.trim()){
            validationErrors.cargo = "Seleccione un cargo"
        }

        if(!values.salario.trim()){
            validationErrors.salario = "Este campo es obligatorio"
        }else if (!(Number(values.salario) > 2123)) {
            validationErrors.salario = "El salario debe ser un numero entero igual o mayor a 2124 (Minimo Nacional)";
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
                              </MDBCol>

                              <MDBCol md="3" className="mb-2">
                                <MDBInput
                                  type="time"
                                  id={"hora2" + dia}
                                  name={dia}
                                  onChange={cambiarHorarioSuperior}
                                />
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