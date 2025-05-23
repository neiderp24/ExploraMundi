import React, { useRef, useEffect } from "react";
import CountryCard from "./CountryCard";

const COUNTRIES_PER_PAGE = 12;

export default function CountryCardList({ countries, onCountryClick, currentPage, setCurrentPage }) {
    const topRef = useRef(null);

    // Hacer scroll al topRef cuando cambia la página
    useEffect(() => {
        if (topRef.current) {
            const element = topRef.current;
            const header = document.querySelector("header");
            const headerHeight = header ? header.offsetHeight : 80;

            const isMobile = window.innerWidth <= 600;

            // Offset móvil = 40% de la altura viewport + 100 px extra para subir más
            const mobileOffset = isMobile ? window.innerHeight * 0.4 + 100 : 20;

            const elementRect = element.getBoundingClientRect();
            const currentScroll = window.pageYOffset;
            const desiredScroll = currentScroll + elementRect.top - headerHeight - mobileOffset;

            window.scrollTo({ top: desiredScroll, behavior: "smooth" });
        }
    }, [currentPage]);

    // Calcular países para la página actual
    const totalPages = Math.ceil(countries.length / COUNTRIES_PER_PAGE);
    const currentCountries = countries.slice(
        (currentPage - 1) * COUNTRIES_PER_PAGE,
        currentPage * COUNTRIES_PER_PAGE
    );

    return (
        <div>
            {/* Colocar el ref al inicio */}
            <div ref={topRef}></div>

            <div className="row mt-4 g-3 d-flex align-items-stretch">
                {currentCountries.map((country) => (
                    <CountryCard
                        key={country.cca3}
                        country={country}
                        onClick={() => onCountryClick(country, false)}
                    />
                ))}
            </div>

            {/* Paginación */}
            <div className="pagination m-4 d-flex justify-content-center pb-4">
                <button
                    className="btn btn-success"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Anterior
                </button>
                <span className="mx-2">
                    Página {currentPage} de {totalPages}
                </span>
                <button
                    className="btn btn-success"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}