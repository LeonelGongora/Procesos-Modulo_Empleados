import { AxiosResponse } from "axios";
import api from "../api";

interface Bloque {
  id: number;
  nombre_bloque: string;
  direccion_bloque: string;
  descripcion_bloque: string;
  imagen_bloque: string;
}

export const getAllBloques = async (): Promise<Bloque[]> => {
  try {
    const response: AxiosResponse = await api.get("/bloques");
    return response.data;
  } catch (error) {
    return [];
  }
};
