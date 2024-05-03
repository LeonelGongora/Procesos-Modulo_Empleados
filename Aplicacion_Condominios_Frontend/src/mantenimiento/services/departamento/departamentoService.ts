import { AxiosResponse } from "axios";
import api from "../api";

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

export const getAllDepartamentos = async (): Promise<Departamento[]> => {
  try {
    const response: AxiosResponse = await api.get("/departamentos");
    return response.data;
  } catch (error) {
    return [];
  }
};
