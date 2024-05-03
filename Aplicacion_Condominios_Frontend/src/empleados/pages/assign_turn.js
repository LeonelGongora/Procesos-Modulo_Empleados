import React, { useEffect, useState } from 'react';

import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Cookies from 'universal-cookie';
import '../css/contract_register_style.css'
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const cookies = new Cookies();

function AssignTurn() {

  const [empleados, setEmpleados] = useState([]);
  
  useEffect(()=>{
    getEmpleados();
  }, []);

  const getEmpleados = async () => {

    const respuesta = await axios.get(`http://127.0.0.1:8000/api/get_employee_with_contract`);
    setEmpleados(respuesta.data.empleados)
  }

  const eliminarEmpleado = (id) => {
    console.log(id);

    const url = `http://127.0.0.1:8000/api/delete_employee/${id}`; 
      axios.delete(url).then(respuesta => {
        if(respuesta.data.status === 200){
          console.log(respuesta);
          window.location.reload();
        }
    })
  }

  const editarInformacionEmpleado = (id)  => {
    console.log(id)
    cookies.set("id_empleado_seleccionado", id, { path: "/" });
    window.location.href = "./contractRegister";
  }

  const asignarTurnos = (id)  => {
    console.log(id)
    cookies.set("id_empleado_seleccionado", id, { path: "/" });
    window.location.href = "./turnRegister";
  }

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
        integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
        crossOrigin="anonymous"
      />

      <Container className="mt-5 mb-5 text-light ">
        <Table hover>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>CI</th>
              <th>Area</th>
              <th>Turnos</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((empleado) => {
              return (
                <tr>
                  <td>{empleado.nombre}</td>
                  <td>{empleado.apellido}</td>
                  <td>{empleado.ci}</td>
                  <td>{empleado.contracts[0].area}</td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => asignarTurnos(empleado)}
                      style={{
                        backgroundColor: "#65B8A6",
                        borderColor: "#65B8A6",
                      }}
                    >
                      <AddIcon />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Container>
    </>
  );
}

export default AssignTurn;
