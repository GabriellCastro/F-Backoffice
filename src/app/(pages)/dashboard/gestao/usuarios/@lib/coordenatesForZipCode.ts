import axios from "axios";
import { UseFormSetValue } from "react-hook-form";

export async function obterCoordenadasPorCEP(
  cep: string,
  setValue: UseFormSetValue<any>
) {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          address: cep,
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        },
      }
    );

    const result = response.data.results[0];
    if (result) {
      const { lat, lng } = result.geometry.location;
      setValue("coordinates.latitude", lat);
      setValue("coordinates.longitude", lng);
      return { latitude: lat, longitude: lng };
    }
  } catch (error: any) {
    throw new Error(`Erro ao obter coordenadas: ${error.message}`);
  }
}
