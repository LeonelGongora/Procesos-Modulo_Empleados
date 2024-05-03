import React, { useEffect, useState } from "react";
import axios from "axios";
import './DepartamentosCss.css';

import { Link } from "react-router-dom";
import Cookies from 'universal-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, CardImg, CardBody, CardTitle , Button } from 'reactstrap';
import ModalConfirm from "./ModalConfirm";
import ModalDisponible from "./PopUPSelectOferta";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleRight, faPenToSquare , faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const endpoint = 'http://localhost:8000/api';
const endpointImg = 'http://localhost:8000';
const cookies = new Cookies();
const MostrarDep = () => {
    const [departamentos, setDepartamentos] = useState ([]);
    const [switchStates, setSwitchStates] = useState({});
    const [isOpenModal1, setIsOpenModal1] = useState(false);
    const [isOpenModal2, setIsOpenModal2] = useState(false);
    const [estadoIdDepa, setEstadoIdDepa] = useState('');


    useEffect(() => {
        getAllDepartments();
        cookies.remove('idDepa');
    }, []);

    /* const getAllDepartments = async () => {
        const response = await axios.get(`${endpoint}/departamentos`);
        setDepartamentos(response.data);
        const initialSwitchStates = {};
        response.data.forEach(departamento => {
            initialSwitchStates[departamento.id]  = departamento.disponibilidad;
        });
        setSwitchStates(initialSwitchStates);
    } */

    const getAllDepartments = async () => {
        try {
            const response = await axios.get(`${endpoint}/departamentos`);
            const departamentos = response.data;
            setDepartamentos(departamentos);
            const initialSwitchStates = {};
            // Iterar sobre cada departamento
            for (const departamento of departamentos) {
                initialSwitchStates[departamento.id] = departamento.disponibilidad;
    
                // Obtener los contratos asociados a este departamento
                const contratosResponse = await axios.get(`${endpoint}/contratoDepS/${departamento.id}`);
                // Guardar los contratos asociados a este departamento
                departamento.contratos = contratosResponse.data.contratos;

                const tieneContratos = departamento.contratos && departamento.contratos.length > 0;
                const tieneVenta = tieneContratos && departamento.contratos.some(contrato => contrato.tipo_contrato === "Venta");
                const tieneOtro = tieneContratos && departamento.contratos.some(contrato => contrato.tipo_contrato === "Alquiler" || contrato.tipo_contrato === "Anticretico" );
                const obtenerPropietarioyOTitular = async (contrato) => {
                    try {
                        let inquilinoResponse= null;
                        let tienePropietario = false;
                        console.log(departamento.id,'tieneVenta',tieneVenta);
                        if(tieneVenta){
                            inquilinoResponse = await axios.get(`${endpoint}/propietario-by-contratoS/${contrato.id}`);
                            tienePropietario = inquilinoResponse !== null;
                            // console.log('tienePropietario',tienePropietario);
                            //console.log('Propietario:', inquilinoResponse.data.residente);
                        }
                        let titularResponse=null;
                        if(tieneOtro){
                            titularResponse = await axios.get(`${endpoint}/titular-by-contratoS/${contrato.id}`);
                        }
                        const tieneTitular = titularResponse !== null;
                        //console.log('tieneTitular',tieneTitular);
                        console.log(departamento.id,'tieneAntAlq',tieneOtro);
                        //console.log('Titular:', titularResponse.data.residente);
                        if (tienePropietario) {
                            contrato.residente = inquilinoResponse.data.residente;
                        } else {
                            contrato.residente = null;
                        } 
                        if (tieneTitular) {
                            contrato.titular = titularResponse.data.residente;
                        } else {
                            contrato.titular = null;
                        }
                    } catch (error) {
                        if (error.response && error.response.status === 404) {
                            // Manejar el caso en el que el propietario no existe (por ejemplo, asignar null)
                            contrato.residente = null;
                        } else {
                            // Manejar otros errores de manera adecuada
                            console.error("Error al obtener el propietario o titular:", error);
                            // Puedes lanzar nuevamente el error para que sea manejado por la función que llama a esta función
                            throw error;
                        }
                    }
                };
                for (const contrato of departamento.contratos) {
                    await obtenerPropietarioyOTitular(contrato);
                    console.log(departamento.id,'Contrato:', contrato);
                }
                
                //initialSwitchStates[departamento.id] = tieneVenta;
            }
            // Guardar el estado de los interruptores y la lista de departamentos actualizada
            setSwitchStates(initialSwitchStates);
            setDepartamentos(departamentos);
        } catch (error) {
            console.error("Error al obtener departamentos:", error);
        }
    }
    
    const deleteDepartment = async (id) => {
        await axios.delete(`${endpoint}/departamento/${id}`);
        getAllDepartments();
    }

    const handleClickEditar = (idDepa) => {
        cookies.set('idDepa', idDepa);
        window.location.href = '/dashboard/editarDepa'; 
      };

    const handleClickInfo = (idDepa) => {
        cookies.set('idDepa', idDepa);
        window.location.href = '/dashboard/infoDepartamento';
    };
    
    const handleBotonSwitch = (idDepa) => {
        setEstadoIdDepa(idDepa);
        setIsOpenModal1(true);
    }

    const handleConfirm = (idDepa) => {
        setSwitchStates(prevState => ({
            ...prevState,
            [idDepa]: !prevState[idDepa]
        }));

        if (!switchStates[idDepa]) {
            setIsOpenModal2(true);
            
        } else {
            cookies.set('idDepa', idDepa);
            window.location.href = '/dashboard/crearContrato';
        }
        setIsOpenModal1(false);
    }

    return(
        
        <div className="Deps">
            <ModalConfirm
                isOpen={isOpenModal1}
                toggle={() => setIsOpenModal1(false)}
                confirm={() => handleConfirm(estadoIdDepa)}
                message="¿Está seguro de que deseas cambiar el estado de este departamento?"
            />
            {isOpenModal2 && (
                <ModalDisponible
                isOpen={isOpenModal2}
                toggle={() => setIsOpenModal2(false)}
                //confirm={() => handleConfirm()}
                idDep={estadoIdDepa}
            />
            )

            }
            
            <h1 className="title">Departamentos</h1>
            <div className= "lista">
                {departamentos.map((departamento) => (
                    <Card className="cardDepa" key={departamento.id} onClick={() => handleClickInfo(departamento.id)}>
                        <CardImg
                            alt="Card image cap"
                            src={`${endpointImg}/${departamento.imagen_departamento}`}
                            top
                            width="100%"
                            height={225}
                            style={{ objectFit: "fill" }}
                        />
                        <CardBody className="d-flex flex-column justify-content-between">
                            <CardTitle tag="h5">{departamento.nombre_departamento}</CardTitle>
                            {departamento.contratos && departamento.contratos.length > 0 && (
                                <div>
                                    {departamento.contratos.map(contrato => (
                                        <div key={contrato.id}>
                                            {contrato.tipo_contrato === "Venta" && contrato.residente && (
                                                //console.log("Propietario: ", contrato.residente.nombre_residente);
                                               <p>Propietario: {contrato.residente.nombre_residente} {contrato.residente.apellidos_residente}</p>
                                            )}
                                            {contrato.tipo_contrato !== "Venta" && contrato.titular && (
                                                <p>Titular: {contrato.titular.nombre_residente} {contrato.titular.apellidos_residente}</p>
                                            )}
                                        </div>

                                    ))}
                                </div>
                                
                            )}
                            <div id="datosCard">
                            {departamento.disponibilidad ? (
                                <>
                                    <span>Modalidad de oferta: </span>
                                    {departamento.ofertado_venta ? <span>Venta </span> : null}
                                    {departamento.ofertado_alquiler ? <span>Alquiler </span> : null}
                                    {departamento.ofertado_anticretico ? <span>Anticretico </span> : null}
                                </>
                            ) : null}
                            </div>
                            <div className="botones">
                            <Button className="botoncard" onClick={(e) => { e.stopPropagation(); deleteDepartment(departamento.id); }}><FontAwesomeIcon icon={faTrashAlt} className="iconos"/></Button>
                            <Button className="botoncard" onClick={(e) => { e.stopPropagation(); handleClickEditar(departamento.id); }} ><FontAwesomeIcon icon={faPenToSquare} className="iconos"/></Button>
                            <Button className="botoncard" onClick={(e) => { e.stopPropagation(); handleClickInfo(departamento.id); }} ><FontAwesomeIcon icon={faArrowCircleRight} className="iconos"/></Button>
                                
                                <label className="switch" onClick={(e) => e.stopPropagation()}>
                                <input
                                    type="checkbox"
                                    checked={switchStates[departamento.id]}
                                    onChange={() => {
                                    if (departamento.contratos && !departamento.contratos.some(contrato => contrato.tipo_contrato === "Alquiler" || contrato.tipo_contrato === "Anticretico")) {
                                        handleBotonSwitch(departamento.id);
                                    }
                                    }}
                                    disabled={!departamento.contratos || departamento.contratos.some(contrato => contrato.tipo_contrato === "Alquiler" || contrato.tipo_contrato === "Anticretico")}
                                />
                                <span className="slider"></span>
                                </label>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default MostrarDep;
