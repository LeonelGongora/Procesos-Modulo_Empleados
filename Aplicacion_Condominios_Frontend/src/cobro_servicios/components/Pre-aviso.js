import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const endpoint = "http://localhost:8000/api";

const PreAviso = () => {
  const { departamento_id } = useParams();
  const [fecha, setFecha] = useState("");
  const [descripcion_servicios, setdescripcion_servicios] = useState("");
  const [monto, setMonto] = useState("");
  const [errors, setErrors] = useState({});
  const [tipoServicio, setTipoServicio] = useState("");
  const [tiposServicio, setTiposServicio] = useState([]);
  const [propietarios, setPropietarios] = useState([]);
  const [propietarioSeleccionado, setPropietarioSeleccionado] = useState("");
  const [servicioPagar, setServicioPagar] = useState("");

  useEffect(() => {
    console.log("ID del departamento:", departamento_id);
  }, [departamento_id]);

  useEffect(() => {
    const fetchTiposServicio = async () => {
      try {
        const response = await axios.get(`${endpoint}/CategoriaServicio`);
        const nombresServicio = response.data.map((item) => item.catnombre);
        setTiposServicio(nombresServicio);
      } catch (error) {
        console.error("Error al obtener los tipos de servicio:", error);
      }
    };

    fetchTiposServicio();
  }, []);

  useEffect(() => {
    const fetchPropietarios = async () => {
      try {
        const response = await axios.get(`${endpoint}/residentes`);
        const contratoDepResponse = await axios.get(`${endpoint}/contratoDep/${departamento_id}`);
        const contratoDepId = contratoDepResponse.data.contratos[0].id;
        console.log("id del contrato encontrado " + contratoDepId);
        const propietariosByContratoResponse = await axios.get(`${endpoint}/propietario-by-contrato/${contratoDepId}`);
  
        if (propietariosByContratoResponse.data.message !== "No tiene propietario") {
          // Si hay propietario, mostrar solo ese propietario
          const nombrePropietario = propietariosByContratoResponse.data.residente.nombre_residente;
          console.log(nombrePropietario);
          setPropietarios([nombrePropietario]);
        } else {
          // Si no hay propietario, obtener los residentes por la otra ruta
          const residentesByContratoResponse = await axios.get(`${endpoint}/residentes-by-contrato/${contratoDepId}`);
          console.log(residentesByContratoResponse);
          const nombresResidentes = residentesByContratoResponse.data.map(residente => residente.nombre_residente);
          setPropietarios(nombresResidentes);
        }
      } catch (error) {
        console.error("Error al obtener la lista de propietarios:", error);
      }
    };
  
    fetchPropietarios();
  }, []);
  
  
  
  
  const handleInput = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "fecha":
        setFecha(value);
        break;
      case "descripcion_servicios":
        setdescripcion_servicios(value);
        break;
      case "monto":
        setMonto(value);
        break;
        case "tipo_servicio": // Cambiado de "tipoServicio" a "tipo_servicio"
        setServicioPagar(value);
       // console.log("el servicio seleccionado es: "+value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    console.log("empiezo a enviar");
    e.preventDefault();
    const validationErrors = {};

    if (!fecha.trim()) {
      validationErrors.fecha = "Este campo es obligatorio";
      console.log("Error de fecha");
    }
    
    if (!descripcion_servicios.trim()) {
      validationErrors.descripcion_servicios = "Este campo es obligatorio";
      console.log("Error de descripción de servicios");
    }
    
    if (!monto.trim()) {
      validationErrors.monto = "Este campo es obligatorio";
      console.log("Error de monto");
    }
    
    if (!servicioPagar.trim()) {
      validationErrors.tipo_servicio = "Seleccione un servicio a pagar";
      console.log(servicioPagar);
      console.log("Error de tipo de servicio");
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const url = `${endpoint}/generar-preaviso`;
      const data = {
        departamento_id,
        fecha,
        propietario_pagar: propietarioSeleccionado,
        descripcion_servicios,
        monto,
        servicio_pagar: servicioPagar,
      };

      try {
        console.log(data);
        const response = await axios.post(url, data);
        console.log("Preaviso guardado exitosamente:", response.data);
        window.location.href = "/cobros/pre-aviso";
      } catch (error) {
        console.error("Error al guardar el preaviso:", error);
        console.log(data);
      }
      console.log("no envie nada");
    }
  };

  return (
    <Container className="custom-form">
      <Row>
        <Col sm={12}>
          <h2 className="text-center mb-5">Crear Preaviso de expensa</h2>
          <h3 className="text-center mb-5">Departamento:{departamento_id}</h3>
          <Form onSubmit={handleSubmit}>
            {/* Agrega un nuevo campo desplegable para seleccionar el propietario */}
            <FormGroup className="mb-4">
              <Label className="label-custom">Propietario</Label>
              <Input
                type="select"
                name="propietario"
                onChange={(e) => setPropietarioSeleccionado(e.target.value)}
                value={propietarioSeleccionado}
              >
                <option value="">Seleccionar propietario</option>
                {propietarios.map((propietario) => (
                  <option key={propietario} value={propietario}>
                    {propietario}
                  </option>
                ))}
              </Input>
            </FormGroup>

            <FormGroup className="mb-4">
              <Label className="label-custom">Fecha de envio</Label>
              <Input
                type="date"
                name="fecha"
                onChange={handleInput}
                value={fecha}
              />
              {errors.fecha && <span>{errors.fecha}</span>}
            </FormGroup>

            <FormGroup className="mb-4">
              <Label className="label-custom">
                Descripcion de los servicios
              </Label>
              <Input
                type="text"
                name="descripcion_servicios"
                placeholder="Ingrese la descripcion de los servicios"
                onChange={handleInput}
                value={descripcion_servicios}
              />
              {errors.descripcion_servicios && (
                <span>{errors.descripcion_servicios}</span>
              )}
            </FormGroup>

            <FormGroup className="mb-4">
              <Label className="label-custom">Servicio a pagar</Label>
              <Input
                type="select"
                name="tipo_servicio"
                onChange={(e) => setServicioPagar(e.target.value)}
                value={servicioPagar}
              >
                <option value="">Seleccionar servicio</option>
                {tiposServicio.map((tipo, index) => (
                  <option key={index} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </Input>
            </FormGroup>

            <FormGroup className="mb-4">
              <Label className="label-custom">Monto</Label>
              <Input
                type="number"
                name="monto"
                placeholder="Ingrese el monto"
                onChange={handleInput}
                value={monto}
              />
              {errors.monto && <span>{errors.monto}</span>}
            </FormGroup>
            <Button
              size="lg"
              type="submit"
              className="custom-button mx-auto d-block"
              style={{ fontWeight: "bold" }}
              onClick={handleSubmit}
            >
              Guardar Preaviso
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default PreAviso;
