import React, { useEffect, useRef } from "react";

const CountryDetails = ({ country, onBack }) => {
    const detailsRef = useRef(null); // Referencia al contenedor principal

    // Mapeo de días de la semana en inglés a español
    const weekDaysInSpanish = {
        monday: "lunes",
        tuesday: "martes",
        wednesday: "miércoles",
        thursday: "jueves",
        friday: "viernes",
        saturday: "sábado",
        sunday: "domingo",
    };

    // Mapeo de regiones al español
    const regionTranslations = {
        Africa: "África",
        Americas: "Américas",
        Asia: "Asia",
        Europe: "Europa",
        Oceania: "Oceanía",
        Antarctic: "Antártida",
    };

    // Desplazar hacia la parte superior al renderizar
    useEffect(() => {
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "auto" });
        }, 0); // sin retardo
    }, []);

    return (
        <div ref={detailsRef}>
            <div className="country-details bg-info bg-opacity-50 p-3 rounded shadow-sm">
                <h2>{country.translations?.spa?.common || country.name.common}</h2>
                <img
                    src={country.flags.svg}
                    alt={`Bandera de ${country.translations?.spa?.common || country.name.common}`}
                    width="200"
                />
                {!country.unMember && (
                    <p className="text-danger">
                        <strong>No es un país oficialmente reconocido</strong>
                    </p>
                )}
                <p>
                    <strong>Nombre oficial:</strong>{" "}
                    {country.translations?.spa?.official || country.name.official}
                </p>
                <p>
                    <strong>Capital:</strong> {country.capital?.[0] || "No disponible"}
                </p>
                <p>
                    <strong>Región:</strong> {regionTranslations[country.region] || country.region}
                </p>
                <p>
                    <strong>Subregión:</strong> {country.subregion || "No disponible"}
                </p>
                <p>
                    <strong>Continente:</strong> {country.continents?.[0]}
                </p>
                <p>
                    <strong>Población:</strong> {country.population.toLocaleString()}
                </p>
                <p>
                    <strong>Área:</strong> {country.area.toLocaleString()} km²
                </p>
                <p>
                    <strong>Idiomas:</strong>{" "}
                    {country.languages ? Object.values(country.languages).join(", ") : "No disponible"}
                </p>
                <p>
                    <strong>Moneda:</strong>{" "}
                    {country.currencies
                        ? Object.values(country.currencies)
                            .map((currency) => `${currency.name} (${currency.symbol})`)
                            .join(", ")
                        : "No disponible"}
                </p>
                <p>
                    <strong>Zona horaria:</strong> {country.timezones?.join(", ")}
                </p>
                <p>
                    <strong>Gentilicio:</strong>{" "}
                    {country.demonyms?.eng?.m || "No disponible"}
                </p>
                <p>
                    <strong>Fronteras:</strong>{" "}
                    {country.borders ? country.borders.join(", ") : "No tiene fronteras"}
                </p>
                <p>
                    <strong>Dominio de nivel superior:</strong> {country.tld?.join(", ")}
                </p>
                <p>
                    <strong>Código numérico:</strong> {country.ccn3}
                </p>
                <p>
                    <strong>Inicio de la semana:</strong>{" "}
                    {weekDaysInSpanish[country.startOfWeek] || "No disponible"}
                </p>
                <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(
                        country.translations?.spa?.common || country.name.common
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-success mt-3"
                >
                    Buscar en la web
                </a>
            </div>
            <button className="mt-4 mb-4 btn btn-success" onClick={onBack}>
                Volver
            </button>
        </div>
    );
};

export default CountryDetails;