import React, { useState, useEffect } from 'react';
import { FaFileAlt } from 'react-icons/fa';

const GestionCobro = () => {
    const endpoint = "http://localhost:8000/api";
    const [preavisos, setPreavisos] = useState([]);

    useEffect(() => {
        fetch(`${endpoint}/obtener-preavisos`)
            .then(response => response.json())
            .then(data => {
                const preavisosArray = data.preAvisos.map(preaviso => ({
                    id: preaviso.id,
                    departamento: preaviso.departamento,
                    propietario_pagar: preaviso.propietario_pagar,
                    fecha: preaviso.fecha,
                    descripcion_servicios: preaviso.descripcion_servicios,
                    servicio_pagar: preaviso.servicio_pagar,
                    monto: preaviso.monto
                }));
                setPreavisos(preavisosArray);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const handleGenerarExpensa = () => {
        // Esta función podría contener la lógica para generar la expensa
        // Por ahora, no hace nada
    };

    return (
        <div className="container">
            <h2>Pre-Aviso de Expensas</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Departamento</th>
                        <th>Propietario a Pagar</th>
                        <th>Fecha</th>
                        <th>Descripción de Servicios</th>
                        <th>Servicio a Pagar</th>
                        <th>Monto</th>
                        <th>Generar Expensa</th> {/* Columna para el botón */}
                    </tr>
                </thead>
                <tbody>
                    {preavisos.map(preaviso => (
                        <tr key={preaviso.id}>
                            <td>{preaviso.id}</td>
                            <td>{preaviso.departamento.nombre_departamento}</td>
                            <td>{preaviso.propietario_pagar}</td>
                            <td>{preaviso.fecha}</td>
                            <td>{preaviso.descripcion_servicios}</td>
                            <td>{preaviso.servicio_pagar}</td>
                            <td>{preaviso.monto}</td>
                            <td>
                                <button className="btn btn-primary" onClick={handleGenerarExpensa}>
                                    Generar Expensa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default GestionCobro;
