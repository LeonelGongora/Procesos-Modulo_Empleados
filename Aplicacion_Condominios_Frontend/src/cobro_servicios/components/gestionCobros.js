import React, { useState, useEffect } from 'react';

const GestionCobro = () => {
    const endpoint = "http://localhost:8000/api";
    const [departamentos, setDepartamentos] = useState([]);

    useEffect(() => {
        fetch(`${endpoint}/obtener-departamentos`)
            .then(response => response.json())
            .then(data => {
                // Convertimos el objeto en un array de objetos
                const departamentosArray = Object.entries(data).map(([id, nombre]) => ({ id, nombre }));
                setDepartamentos(departamentosArray);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <div className="container">
            <h2>Gestión de Cobro por Departamentos</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Departamento</th>
                        <th>Generar formulario pre-aviso</th>
                    </tr>
                </thead>
                <tbody>
                    {departamentos.map(departamento => (
                        <tr key={departamento.id}>
                            <td>{departamento.id}</td>
                            <td>{departamento.nombre}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default GestionCobro;
