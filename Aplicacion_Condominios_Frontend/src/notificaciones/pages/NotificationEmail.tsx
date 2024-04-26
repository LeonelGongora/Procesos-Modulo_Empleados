import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';

function NotificationEmail() {
    const [formData, setFormData] = useState({
        titulo: '',
        anuncio: '',
        email: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/v1/send', formData);
            console.log(response.data);
            alert('User registered successfully. Please check your email to verify your account.');
        } catch (error) {
            console.error(error);
            if (axios.isAxiosError(error)) {
                // Manejar error Axios (solicitud fallida)
                if (error.response && error.response.status === 422) {
                    // Mostrar un mensaje de error personalizado basado en la respuesta del servidor
                    const errorMessages = error.response.data.errors;
                    alert(`Error: ${Object.values(errorMessages).join(', ')}`);
                } else {
                    alert(`An unexpected error occurred: ${error.message}`);
                }
            } else {
                // Manejo de errores inesperados
                alert('An unexpected error occurred.');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className='mb-3'>
                <label className='form-label'>Titulo: </label>
                <input className='form-control' type="text" name="titulo" value={formData.titulo} onChange={handleChange} required />
            </div>
            <div className='mb-3'>
                <label className='form-label'>Anuncio: </label>
                <input className='form-control' type="text" name="anuncio" value={formData.anuncio} onChange={handleChange} required />
            </div>
            <div className='mb-3'>
                <label className='form-label'>Email:</label>
                <input className='form-control' type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            <button className='btn btn-success' type="submit">Enviar</button>
        </form>
    );
}

export default NotificationEmail;
