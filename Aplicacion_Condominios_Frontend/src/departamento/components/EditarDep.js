import React, { Component } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    Input, FormGroup, Label, Col, Row, Button, Container
} from "reactstrap";
import "./customs.css";
import Cookies from 'universal-cookie';
import ModalConfirm from "./ModalConfirm";
import { Form } from "react-router-dom";

const endpoint = "http://localhost:8000/api";
const endpointImg = "http://localhost:8000";
const cookies = new Cookies();
class EditarDep extends Component {
    departamentos = [];
    pisosAr = [];


    async componentDidMount() {
        try {
            const url = `${endpoint}/bloques`;
            const response = await axios.get(url);
            this.setState({ bloques: response.data });
            console.log('bloques:', response);
            const idDep = cookies.get('idDepa'); //no se esta obteniendo el id de departamento de la 
            //ruta, por lo que no se puede obtener los datos del departamento
            console.log('idDep:', idDep);
            this.obtenerDatosDepartamento(idDep);

        } catch (error) {
            console.error('Error al obtener los bloques:', error);
        }
    }


    constructor(props) {
        super(props);
        this.state = {
            nombre_departamento: "",
            numero_habitaciones: 0,
            numero_personas: 0,
            superficie: 0,
            disponibilidad: true,
            amoblado: false,
            descripcion_departamento: "",
            errors: {},
            bloques: [],
            bloqueSeleccionado: '',
            edificioSeleccionado: '',
            edificios: [],
            numeroPisos: 0,
            pisoSeleccionado: '',
            imagenDep: "",
            nuevaImagen: "",
            modalOpen: false,
            nuevaImagenMostrar:"",
        };
    }
    obtenerDatosDepartamento = async (idDepartamento) => {
        try {
            const response = await axios.get(`${endpoint}/departamento/${idDepartamento}`);
            const departamento = response.data;

            const edificio = departamento.edificio_id;
            const edificioBus = await axios.get(`${endpoint}/edificio/${edificio}`);
            const edif = edificioBus.data;
            this.setState({ edificioSeleccionado: edif });

            const bloque = edif.bloque_id;
            const bloqueBus = await axios.get(`${endpoint}/bloque/${bloque}`);
            const blo = bloqueBus.data;
            this.setState({ bloqueSeleccionado: blo });

            const imagenPath = `${endpointImg}/${departamento.imagen_departamento}`
            // Actualizar el estado del componente con los datos del departamento
            this.setState({
                nombre_departamento: departamento.nombre_departamento,
                numero_habitaciones: departamento.numero_habitaciones,
                numero_personas: departamento.numero_personas,
                superficie: departamento.superficie,
                disponibilidad: departamento.disponibilidad === 1 ? true : false,
                amoblado: departamento.amoblado === 1 ? true : false,
                descripcion_departamento: departamento.descripcion_departamento,
                pisoSeleccionado: departamento.piso,
                edificioSeleccionado: departamento.edificio_id,
                imagenDep: imagenPath,

                // Si tienes una imagen asociada al departamento, debes manejarla aquí también
            });
        } catch (error) {
            console.error('Error al obtener datos del departamento:', error);
        }
    };

    setStateAsync(state) {
        return new Promise(resolve => {
            this.setState(state, resolve);
        });
    }

    toggleModal = () => {
        this.setState(prevState => ({
            modalOpen: !prevState.modalOpen
        }));
    }
    handleConfirm = (e) => {
        console.log('Usuario confirmó la acción');
        this.updateDepartment(e);
        this.toggleModal();
    }

    handleInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    handleChange = (e) => {
        const file = e.target.files[0];
            this.setState({
                nuevaImagen: e.target.files[0], // Guardar la URL de la nueva imagen seleccionada
            });

            if (e.target.name === "nuevaImagen") {
                this.setState({ nuevaImagenMostrar: URL.createObjectURL(e.target.files[0]) });
            }

    };

    cargarPisos = async (idEdificio) => {
        try {
            const response = await axios.get(`${endpoint}/edificio/${idEdificio}`);
            console.log('id del edificio:', idEdificio);
            const pisos = response.data;
            const numPisos = pisos.cantidad_pisos;
            console.log('numero de pisos:', numPisos);
            this.setState({ numeroPisos: numPisos });
        } catch (error) {
            console.error('Error al obtener los pisos:', error);
        }
    }

    cargarOpcionesDependientes = async (idBloque) => {
        try {
            const response = await axios.get(`${endpoint}/edificios-by-bloques/${idBloque}`);

            this.setState({ edificios: response.data });
        } catch (error) {
            console.error('Error al obtener las opciones dependientes:', error);
        }
    };

