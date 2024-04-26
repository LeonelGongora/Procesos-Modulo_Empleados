import React, { useEffect, useState } from "react";
import "./style.css";
import { TextField, MenuItem } from "@mui/material";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

import Box from "@mui/material/Box";
import { getAllCategories } from "../services/maintenance/categoryService";
import { createSolicitudServicio } from "../services/maintenance/solicitudMantenimientoService";
const place = [
  {
    value: "1",
    label: "Departamento",
  },
  {
    value: "2",
    label: "Áreas comunes",
  },
  {
    value: "3",
    label: "Infraestructura",
  },
  {
    value: "4",
    label: "otro",
  },
];

// const currencies = [

//   {
//     value: '1',
//     label: 'Electricidad',
//   },
//   {
//     value:'2',
//     label: 'Plomeria',
//   },
//   {
//     value:'3',
//     label: 'Construcción',
//   },
//   {
//     value: '4',
//     label: 'otro',
//   },
// ];

interface Servicio {
  id: number;
  catnombre: string;
}

interface Solicitud {
  idCategoria: number;
  idEstado: number;
  descripcion: string;
  nombrePropietario: string;
  ubicacion: string;
  numerRegerencia: string;
  encargado: string;
  fechaSoicitud: string;
  fechaFinalizado: string;
}

export default function PersonalPage() {
  const [servicioList, setServicioList] = useState<Servicio[]>([]);
  const [solicitud, setSolicitud] = useState<Solicitud>({
    idCategoria: 0,
    idEstado: 1,
    descripcion: "",
    nombrePropietario: "",
    ubicacion: "",
    numerRegerencia: "",
    encargado: "",
    fechaSoicitud: "",
    fechaFinalizado: "",
  });
  useEffect(() => {
    loadServicios();
  }, []);

  const loadServicios = async () => {
    try {
      const response = await getAllCategories();
      setServicioList(response);
    } catch (error) {}
  };

  const handleChangeDescripcion = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSolicitud({ ...solicitud, descripcion: e.target.value });
  };
  const handleChangeNombre = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSolicitud({ ...solicitud, nombrePropietario: e.target.value });
  };
  const handleChangeTelefono = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSolicitud({ ...solicitud, numerRegerencia: e.target.value });
  };
  const handleChangeUbicacion = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSolicitud({ ...solicitud, ubicacion: e.target.value });
  };

  const handleClickRegistrar = async () => {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const formatedDate = `${year}-${month}-${day}`;

    const dataToSend = { ...solicitud, fechaSoicitud: formatedDate };

    const response = await createSolicitudServicio(dataToSend);

    console.log(response);
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
          <h2>Registro de Servicio</h2>
          <div className="d-flex a-center d-column">
            <TextField
              id="outlined-select-currency"
              select
              label="Destino de Servicio"
              defaultValue="1"
              helperText="Por favor seleccione el tipo de servicio"
            >
              {place.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              id="outlined-select-currency"
              select
              label="Tipo de Servicio"
              onChange={(event) =>
                setSolicitud({
                  ...solicitud,
                  idCategoria: parseInt(event.target.value),
                })
              }
              helperText="Por favor seleccione el tipo de servicio"
            >
              {servicioList.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.catnombre}
                </MenuItem>
              ))}
            </TextField>

            <div>
              <TextField
                id="outlined"
                label="Descripción del servicio"
                placeholder="Ingrese la descripción del servicio"
                value={solicitud.descripcion}
                onChange={handleChangeDescripcion}
                multiline
              />

              <TextField
                required
                id="outlined"
                label="Nombre"
                placeholder="Ingrese nombre del propietario/encargado"
                value={solicitud.nombrePropietario}
                onChange={handleChangeNombre}
              />
              <TextField
                required
                id="outlined"
                label="Telefono"
                type="number"
                placeholder="Ingrese telefono"
                value={solicitud.numerRegerencia}
                onChange={handleChangeTelefono}
              />
              <TextField
                required
                id="outlined"
                label="Ubicación"
                placeholder="Ingrese la ubicación"
                value={solicitud.ubicacion}
                onChange={handleChangeUbicacion}
              />
            </div>
            <button 
              className="block"
              type="submit"
              onClick={handleClickRegistrar}
            >
              Registrar
            </button>
          </div>
        </div>
      </Box>
    </>
  );
}
