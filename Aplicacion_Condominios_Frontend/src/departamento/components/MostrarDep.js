import React, { useEffect, useState } from "react";
import axios from "axios";
import './DepartamentosCss.css';

import { Link } from "react-router-dom";
import Cookies from 'universal-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, CardImg, CardBody, CardTitle , Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare , faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const endpoint = 'http://localhost:8000/api';
const endpointImg = 'http://localhost:8000';
const cookies = new Cookies();
const MostrarDep = () => {
    const [departamentos, setDepartamentos] = useState ([]);
    const [switchStates, setSwitchStates] = useState({});

    useEffect(() => {
        getAllDepartments();
    }, []);

    const getAllDepartments = async () => {
        const response = await axios.get(`${endpoint}/departamentos`);
        setDepartamentos(response.data);
        const initialSwitchStates = {};
        response.data.forEach(departamento => {
            initialSwitchStates[departamento.id] = false;
        });
        setSwitchStates(initialSwitchStates);
    }

    const deleteDepartment = async (id) => {
        await axios.delete(`${endpoint}/departamento/${id}`);
        getAllDepartments();
    }

    const handleClickEditar = (idDepa) => {
        cookies.set('idDepa', idDepa); // Guarda el ID del departamento en una cookie llamada 'idDepa'
        // Lógica para redirigir a la página de edición
        window.location.href = '/dashboard/editarDepa'; // Redirige a la página de edición
      };
    
    const handleBotonSwitch = (idDepa) => {
        setSwitchStates(prevState => ({
            ...prevState,
            [idDepa]: !prevState[idDepa]
        }));

        if (!switchStates[idDepa]) {
            cookies.set('idDepa', idDepa);
            window.location.href = '/dashboard/crearContrato';
        } else {
            // Libre
        }
    }

    return(
        <div className="Deps">
            <h1 className="title">Departamentos</h1>
        
            <div className= "lista">
                {departamentos.map((departamento) => (
                    <Card className='cardDepa' key={departamento.id}>
                        <CardImg
                            alt="Card image cap"
                            src={`${endpointImg}/${departamento.imagen_departamento}`}
                            top
                            width="100%"
                        />
                        <CardBody>
                            <CardTitle tag="h5">{departamento.nombre_departamento}</CardTitle>
                            <div className="botones">
                                <Button className="botoncard" onClick={() => deleteDepartment(departamento.id)}><FontAwesomeIcon icon={faTrashAlt} className="iconos"/></Button>
                                <Button className="botoncard" onClick={() => handleClickEditar(departamento.id)} ><FontAwesomeIcon icon={faPenToSquare} className="iconos"/></Button>
                                <label className="switch">
                                    <input type="checkbox" checked={switchStates[departamento.id]} onChange={() => { setSwitchStates(!switchStates); handleBotonSwitch(departamento.id); }} />
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