    changeChecked = (name) => {
        this.setState({ [name]: !this.state[name] }); // Cambiar el estado del atributo específico
    };

    updateDepartment = async (e) => {
        e.preventDefault();
        const validationErrors = {};

        if (!this.state.nombre_departamento.trim()) {
            validationErrors.nombre_departamento = "Este campo es obligatorio";
        } else if (
            !/^[A-Za-zÑñáéíóú][A-Za-zÑñáéíóú\s0-9]{1,60}[A-Za-zÑñáéíóú0-9]$/.test(
                this.state.nombre_departamento
            )
        ) {
            validationErrors.nombre_departamento = "Ingrese un nombre válido";
        }

        if (!this.state.numero_habitaciones) {
            validationErrors.numero_habitaciones = "Este campo es obligatorio";
        } else {
            if (!/^(?!-)(?:[1-9]|[1]\d)$/.test(this.state.numero_habitaciones)) {
                validationErrors.numero_habitaciones =
                    "Ingrese un número de habitaciones válido";
            }
        }

        if (!this.state.numero_personas) {
            validationErrors.numero_personas = "Este campo es obligatorio";
        } else {
            if (!/^(?!-)(?:[1-9]|[1]\d)$/.test(this.state.numero_personas)) {
                validationErrors.numero_personas =
                    "Ingrese un número de personas válido";
            }
        }

        if (!this.state.descripcion_departamento.trim()) {
            validationErrors.descripcion_departamento = "Este campo es obligatorio";
        } else if (
            !/^[A-Za-zÑñáéíóú][A-Za-zÑñáéíóú0-9,"":;.() ]{1,120}$/.test(
                this.state.descripcion_departamento
            )
        ) {
            validationErrors.descripcion_departamento =
                "Ingrese una descripcion válida";
        }
        if (!this.state.superficie) {
            validationErrors.superficie = "Este campo es obligatorio";
        } else if (
            !/^(?!-)(?:[1-9]\d{2})$/.test(
                this.state.superficie
            )
        ) {
            validationErrors.superficie =
                "Ingrese una superficie válida";
        }

        if (this.state.imagenDep.name) {
            const extensiones = ["png", "PNG", "jpg", "jpeg"];

            var nombreArchivo = this.state.imagenDep.name;
            const extension = nombreArchivo.substring(
                nombreArchivo.lastIndexOf(".") + 1,
                nombreArchivo.length
            );
            if (!extensiones.includes(extension)) {
                document.getElementsByClassName("imagen_input").value = "";

                this.setState({ imagenDep: "" });
                validationErrors.imagenDep =
                    "La imagen tiene que tener una extension .png, .jpg, .PNG o .jpeg";
            }
        }

        this.setState({ errors: validationErrors });

        if (Object.keys(validationErrors).length === 0) {
            const idDep = cookies.get('idDepa');
            const data = new FormData();
            console.log("nuevaImagen1",this.state.nuevaImagen);
            data.append("nombre_departamento", this.state.nombre_departamento);
            data.append("numero_habitaciones", this.state.numero_habitaciones);
            data.append("numero_personas", this.state.numero_personas);
            data.append("superficie", this.state.superficie);
            data.append("disponibilidad", this.state.disponibilidad ? '1' : '0');
            data.append("amoblado", this.state.amoblado ? '1' : '0');
            data.append("descripcion_departamento", this.state.descripcion_departamento);
            data.append("piso", this.state.pisoSeleccionado);
            if (this.state.nuevaImagen) {
                data.append("imagen_departamento", this.state.nuevaImagen);
              }else{
                data.append("imagen_departamento", this.state.imagenDep);
              }
            data.append("edificio_id", this.state.edificioSeleccionado)

            console.log("nuevaImagen1",this.state.nuevaImagen);


            await axios.post(`${endpoint}/departamentoupd/${idDep}`, data);
            cookies.remove('idDepa');
            window.location.href = "./depa";


        }
    };

