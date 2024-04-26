import React, { useEffect, useState } from "react";
import "./style.css";
import { Stack, Chip } from "@mui/material";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

import Box from "@mui/material/Box";
import { getAllSolicitudServicio } from "../services/maintenance/solicitudMantenimientoService";

interface SolicitudServicioResponse {
  idRegistroSolicitud: number;
  idCategoria: number;
  idEstado: number;
  descripcion: string;
  nombrePropietario: string;
  ubicacion: string;
  numerReferencia: string;
  encargado: string;
  fechaSolicitud: string;
  fechaFinalizado: string;
  categoria: { id: number; catnombre: string };
  estado: {
    idEstado: number;
    nombreEstado: string;
  };
}

export default function PersonalPage() {
  const [solicitudesList, setSolicitudes] = useState<
    SolicitudServicioResponse[]
  >([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await getAllSolicitudServicio();
      setSolicitudes(response);
    } catch (error) {}
  };

  return (
    <>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "40ch", display: "flex" },
        }}
        noValidate
      >
        <div id="content">
          <h2>Lista de solicitud de servicios</h2>

          <div className="row">
            <div className="col">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th className="left">Categoría</th>
                    <th className="left">Ubicación</th>
                    <th className="left">Fecha de solicitud</th>
                    <th className="left">Encargado</th>
                    <th className="left">Fecha de finalización</th>
                    <th className="righ">Estado</th>
                    <th className="righ">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitudesList.map((solicitud) => (
                    <>
                      <tr>
                        <td>{solicitud.categoria?.catnombre}</td>
                        <td>{solicitud.ubicacion}</td>
                        <td>{solicitud.fechaSolicitud}</td>
                        <td>{solicitud.encargado}</td>
                        <td>{solicitud.fechaFinalizado}</td>
                        <td>
                          <Stack direction="row" spacing={1}>
                            <Chip label="Proceso" color="primary" />
                          </Stack>
                        </td>
                        <td className="actions-container">
                          <button type="button">
                            <CreateOutlinedIcon
                              className="c-dark-blue"
                              fontSize="large"
                            />
                          </button>
                          <button type="button">
                            <DeleteOutlinedIcon
                              className="c-dark-blue "
                              fontSize="large"
                            />
                          </button>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Box>
    </>
  );
}
