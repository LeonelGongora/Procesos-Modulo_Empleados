import React, { Component } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    Input, FormGroup, Label, Col, Row, Button, Container, CardImg
} from "reactstrap";
import Cookies from 'universal-cookie';
import ModalMostrarResidentes from "./ModalMostrarResidentes";
import ModalConfirm from "./ModalConfirm";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import "./customs.css";

const endpoint = "http://localhost:8000/api";
const endpointImg = 'http://localhost:8000';
const cookies = new Cookies();
class CrearContrato extends Component {

    async componentDidMount() {
        const idDep = cookies.get('idDepa');
        this.setState({ departamento_id: idDep });
        console.log(idDep);

        try {
            const response = await axios.post(`${endpoint}/residentes/actualizar-estado-contrato`);
            console.log(response.data);

        } catch (error) {
            console.error('Error al obtener los bloques:', error);
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            fecha_inicio_contrato: "",
            fecha_fin_contrato: "",
            precio_contrato: 0,
            tipo_contrato: "",
            vigente_contrato: 1,
            departamento_id: "",
            errors: [],
            residentesSeleccionados: [],
            mostrarModal: false,
            modalOpen: false,
        };
    };

    toggleModal = () => {
        this.setState((prevState) => ({
            mostrarModal: !prevState.mostrarModal,
        }));
    };
    toggleModalConfirm = () => {
        this.setState(prevState => ({
            modalOpen: !prevState.modalOpen
        }));
    }
    handleConfirm = (e) => {
        console.log('Usuario confirmó la acción');
        this.storeResident(e);
        this.toggleModalConfirm();
    }

