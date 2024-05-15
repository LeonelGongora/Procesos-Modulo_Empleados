import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';

export const NotificationsList = () => {
  const notices = [
    {
      id: 1,
      title: 'Campeonato de Futbol',
      description: 'Se invita a los residentes al campeonato de futbol',
      created_at: '2024-04-19 10:19:10'
    },
    {
      id: 2,
      title: 'Advertencia de desalojo',
      description: 'No olviden pagar sus deudas en el centro de cobranza.',
      created_at: '2024-04-19 12:00:00'
    },
    {
      id: 3,
      title: 'Corte de Internet',
      description: 'Se realizara el cambio de proveedor de internet, por lo que se cortara el internet durante la tarde',
      created_at: '2024-04-19 13:13:13'
    },
    {
      id: 4,
      title: 'Aviso de desalojo', 
      description: 'Se les notifica que por las faltas en los cobros de alquiler, deben desocupar el departamento.',
      created_at: '2024-02-12 13:50:10'
    }
  ];

  const [preNotices, setPreNotices] = useState([]);
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/obtener-preavisos')
      .then(response => {
        console.log(response.data.preAvisos);
        setPreNotices(response.data.preAvisos);
      })
      .catch(error => {
        console.error('Error: ', error);
      });
  }, []);

  const [residents, setResidents] = useState([]);
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/residentes')
      .then(response => {
        console.log(response.data);
        setResidents(response.data);
      })
      .catch(error => {
        console.error('Error: ', error);
      });
  }, []);

  const getResidentByName = (name) => {
    let resident = null;

    resident = residents.filter((r) => r.nombre_residente === name);

    return resident;
  }

  const saveSelectedNotice = (notice) => {
    sessionStorage.clear();
    sessionStorage.setItem('notice', JSON.stringify(notice));
  }

  const saveSelectedPreNotice = (preNotice) => {
    let resident = getResidentByName(preNotice.propietario_pagar);

    sessionStorage.clear();
    sessionStorage.setItem('pre_notice', JSON.stringify(preNotice));
    sessionStorage.setItem('resident', JSON.stringify(resident));
  }

  return (
    <div>
      <h3 className=''>Lista de Notificaciones</h3>

      <table className='table table-striped'>
        <thead className='bg-primary text-white'>
          <tr>
            <th>Titulo</th>
            <th>Enviar</th>
          </tr>
        </thead>
        <tbody>
          { 
            notices.map((notice) => (
              <tr key={ notice.id }>
                <td>{ notice.title }</td>
                <td>
                  <Link to={ '/notifications/send/telegram' } className='btn btn-primary' onClick={ () => saveSelectedNotice(notice) }>Telegram</Link>
                </td>
              </tr>
            )) 
          }
          <h4>Pre avisos</h4>
          {
            preNotices.map((preNotice) => (
              <tr key={ preNotice.id }>
                <td>{ preNotice.descripcion_servicios }</td>
                <td>
                  <Link to={ '/notifications/email' } className='btn btn-light' onClick={ () => saveSelectedPreNotice(preNotice) }>Email</Link>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
};