    render() {
        const { numeroPisos, pisoSeleccionado } = this.state;
        const pisosOptions = [];
        console.log("nuevaImagen1",this.state.nuevaImagen);

        for (let i = 1; i <= numeroPisos; i++) {
            pisosOptions.push(
                <option key={i} value={i}>{i}</option>
            );
        }
        return (
            <>
                <ModalConfirm
                    isOpen={this.state.modalOpen}
                    toggle={this.toggleModal}
                    confirm={this.handleConfirm}
                    message="¿Está seguro de que deseas guardar el departamento?"
                />
                <Container className="custom-form">
                    <Row>
                        <Col sm={12}>
                            <h2 className="text-center mb-5">Editar departamento</h2>
                            <form onSubmit={this.updateDepartment}>
                                <FormGroup className="mb-4">
                                    <Label
                                        className="label-custom"
                                    >
                                        Nombre departamento
                                    </Label>
                                    <Input
                                        id="inputRegistro"
                                        type="text"
                                        name="nombre_departamento"
                                        placeholder="Ingrese nombre"
                                        value={this.state.nombre_departamento}
                                        onChange={this.handleInput}
                                    />
                                    {this.state.errors.nombre_departamento && (
                                        <span>{this.state.errors.nombre_departamento}</span>
                                    )}
                                </FormGroup >
                                <FormGroup className="mb-4">
                                    <Row>
                                        <Col sm={4}>
                                            <Label
                                                className="label-custom"
                                            >
                                                Número de habitaciones
                                            </Label>
                                            <Input
                                                id="inputRegistro"
                                                type="number"
                                                name="numero_habitaciones"
                                                value={this.state.numero_habitaciones}
                                                onChange={this.handleInput}
                                            />
                                            {this.state.errors.numero_habitaciones && (
                                                <span>{this.state.errors.numero_habitaciones}</span>
                                            )}
                                        </Col>
                                        <Col sm={4}>
                                            <Label
                                                className="label-custom"
                                            >
                                                Número de personas
                                            </Label>
                                            <Input
                                                id="inputRegistro"
                                                type="number"
                                                name="numero_personas"
                                                value={this.state.numero_personas}
                                                onChange={this.handleInput}
                                            />
                                            {this.state.errors.numero_personas && (
                                                <span>{this.state.errors.numero_personas}</span>
                                            )}
                                        </Col>
                                        <Col sm={4}>
                                            <Label
                                                className="label-custom"
                                            >
                                                Superficie
                                            </Label>
                                            <Input
                                                id="inputRegistro"
                                                type="number"
                                                name="superficie"
                                                value={this.state.superficie}
                                                onChange={this.handleInput}
                                            />
                                            {this.state.errors.superficie && (
                                                <span>{this.state.errors.superficie}</span>
                                            )}
                                        </Col>
                                    </Row>
                                    
                                </FormGroup>
                                <FormGroup className="mb-4">
                                   
                                </FormGroup>
                                <FormGroup className="mb-4">
                                    
                                </FormGroup>
                                <Row className="mb-4">
                                    <Col sm={6}>

                                        <Label
                                            check
                                            className="label-custom"
                                        >
                                            <Input
                                                type="checkbox"
                                                id="checkBoxAmoblado"
                                                checked={this.state.amoblado}
                                                onChange={() => this.changeChecked('amoblado')}
                                            />
                                            {' '}
                                            Amoblado
                                        </Label>


                                    </Col>
                                </Row>
                                <FormGroup className="mb-4">
                                    <Label
                                        className="label-custom"
                                    >
                                        Subir una imagen
                                    </Label>
                                    <Input
                                        type="file"
                                        name="nuevaImagen"
                                        id="nuevaImagen"
                                        onChange={this.handleChange}
                                    />
                                    {this.state.imagenDep && (
                                    <div className="d-flex justify-content-center">
                                        <img
                                            src={this.state.nuevaImagenMostrar ? this.state.nuevaImagenMostrar : this.state.imagenDep}
                                            alt="Vista previa"
                                            style={{ width: '128px', height: '128px', marginTop: '25px'}}
                                        />
                                    </div>
                                    )}
                                </FormGroup>

                                <FormGroup className="mb-5">
                                    <Label
                                        className="label-custom"
                                    >
                                        Descripción
                                    </Label>
                                    <Input
                                        id="inputRegistro"
                                        type="textarea"
                                        name="descripcion_departamento"
                                        value={this.state.descripcion_departamento}
                                        className="autoExpand"
                                        placeholder="Ingrese descripcion"
                                        onChange={this.handleInput}
                                        onInput={(e) => {
                                            e.target.style.height = 'auto';
                                            e.target.style.height = (e.target.scrollHeight) + 'px';
                                        }}
                                    />
                                </FormGroup>
                                <Button size="lg" type="button" className="custom-button mx-auto d-block"
                                    style={{ fontWeight: 'bold' }}
                                    onClick={this.toggleModal}
                                >
                                    Continuar
                                </Button>
                            </form>
                        </Col>
                    </Row>
                </Container>

            </>
        );
    }
}
export default EditarDep;