    agregarResidente = async (residente) => {
        this.setState((prevState) => ({
            residentesSeleccionados: [...prevState.residentesSeleccionados, residente],
        }));
        try {
            const idRes = residente.id;
            const response = await axios.put(`${endpoint}/residentes/${idRes}/actualizarEst`, {
                estado_residente: 1,
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error al actualizar el atributo:', error);
            // Manejar el error según sea necesario
        }

    };


    handleInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    eliminarListaResidente = async (idResidente) => {
        try {
            const response = await axios.put(`${endpoint}/residentes/${idResidente}/actualizarEst`, {
                estado_residente: 0,
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error al actualizar el atributo:', error);
            // Manejar el error según sea necesario
        }
        const nuevosResidentes = this.state.residentesSeleccionados.filter(residente => residente.id !== idResidente);

        // Actualiza el estado con el nuevo array de residentes
        this.setState({ residentesSeleccionados: nuevosResidentes });
    }

    storeResident = async (e) => {
        e.preventDefault();
        const validationErrors = {};

        if (!this.state.fecha_inicio_contrato) {
            validationErrors.fecha_inicio_contrato = "Este campo es obligatorio";
        } else {
            let d2 = new Date(this.state.fecha_inicio_contrato);
            d2.setDate(d2.getDate() + 1);
            d2.setUTCHours(0, 0, 0, 0);

            let date_Actual1 = new Date();
            date_Actual1.setDate(date_Actual1.getDate() + 1);
            date_Actual1.setUTCHours(0, 0, 0, 0);

            let fecha1 = d2.getTime();
            let fecha2 = date_Actual1.getTime();
            if (fecha1 < fecha2) {
                validationErrors.fecha_inicio_contrato = "Esta fecha no es válida";
            }
        }

        if (!this.state.fecha_fin_contrato) {
            validationErrors.fecha_fin_contrato = "Este campo es obligatorio";
        } else {
            let d2 = new Date(this.state.fecha_fin_contrato);
            d2.setDate(d2.getDate() + 1);
            d2.setUTCHours(0, 0, 0, 0);

            let date_Actual1 = new Date();
            date_Actual1.setDate(date_Actual1.getDate() + 1);
            date_Actual1.setUTCHours(0, 0, 0, 0);

            let fecha1 = d2.getTime();
            let fecha2 = date_Actual1.getTime();
            if (fecha1 < fecha2) {
                validationErrors.fecha_fin_contrato = "Esta fecha no es válida";
            }
        }
        if (!this.state.precio_contrato) {
            validationErrors.precio_contrato = "Este campo es obligatorio";
        } else {
            if (!/^(?!-)(?:[1-9]\d{2,5})$/.test(this.state.precio_contrato)) {
                validationErrors.precio_contrato =
                    "Ingrese un precio válido";
            }
        }
        if (!this.state.tipo_contrato) {
            validationErrors.tipo_contrato = "Debe seleccionar tipo de contrato";
        }

        if (this.state.residentesSeleccionados.length === 0) {
            validationErrors.residentesSeleccionados = "Debe seleccionar al menos un residente";
        }
        console.log(validationErrors);

        this.setState({ errors: validationErrors });

        if (Object.keys(validationErrors).length === 0) {
            const idDep = cookies.get('idDepa');
            const url = `${endpoint}/contrato`;
            const data = new FormData();
            console.log("se guarda el id?", idDep);

            data.append("fecha_inicio_contrato", this.state.fecha_inicio_contrato);
            data.append("fecha_fin_contrato", this.state.fecha_fin_contrato);
            data.append("precio_contrato", this.state.precio_contrato);
            data.append("tipo_contrato", this.state.tipo_contrato);
            data.append("vigente_contrato", this.state.vigente_contrato ? '1' : '0');
            data.append("departamento_id", this.state.departamento_id);

            console.log(this.state.fecha_inicio_contrato);
            console.log(this.state.fecha_fin_contrato);
            console.log(this.state.precio_contrato);
            console.log(this.state.tipo_contrato);
            console.log(this.state.vigente_contrato);
            console.log(this.state.departamento_id);

            axios.post(url, data).then((res) => {
                console.log(res);

            });
            await axios.put(`${endpoint}/departamentos/${idDep}/actualizarDisp`, {
                disponibilidad: 0,
            });
            cookies.remove('idDepa');
            window.location.href = "./depa";
        }
    };

    render() {
        const { residentesSeleccionados } = this.state;
        return (
            <>
                <ModalConfirm
                    isOpen={this.state.modalOpen}
                    toggle={this.toggleModalConfirm}
                    confirm={this.handleConfirm}
                    message="¿Está seguro de que deseas registrar el contrato?"
                />
                <Container className="custom-form">
                    <Row>
                        <Col sm={12}>
                            <h2 className="text-center mb-5">Crear contrato</h2>
                            <form onSubmit={this.storeResident}>
                                <FormGroup className="mb-4">
                                    <Row>
                                        <Col sm={6}>
                                            <Label
                                                className="label-custom"
                                            >
                                                Fecha de inicio del contrato
                                            </Label>
                                            <Input
                                                id="inputRegistro"
                                                type="date"
                                                name="fecha_inicio_contrato"
                                                onChange={this.handleInput}
                                            />
                                            {this.state.errors.fecha_inicio_contrato && (
                                                <span>{this.state.errors.fecha_inicio_contrato}</span>
                                            )}
                                        </Col>
                                        <Col sm={6}>
                                            <Label
                                                className="label-custom"
                                            >
                                                Fecha de fin del contrato
                                            </Label>
                                            <Input
                                                id="inputRegistro"
                                                type="date"
                                                name="fecha_fin_contrato"
                                                onChange={this.handleInput}
                                            />
                                            {this.state.errors.fecha_fin_contrato && (
                                                <span>{this.state.errors.fecha_fin_contrato}</span>
                                            )}
                                        </Col>
                                    </Row>

                                </FormGroup >

                                <FormGroup className="mb-4">
                                    <Row>
                                        <Col sm={6}>
                                            <Label
                                                className="label-custom"
                                            >
                                                Precio
                                            </Label>
                                            <Input
                                                id="inputRegistro"
                                                type="text"
                                                name="precio_contrato"
                                                placeholder="Ingrese el monto del contrato"
                                                onChange={this.handleInput}
                                            />
                                            {this.state.errors.precio_contrato && (
                                                <span>{this.state.errors.precio_contrato}</span>
                                            )}
                                        </Col>
                                        <Col sm={6}>

                                            <Label
                                                className="label-custom"
                                            >
                                                Tipo de contrato
                                            </Label>
                                            <Input
                                                type="select"
                                                name="tipo_contrato"
                                                id="tipo_contrato"
                                                onChange={this.handleInput}
                                            >
                                                <option disabled selected>{" "} Seleccione un tipo de contrato</option>
                                                <option value="Venta">Venta</option>
                                                <option value="Alquiler">Alquiler</option>
                                                <option value="Anticretico">Anticretico</option>

                                            </Input>
                                            {this.state.errors.tipo_contrato && (
                                                <span>{this.state.errors.tipo_contrato}</span>
                                            )}

                                        </Col>
                                    </Row>
                                </FormGroup>

                                <Label className="label-custom">Residentes</Label>
                                <ul>
                                    {residentesSeleccionados.map((residente, index) => (

                                        <Row className="d-flex align-items-center customCard">

                                            <Col sm={3} >
                                                <CardImg
                                                    top
                                                    style={{ maxWidth: '128px', maxHeight: '128px', margin: '10px' }}
                                                    src={`${endpointImg}/${residente.imagen_residente}`}
                                                    alt={residente.nombre_residente}
                                                />
                                            </Col>
                                            <Col sm={3} >
                                                <li style={{ fontWeight: 'bold'}} key={index}>{residente.nombre_residente} {residente.apellidos_residente}
                                                </li>
                                            </Col>
                                            <Col sm={3}>
                                                <Input
                                                    type="select"
                                                    name="tipo_residente"
                                                    id="tipo_residente"
                                                    onChange={this.handleInput}
                                                >
                                                    <option value="Residente">Residente</option>
                                                    <option value="Propietario">Propietario</option>

                                                </Input>
                                            </Col>
                                            <Col sm={3}>
                                                <Button className="botoncardContr" type="button" onClick={() => this.eliminarListaResidente(residente.id)} >
                                                    <FontAwesomeIcon icon={faTrashAlt} className="iconContr" />
                                                </Button>
                                            </Col>
                                        </Row>


                                    ))}
                                </ul>
                                {this.state.errors.residentesSeleccionados && (
                                    <span>{this.state.errors.residentesSeleccionados}</span>
                                )}

                                <Button size="lg" type="button" className="custom-button mx-auto d-block mb-4 mt-4"
                                    style={{ fontWeight: 'bold' }} onClick={this.toggleModal}
                                >
                                    +
                                </Button>

                                {this.state.mostrarModal && (

                                    <ModalMostrarResidentes
                                        isOpen={this.state.mostrarModal}
                                        toggle={this.toggleModal}
                                        agregarResidente={this.agregarResidente}
                                    />
                                )}

                                <Button size="lg" type="button" className="custom-button mx-auto d-block mb-4 mt-4 bottom-button"
                                    style={{ fontWeight: 'bold' }}
                                    onClick={this.toggleModalConfirm}
                                >
                                    Registrar
                                </Button>
                            </form>
                        </Col>
                    </Row>
                </Container>

            </>
        );
    }
}
export default CrearContrato;
