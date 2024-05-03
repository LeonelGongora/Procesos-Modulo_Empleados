import React, { useEffect, useState } from "react";
import "./style.css";
import { Stack, Chip, MenuItem } from "@mui/material";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

import Box from "@mui/material/Box";
import { getAllSolicitudServicio } from "../services/maintenance/solicitudMantenimientoService";

import { TextField } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import "./style.css";
import { getAllCategories } from "../services/maintenance/categoryService";
import { getAllPersonal } from "../services/maintenance/personalExternoService";

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

interface Category {
  id: number;
  catnombre: string;
  catdescripcion: string;
  disabled: boolean;
}

interface PersonalExternoResponse {
  idPersonalExterno: number;
  nombre: string;
  telefono: string;
  direccion: string;
  categoria: { id: number; catnombre: string };
}

export default function PersonalPage() {
  const [solicitudesList, setSolicitudes] = useState<
    SolicitudServicioResponse[]
  >([]);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [servicioActual, setServicioActual] =
    useState<SolicitudServicioResponse>();
  const [categoryService, setCategoryService] = useState<Category[]>();
  const [personalExterno, setPersonalExterno] =
    useState<PersonalExternoResponse[]>();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const solicitudServicio = await getAllSolicitudServicio();
      setSolicitudes(solicitudServicio);
      const categoryService = await getAllCategories();
      console.log("🚀 ~ loadData ~ categoryService:", categoryService);
      setCategoryService(categoryService);
      const personal = await getAllPersonal();
      setPersonalExterno(personal);
    } catch (error) {}
  };

  const handleOpenModal = (solicitudServicio: SolicitudServicioResponse) => {
    setServicioActual(solicitudServicio);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
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
                          <button
                            type="button"
                            onClick={() => handleOpenModal(solicitud)}
                          >
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
      <>
        {showModal && (
          <div id="" className="modal">
            <div className="modal-content">
              <div className="row">
                <div className="col text-xl">SERVICIOS</div>
                <div className="col text-right">
                  <CloseOutlinedIcon
                    className="close-btn"
                    fontSize="large"
                    onClick={handleCloseModal}
                  />
                </div>
              </div>

              <div className="width-80 margin-x-auto">
                <Box
                  component="form"
                  sx={{
                    "& .MuiTextField-root": {
                      m: 1,
                      width: "40ch",
                      display: "flex",
                    },
                  }}
                  noValidate
                >
                  <div className="row">
                    <div className="col align-right-inputs">
                      <label htmlFor="outlined-select-currency">
                        Categoria de Servicio
                      </label>
                    </div>
                    <div className="col">
                      <TextField
                        id="outlined-select-currency"
                        value={categoryService?.find((element) => {
                          if (element.id === servicioActual?.idCategoria) {
                            return element.catnombre;
                          } else {
                            return "";
                          }
                        })}
                        select
                      >
                        {categoryService?.map((option, index) => (
                          <MenuItem key={index} value={option.id}>
                            {option.catnombre}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col align-right-inputs">
                      <label htmlFor="outlined-select-currency">
                        Descripción
                      </label>
                    </div>
                    <div className="col">
                      <TextField
                        id="outlined"
                        placeholder="Ingrese la descripción del servicio"
                        value={servicioActual?.descripcion}
                        multiline
                      />
                    </div>
                  </div>
                  <>{console.log(servicioActual)}</>
                  <div className="row">
                    <div className="col align-right-inputs">
                      <label htmlFor="outlined-select-currency">
                        Nombre Propietario
                      </label>
                    </div>
                    <div className="col">
                      <TextField
                        required
                        id="outlined"
                        placeholder="Ingrese Nombre del Propietario"
                        value={servicioActual?.nombrePropietario}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col align-right-inputs">
                      <label htmlFor="outlined-select-currency">Telefono</label>
                    </div>
                    <div className="col">
                      <TextField
                        required
                        id="outlined"
                        type="number"
                        placeholder="Ingrese telefono"
                        value={servicioActual?.numerReferencia}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col align-right-inputs">
                      <label htmlFor="outlined-select-currency">
                        Encargado
                      </label>
                    </div>
                    <div className="col">
                      <TextField id="outlined-select-currency" select>
                        {personalExterno?.map((option, index) => (
                          <MenuItem
                            key={index}
                            value={option.idPersonalExterno}
                          >
                            {option.nombre}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col align-right-inputs">
                      <label htmlFor="outlined-select-currency">Estado</label>
                    </div>
                    <div className="col">
                      <TextField id="outlined-select-currency" select />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col align-right-inputs">
                      <label htmlFor="outlined-select-currency">Costo</label>
                    </div>
                    <div className="col">
                      <TextField
                        required
                        id="outlined"
                        //label="Costo"
                        type="number"
                        placeholder="Ingrese Costo"
                      />
                    </div>
                  </div>

                  <button className="block margin-x-auto" type="submit">
                    Guardar
                  </button>
                </Box>
              </div>
            </div>
          </div>
        )}
      </>
    </>
  );
}
