import React, { Component } from "react";
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
import "bootstrap/dist/css/bootstrap.min.css";
/// prueba para subir al segundo repo
const endpoint = "http://localhost:8000/api";

class AgregarEquipo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nombre_equipo: "",
      descripcion_equipo: "",
      costo_equipo: "",
      area_comun_nombre: "",
      areasComunes: [], // Inicializamos como un array vacío
      errors: {},
    };
  }

  componentDidMount() {
    this.obtenerAreasComunes();
  }

  obtenerAreasComunes = async () => {
    try {
      const response = await axios.get(`${endpoint}/obtenerAreasComunes`);
      const commonAreas = response.data[0]; // Extraer el primer elemento del array
      this.setState({ areasComunes: commonAreas });
    } catch (error) {
      console.error("Error al obtener las áreas comunes:", error);
    }
  };

  handleInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!this.state.nombre_equipo.trim()) {
      validationErrors.nombre_equipo = "Este campo es obligatorio";
    }

    if (!this.state.descripcion_equipo.trim()) {
      validationErrors.descripcion_equipo = "Este campo es obligatorio";
    }

    if (!this.state.costo_equipo.trim()) {
      validationErrors.costo_equipo = "Este campo es obligatorio";
    }

    if (!this.state.area_comun_nombre.trim()) {
      validationErrors.area_comun_nombre = "Por favor seleccione un área común";
    }

    this.setState({ errors: validationErrors });

    if (Object.keys(validationErrors).length === 0) {
      const url = `${endpoint}/agregarEquipo`;
      const data = {
        nombre: this.state.nombre_equipo,
        descripcion: this.state.descripcion_equipo,
        costo: this.state.costo_equipo,
        area_comun_nombre: this.state.area_comun_nombre,
      };

      try {
        const response = await axios.post(url, data);
        console.log("Equipo guardado exitosamente:", response.data);
        window.location.href = "./pre-aviso"; // Reemplaza "./otra-pestaña" con la URL a la que deseas redirigir

      } catch (error) {
        console.error("Error al guardar el equipo:", error);
      }
    }
  };

  render() {
    return (
      <Container className="custom-form">
        <Row>
          <Col sm={12}>
            <h2 className="text-center mb-5">Agregar equipo dañado</h2>
            <Form onSubmit={this.handleSubmit}>
              <FormGroup className="mb-4">
                <Label className="label-custom">Nombre del equipo dañado</Label>
                <Input
                  type="text"
                  name="nombre_equipo"
                  placeholder="Ingrese nombre del equipo"
                  onChange={this.handleInput}
                />
                {this.state.errors.nombre_equipo && (
                  <span>{this.state.errors.nombre_equipo}</span>
                )}
              </FormGroup>
              <FormGroup className="mb-4">
                <Label className="label-custom">Descripción del daño</Label>
                <Input
                  type="textarea"
                  name="descripcion_equipo"
                  placeholder="Ingrese descripción"
                  onChange={this.handleInput}
                />
                {this.state.errors.descripcion_equipo && (
                  <span>{this.state.errors.descripcion_equipo}</span>
                )}
              </FormGroup>
              <FormGroup className="mb-4">
                <Label className="label-custom">Costo del arreglo (Bs)</Label>
                <Input
                  type="number"
                  name="costo_equipo"
                  placeholder="Ingrese el costo"
                  onChange={this.handleInput}
                />
                {this.state.errors.costo_equipo && (
                  <span>{this.state.errors.costo_equipo}</span>
                )}
              </FormGroup>
              <FormGroup className="mb-4">
                <Label className="label-custom">Área Común</Label>
                <Input
                  type="select"
                  name="area_comun_nombre"
                  onChange={this.handleInput}
                >
                  <option value="">Seleccione un área común</option>
                  {this.state.areasComunes.map((areaComun, index) => (
                    <option key={index} value={areaComun}>
                      {areaComun}
                    </option>
                  ))}
                </Input>
                {this.state.errors.area_comun_nombre && (
                  <span>{this.state.errors.area_comun_nombre}</span>
                )}
              </FormGroup>
              <Button
                size="lg"
                type="submit"
                className="custom-button mx-auto d-block"
                style={{ fontWeight: "bold" }}
                disabled={!this.state.areasComunes.length} // Deshabilitar el botón si no hay áreas comunes
              >
                Guardar
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default AgregarEquipo;
