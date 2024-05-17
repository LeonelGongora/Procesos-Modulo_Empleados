import React, { useEffect, useState } from "react";

import axios from "axios";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import ModalBeneficios from "./modalBeneficios";

function Beneficios() {
  const [beneficios, setBeneficios] = useState([]);
  const [beneficioEditado, setBeneficioEditado] = useState(null);

  useEffect(() => {
    // Consulta DB
    const beneficiosHard = [
      {
        id: 1,
        name: "Seguro medico",
        cost: "Mixto",
        costEmpr: "300",
        costEmpl: "250",
      },
      {
        id: 2,
        name: "Seguro de accidentes",
        cost: "Empresa",
        costEmpr: "500",
        costEmpl: "S/C",
      },
      {
        id: 3,
        name: "Plan de pensiones",
        cost: "Empleado",
        costEmpr: "S/C",
        costEmpl: "400",
      },
      {
        id: 4,
        name: "Maternidad",
        cost: "Empresa",
        costEmpr: "450",
        costEmpl: "S/C",
      },
      {
        id: 5,
        name: "Guarderia",
        cost: "Mixto",
        costEmpr: "200",
        costEmpl: "200",
      },
    ];
    setBeneficios(beneficiosHard);
  }, []);

  const manejarBuscador = (e) => {
  };

  const manejarFiltroPorTipo = (e) => {
  };

  const addBeneficios = (beneficio) => {
    const beneficioExistente = beneficios.find((b) => b.id === beneficio.id);
    if (beneficioExistente) {
      const beneficiosActualizados = beneficios.map((b) => 
        b.id === beneficio.id ? beneficio : b
      );
      setBeneficios(beneficiosActualizados);
      setBeneficioEditado(null);
    } else {
      const newId = beneficios.length + 1; 
      const newBeneficio = { ...beneficio, id: newId };
      setBeneficios([...beneficios, newBeneficio]);
    }
  };

  const eliminarBeneficio = (id) => {
    const beneficiosFiltrados = beneficios.filter((item) => item.id !== id);
    setBeneficios(beneficiosFiltrados);
  };

  const editarBeneficio = (id) => {
    const beneficio = beneficios.find((b) => b.id === id);

    setBeneficioEditado(beneficio);
  };

  return (
    <>
      <Row className="d-flex align-items-center justify-content-center">
        <Col className="d-flex align-items-center justify-content-center">
          <h2>Beneficios</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="filtrarElementos-admin ">
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
              <select
                id="desplegable-tipo_contrato"
                onChange={manejarFiltroPorTipo}
              > 
                <option value="Todos">Todos</option>
                <option value="Mixto">Mixto</option>
                <option value="Empresa">Empresa</option>
                <option value="Empleado">Empleado</option>
              </select>
            </div>
            <ModalBeneficios 
              onGuardar={(value) => addBeneficios(value)}
              beneficioToEdit={beneficioEditado} 
            />
          </div>
        </Col>
      </Row>

      <Container className="mt-5 mb-5 text-light ">
        <Table hover>
          <thead>
            <tr>
              <th>Beneficios</th>
              <th>Costo</th>
              <th>Costo-Empresa</th>
              <th>Costo-Empleado</th>
              <th>Funciones</th>
            </tr>
          </thead>
          <tbody>
            {beneficios.map((beneficio, index) => {
              return (
                <tr className="empleado" key={index}>
                  <td className="empleado_nombre">{beneficio.name}</td>
                  <td>{beneficio.cost}</td>
                  <td>{beneficio.costEmpr}</td>
                  <td className="tipo_contrato">{beneficio.costEmpl}</td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => eliminarBeneficio(beneficio.id)}
                    >
                      <DeleteIcon />
                    </Button>{" "}
                    <Button
                      variant="info"
                      onClick={() => editarBeneficio(beneficio.id)}
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

export default Beneficios;
