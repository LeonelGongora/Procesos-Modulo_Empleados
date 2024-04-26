import React, { useEffect, useState } from 'react';

import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Cookies from 'universal-cookie';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { MDBInputGroup, MDBInput, MDBIcon, MDBBtn } from 'mdb-react-ui-kit';
import SearchIcon from '@mui/icons-material/Search';
import '../css/homePageEmpleados_style.css'

const cookies = new Cookies();

function EmployeHomePage() {

  const [empleados, setEmpleados] = useState([]);
  
  useEffect(()=>{
    getEmpleados();
  }, []);

  const getEmpleados = async () => {

    const respuesta = await axios.get(`http://127.0.0.1:8000/api/get_all_employees`);
    console.log(respuesta)
    setEmpleados(respuesta.data.empleados)
    console.log(empleados)
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

  const manejarBuscador = (e) => {
    let tipo_contrato_seleccionado_valor = document.querySelector("#desplegable-tipo_contrato").value;

    if(tipo_contrato_seleccionado_valor === "Todos"){
      document.querySelectorAll(".empleado").forEach(empleado =>{
        empleado.querySelector(".empleado_nombre").textContent.toLowerCase().includes(e.target.value.toLowerCase())
          ?empleado.classList.remove("filtro")
          :empleado.classList.add("filtro")
      })
    }else{
      document.querySelectorAll(".empleado").forEach(empleado =>{
        empleado.querySelector(".empleado_nombre").textContent.toLowerCase().includes(e.target.value.toLowerCase())
        && empleado.querySelector(".tipo_contrato").textContent.toLowerCase().includes(tipo_contrato_seleccionado_valor.toLowerCase())
          ?empleado.classList.remove("filtro")
          :empleado.classList.add("filtro")
      })
    }
  }

  const manejar_Filtro_Por_Tipo = (e) => {
    let nombre_seleccionado_valor = document.querySelector("#buscador-admin").value;

    if (nombre_seleccionado_valor === "") {
      if (e.target.value === "Todos") {
        document.querySelectorAll(".empleado").forEach((empleado) => {
          empleado.classList.remove("filtro");
        });
      } else {
        document.querySelectorAll(".empleado").forEach((empleado) => {
          empleado
            .querySelector(".tipo_contrato")
            .textContent.toLowerCase()
            .includes(e.target.value.toLowerCase())
            ? empleado.classList.remove("filtro")
            : empleado.classList.add("filtro");
        });
      }
    } else {
      if (e.target.value === "Todos") {
        document.querySelectorAll(".empleado").forEach((empleado) => {
          if (
            empleado
              .querySelector(".empleado_nombre")
              .textContent.toLowerCase()
              .includes(nombre_seleccionado_valor.toLowerCase())
          ) {
            empleado.classList.remove("filtro");
          } else {
            empleado.classList.add("filtro");
          }
        });
      } else {
        document.querySelectorAll(".empleado").forEach((empleado) => {
          if (
            empleado
              .querySelector(".empleado_nombre")
              .textContent.toLowerCase()
              .includes(nombre_seleccionado_valor.toLowerCase()) &&
              empleado
              .querySelector(".tipo_contrato")
              .textContent.toLowerCase()
              .includes(e.target.value.toLowerCase())
          ) {
            empleado.classList.remove("filtro");
          } else {
            empleado.classList.add("filtro");
          }
        });
      }
    }

  }

  const editarInformacionEmpleado = (id)  => {
    console.log(id)
    cookies.set("id_empleado_seleccionado", id, { path: "/" });
    window.location.href = "./employeeEdit";
  }

  return (
    <>
      <div className="filtrarElementos-admin">
        <div className="entradaBuscador-admin">
          <input
            type="text"
            name="buscador"
            id="buscador-admin"
            placeholder="Buscar por nombre..."
            onChange={manejarBuscador}
          />
        </div>
        <div className="capsulaDesplegable-admin">
          <select id="desplegable-tipo_contrato" onChange={manejar_Filtro_Por_Tipo}>
            <option>Todos</option>
            <option>Sin contrato</option>
            <option>Contratado</option>
          </select>
        </div>
      </div>

      <Container className="mt-5 mb-5 text-light ">
        <Table hover>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Correo</th>
              <th>Estado de Contrato</th>
              <th>Funciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((empleado) => {
              return (
                <tr className="empleado">
                  <td className="empleado_nombre">{empleado.nombre}</td>
                  <td>{empleado.apellido}</td>
                  <td>{empleado.correo}</td>
                  <td className="tipo_contrato">{empleado.estado_contrato}</td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => eliminarEmpleado(empleado.id)}
                    >
                      <DeleteIcon />
                    </Button>{" "}
                    {}
                    <Button
                      variant="info"
                      onClick={() => editarInformacionEmpleado(empleado.id)}
                      style={{
                        backgroundColor: "#65B8A6",
                        borderColor: "#65B8A6",
                      }}
                    >
                      <ModeEditIcon />
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

export default EmployeHomePage;
