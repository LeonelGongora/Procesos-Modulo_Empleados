import React, { Component } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    Input, FormGroup, Label, Col, Row, Button, Container
} from "reactstrap";
import ModalConfirm from "./ModalConfirm";
import "./customs.css";

const endpoint = "http://localhost:8000/api";
class CrearDepartamento extends Component {
    departamentos = [];
    pisosAr = [];


    async componentDidMount() {
        try {
            const url = `${endpoint}/bloques`;
            const response = await axios.get(url);

            this.setState({ bloques: response.data });
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
            modalOpen: false,
            imagen_departamento: null
        };
    }

    toggleModal = () => {
        this.setState(prevState => ({
            modalOpen: !prevState.modalOpen
        }));
    }
    handleConfirm = (e) => {
        console.log('Usuario confirmó la acción');
        this.storeDepartment(e);
        this.toggleModal();
    }

    handleInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    handleBloqueSeleccionado = (event) => {
        const idBloque = event.target.value;
        this.setState({ bloqueSeleccionado: idBloque });

        this.cargarOpcionesDependientes(idBloque);
    };

    handleEdificioSeleccionado = (e) => {
        const edificio = e.target.value; // Obtener el número de pisos del edificio seleccionado
        this.setState({ edificioSeleccionado: edificio });
        this.cargarPisos(edificio);
    };

