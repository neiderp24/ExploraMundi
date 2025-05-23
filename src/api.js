import { API_URL } from "./config.js";

export const getCountries = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Error al obtener datos: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log("✅ Datos recibidos de la API:", data);
        return data;
    } catch (error) {
        console.error("❌ Error en la solicitud:", error);
    }
};
