import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from "reactstrap";
import QRCode from "qrcode.react";
import Swal from "sweetalert2"; 
import jsPDF from "jspdf";
const endpoint = "http://localhost:8000/api";

const FormularioPagoArea = () => {
    const { id } = useParams();
    const [monto, setMonto] = useState("");
    const [formaPago, setFormaPago] = useState("");
    const [efectivo, setEfectivo] = useState(""); 
    const [errors, setErrors] = useState({});
    const [showQR, setShowQR] = useState(false);
    const [cambio, setCambio] = useState(0);
    const [pagoRealizado, setPagoRealizado] = useState(false);

    useEffect(() => {
        console.log("Componente FormularioPagoArea montado");
    }, []);
    const generatePDF = () => {
        try {
            const doc = new jsPDF();
            doc.text("Administracion",20,10);
            doc.text("-------------------",20,20);
            doc.text("Recibo de Pago", 20, 30);
            doc.text("-------------------",20,40);

            // Verificar que los valores estén definidos antes de usarlos en el PDF
            if (monto) {
                doc.text(`Monto: ${monto}`, 20, 50);
            }
            if (formaPago) {
                doc.text(`Forma de Pago: ${formaPago}`, 20, 60);
            }
            if (formaPago === "efectivo" && efectivo) {
                doc.text(`Efectivo: ${efectivo}`, 20, 70);
                if (cambio > 0) {
                    doc.text(`Cambio: ${cambio.toFixed(2)}`, 20, 80);
                }
            }


            doc.save("recibo_pago.pdf");
        } catch (error) {
           console.log(monto);
           console.log(formaPago);
           console.log(cambio);
           console.log(error);
        }
    };
    
    const handleInput = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case "monto":
                setMonto(value);
                break;
            case "formaPago":
                setFormaPago(value);
                break;
            case "efectivo": 
                setEfectivo(value);
                break;
            default:
                break;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = {};
    
        if (!monto.trim()) {
            validationErrors.monto = "Este campo es obligatorio";
        }
    
        if (!formaPago.trim()) {
            validationErrors.formaPago = "Seleccione una forma de pago";
        }
    
        setErrors(validationErrors);
    
        if (Object.keys(validationErrors).length === 0) {
            console.log("Monto:", monto);
            console.log("Forma de pago:", formaPago);
            axios.put(`${endpoint}/common-areas/${id}/pagarReserva`)
                .then(response => {
                    console.log(response.data);
                    setShowQR(formaPago === "qr");
                    setPagoRealizado(true);
    
                    Swal.fire({
                        icon: 'success',
                        title: '¡Pago realizado con éxito!'
                    }).then(() => {
                        window.location.href = "/cobros/pagar-reserva";
    
                    });
    
                })
                .catch(error => {
                    console.error('Error al pagar la reserva:', error);
                });
    
            if (formaPago === "efectivo") {
                const cambioCalculado = parseFloat(efectivo) - parseFloat(monto);
                setCambio(cambioCalculado > 0 ? cambioCalculado : 0);
            }

            generatePDF();

        }
    };
    
    const handleGenerateQR = () => {
        const qrData = `Monto: ${monto}`;
        setShowQR(true);
    };

    return (
        <Container className="custom-form">
            <Row>
                <Col sm={12}>
                    <h2 className="text-center mb-5">Pagar Área Común</h2>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label for="monto">Monto:</Label>
                            <Input
                                type="number"
                                name="monto"
                                id="monto"
                                value={monto}
                                onChange={handleInput}
                                required
                            />
                            {errors.monto && <span>{errors.monto}</span>}
                        </FormGroup>
                        <FormGroup>
                            <Label for="formaPago">Forma de Pago:</Label>
                            <Input
                                type="select"
                                name="formaPago"
                                id="formaPago"
                                value={formaPago}
                                onChange={handleInput}
                                required
                            >
                                <option value="">Seleccione una opción</option>
                                <option value="efectivo">Efectivo</option>

                                <option value="qr">Pago por QR</option>
                            </Input>
                            {errors.formaPago && <span>{errors.formaPago}</span>}
                        </FormGroup>
                        {formaPago === "efectivo" && ( 
                            <FormGroup>
                                <Label for="efectivo">Efectivo:</Label>
                                <Input
                                    type="number"
                                    name="efectivo"
                                    id="efectivo"
                                    value={efectivo}
                                    onChange={handleInput}
                                    required
                                />
                            </FormGroup>
                        )}
                        <Button type="submit" color="primary">
                            Pagar
                        </Button>
                        {formaPago === "qr" && (
                            <Button color="info" onClick={handleGenerateQR}>Generar QR</Button>
                        )}
                    </Form>
                    {showQR && ( 
                        <div className="text-center mt-3">
                            <h3>Escanea el siguiente código QR para realizar el pago:</h3>
                            <QRCode value={`Monto: ${monto}`} />
                        </div>
                    )}
                    {formaPago === "efectivo" && cambio > 0 && ( 
                        <div className="text-center mt-3">
                            <h4>Cambio: {cambio.toFixed(2)}</h4>
                        </div>
                    )}
                    {pagoRealizado && (
                        <div className="text-center mt-3 text-success">
                            <h4>Pago realizado con éxito</h4>
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default FormularioPagoArea;