    handleChange = (e) => {
        this.setState({
            imagenDep: e.target.files[0],
        });
        console.log('imagen:', this.state.imagenDep.name);
        if (e.target.name === "imagen_departamento") {
            this.setState({ imagen_departamento: URL.createObjectURL(e.target.files[0]) });
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

    storeDepartment = async (e) => {
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

        if (!this.state.pisoSeleccionado) {
            validationErrors.pisoSeleccionado = "Debe seleccionar un piso";
        }

        if (!this.state.bloqueSeleccionado) {
            validationErrors.bloqueSeleccionado = "Debe seleccionar un bloque";
        }

        if (!this.state.edificioSeleccionado) {
            validationErrors.edificioSeleccionado = "Debe seleccionar un edificio";
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

            const url = `${endpoint}/departamento`;
            const data = new FormData();

            data.append("nombre_departamento", this.state.nombre_departamento);
            data.append("numero_habitaciones", this.state.numero_habitaciones);
            data.append("numero_personas", this.state.numero_personas);
            data.append("superficie", this.state.superficie);
            data.append("disponibilidad", this.state.disponibilidad ? '1' : '0');
            data.append("amoblado", this.state.amoblado ? '1' : '0');
            data.append("descripcion_departamento", this.state.descripcion_departamento);
            data.append("piso", this.state.pisoSeleccionado);
            if (this.state.imagenDep) {
                data.append("imagen_departamento", this.state.imagenDep);
            }
            data.append("edificio_id", this.state.edificioSeleccionado)
            console.log(this.state.nombre_departamento);
            console.log(this.state.numero_habitaciones);
            console.log(this.state.numero_personas);
            console.log(this.state.superficie);
            console.log(this.state.disponibilidad);
            console.log(this.state.amoblado);
            console.log(this.state.descripcion_departamento);
            console.log(this.state.pisoSeleccionado);
            console.log(this.state.imagenDep);
            console.log(this.state.edificioSeleccionado);

            axios.post(url, data).then((res) => {
                console.log(res);
                window.location.href = "./depa";
            });

        }
    };

    render() {
        const { numeroPisos, pisoSeleccionado } = this.state;
        const pisosOptions = [];

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
                            <h2 className="text-center mb-5">Crear departamento</h2>
                            <form onSubmit={this.storeDepartment}>
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
                                                N° de habitaciones
                                            </Label>
                                            <Input
                                                id="inputRegistro"
                                                type="number"
                                                name="numero_habitaciones"
                                                placeholder="Numero de habitaciones entre 1 y 20"
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
                                                placeholder="Numero de personas entre 1 y 20"
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
                                                placeholder="Superficie entre 100 y 999"
                                                onChange={this.handleInput}
                                            />
                                            {this.state.errors.superficie && (
                                                <span>{this.state.errors.superficie}</span>
                                            )}
                                        </Col>
                                    </Row>
                                    
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
                                                onChange={() => this.changeChecked('amoblado')}
                                            />
                                            {' '}
                                            Amoblado
                                        </Label>


                                    </Col>
                                </Row>

                                <FormGroup className="mb-4">
                                    <Row>
                                        <Col sm={4}>
                                            <Label
                                                className="label-custom"
                                            >
                                                Seleccionar bloque
                                            </Label>
                                            <Input
                                                type="select"
                                                name="bloque_id"
                                                id="bloque_id"
                                                onChange={this.handleBloqueSeleccionado}
                                            >
                                                <option disabled selected>
                                                    {" "}Seleccionar Bloque</option>
                                                {this.state.bloques.map(bloque => (
                                                    <option key={bloque.id} value={bloque.id}>{bloque.nombre_bloque}</option>
                                                ))}
                                            </Input>
                                            {this.state.errors.bloqueSeleccionado && (
                                                <span>{this.state.errors.bloqueSeleccionado}</span>
                                            )}
                                        </Col>
                                        <Col sm={4}>
                                            <Label
                                                className="label-custom"
                                            >
                                                Seleccionar edificio
                                            </Label>
                                            <Input
                                                type="select"
                                                className="mb-3 w-100"
                                                name="edificio_id"
                                                id="edificio_id"
                                                onChange={this.handleEdificioSeleccionado}
                                            >
                                                <option disabled selected>
                                                    {" "}Seleccionar Edificio</option>
                                                {this.state.edificios.map(edificio => (
                                                    <option key={edificio.id} value={edificio.id}>{edificio.nombre_edificio}</option>
                                                ))}
                                            </Input>
                                            {this.state.errors.edificioSeleccionado && (
                                                <span>{this.state.errors.edificioSeleccionado}</span>
                                            )}
                                        </Col>
                                        <Col sm={4}>
                                            <Label
                                                className="label-custom"
                                            >
                                                Seleccionar piso
                                            </Label>
                                            <Input
                                                type="select"
                                                name="piso"
                                                id="piso"
                                                onChange={(e) => this.setState({ pisoSeleccionado: e.target.value })}
                                            >
                                                <option disabled selected>
                                                    {" "}Seleccionar piso</option>
                                                {pisosOptions}
                                            </Input>
                                            {this.state.errors.pisoSeleccionado && (
                                                <span>{this.state.errors.pisoSeleccionado}</span>
                                            )}
                                        </Col>
                                    </Row>
                                    
                                </FormGroup>

                                <FormGroup className="mb-4">
                                    
                                </FormGroup>
                                <FormGroup className="mb-4">
                                    
                                </FormGroup>
                                <FormGroup className="mb-4">
                                    <Label
                                        className="label-custom"
                                    >
                                        Subir una imagen
                                    </Label>
                                    <Input
                                        type="file"
                                        name="imagen_departamento"
                                        id="imagen_departamento"
                                        onChange={this.handleChange}
                                    />
                                    {this.state.imagen_departamento && (
                                        <div className="d-flex justify-content-center">
                                            <img
                                                src={this.state.imagen_departamento}
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
                                        className="autoExpand"
                                        placeholder="Ingrese descripcion"
                                        onChange={this.handleInput}
                                        onInput={(e) => {
                                            e.target.style.height = 'auto';
                                            e.target.style.height = (e.target.scrollHeight) + 'px';
                                        }}
                                    />
                                    {this.state.errors.descripcion_departamento && (
                                        <span>{this.state.errors.descripcion_departamento}</span>
                                    )}
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
export default CrearDepartamento;
