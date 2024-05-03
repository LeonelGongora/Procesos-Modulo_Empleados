import React, { useEffect, useState } from "react";
import "./style.css";
import { TextField, MenuItem } from "@mui/material";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

import Box from "@mui/material/Box";
import { getAllCategories } from "../services/maintenance/categoryService";
import { createSolicitudServicio } from "../services/maintenance/solicitudMantenimientoService";
import { getAllBloques } from "../services/departamento/bloqueService";
import { getAllEdificios } from "../services/departamento/edificioService";
import { getAllDepartamentos } from "../services/departamento/departamentoService";
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
  numerReferencia: string;
  encargado: string;
  fechaSoicitud: string;
  fechaFinalizado: string;
}

interface Bloque {
  id: number;
  nombre_bloque: string;
  direccion_bloque: string;
  descripcion_bloque: string;
  imagen_bloque: string;
}

interface Edificio {
  id: number;
  nombre_edificio: string;
  descripcion_edificio: string;
  imagen_edificio: string;
  cantidad_pisos: string;
  bloque_id: number;
}

interface Departamento {
  id: number;
  nombre_departamento: string;
  numero_habitaciones: number;
  numero_personas: number;
  superficie: number;
  disponibilidad: number;
  amoblado: number;
  descripcion_departamento: string;
  piso: number;
  imagen_departamento: string;
  edificio_id: number;
}

export default function PersonalPage() {
  const [bloque, setBloque] = useState<Bloque[]>();
  const [edificio, setEdificio] = useState<Edificio[]>();
  const [departamento, setDepartamento] = useState<Departamento[]>();

  const [servicioList, setServicioList] = useState<Servicio[]>([]);
  const [solicitud, setSolicitud] = useState<Solicitud>({
    idCategoria: 0,
    idEstado: 1,
    descripcion: "",
    nombrePropietario: "",
    ubicacion: "",
    numerReferencia: "",
    encargado: "",
    fechaSoicitud: "",
    fechaFinalizado: "",
  });
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await getAllCategories();
      setServicioList(response);
      const bloquesData = await getAllBloques();
      setBloque(bloquesData);
      const edificiosData = await getAllEdificios();
      setEdificio(edificiosData);
      const departamentosData = await getAllDepartamentos();
      setDepartamento(departamentosData);
    } catch (error) {}
  };

  const handleChangeDescripcion = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSolicitud({ ...solicitud, descripcion: e.target.value });
  };
  const handleChangeNombre = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSolicitud({ ...solicitud, nombrePropietario: e.target.value });
  };
  const handleChangeTelefono = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSolicitud({ ...solicitud, numerReferencia: e.target.value });
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
    console.log("🚀 ~ handleClickRegistrar ~ dataToSend:", dataToSend);

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

            <TextField
              id="outlined-select-currency"
              select
              label="Bloque"
              //defaultValue="1"
              helperText="Por favor seleccione el bloque"
            >
              {bloque?.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.nombre_bloque}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              id="outlined-select-currency"
              select
              label="Edificio"
              //defaultValue="1"
              helperText="Por favor seleccione el edificio"
            >
              {edificio?.map((option) => (
                <MenuItem key={option.bloque_id} value={option.bloque_id}>
                  {option.nombre_edificio}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              id="outlined-select-currency"
              select
              label="Piso"
              // defaultValue="1"
              helperText="Por favor seleccione el número de piso"
            >
              {departamento?.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.piso} / {option.nombre_departamento}
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
                value={solicitud.numerReferencia}
                onChange={handleChangeTelefono}
              />
            </div>
            <button
              className="block"
              type="button"
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
