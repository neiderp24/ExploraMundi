import React from "react";

const regionInfo = {
    "Africa": {
        name: "África",
        description: "África es el segundo continente más grande, con una gran diversidad cultural y una gran riqueza natural. Es la cuna de la humanidad.",
    },
    "Americas": {
        name: "América",
        description: "América se extiende desde el Ártico hasta la Antártida, con una gran variedad de climas, culturas y ecosistemas.",
    },
    "Asia": {
        name: "Asia",
        description: "Asia es el continente más grande y poblado del mundo. Alberga algunas de las civilizaciones más antiguas, como China e India.",
    },
    "Europe": {
        name: "Europa",
        description: "Europa es el continente de la historia y la cultura. Hogar del Renacimiento, la Revolución Industrial y muchas civilizaciones antiguas.",
    },
    "Oceania": {
        name: "Oceanía",
        description: "Oceanía está formada por miles de islas, desde Australia hasta la Polinesia. Es famosa por sus paisajes paradisíacos y su biodiversidad.",
    },
    "Antarctica": {
        name: "Antártida",
        description: "La Antártida es el continente más frío y remoto del planeta. Es un desierto helado cubierto de hielo, hogar de pingüinos y otros animales adaptados al frío extremo.",
    }
};

export default function RegionSelector({ region, setRegion, onRegionChange, regionStats }) {
    const handleRegionChange = (e) => {
        const selectedRegion = e.target.value;
        setRegion(selectedRegion);
        onRegionChange(selectedRegion);
    };

    return (
        <div className="mb-3">
            <div>
                <label htmlFor="region" className="form-label">Seleccionar region:</label>
                <select
                    id="region"
                    className="form-select"
                    value={region}
                    onChange={handleRegionChange}
                >
                    <option value="global">Global</option>
                    <option value="Africa">Africa</option>
                    <option value="Americas">Americas</option>
                    <option value="Asia">Asia</option>
                    <option value="Europe">Europe</option>
                    <option value="Oceania">Oceania</option>
                    <option value="Antarctica">Antarctica</option>
                </select>
            </div>

            {regionStats && (
                <div className="mt-3 p-3 bg-light rounded">
                    <p><strong>Descripción:</strong> {regionInfo[region]?.description}</p>
                    {region === "global" ? (
                        (() => {
                            const { officialCount, nonOfficialCount, totalPopulation, mostPopulated } = regionStats;
                            return (
                                <p dangerouslySetInnerHTML={{
                                    __html: `🌍 En el mundo existen <strong>${officialCount}</strong> países oficialmente reconocidos y 
                        <strong>${nonOfficialCount}</strong> territorios sin soberanía total. La población mundial alcanza los 
                        <strong>${totalPopulation.toLocaleString()}</strong> habitantes. El país más poblado es: 
                        <strong>${mostPopulated.name?.common}</strong> con 
                        <strong>${mostPopulated.population?.toLocaleString()}</strong> habitantes.`
                                }} />
                            );
                        })()
                    ) : region === "Antarctica" ? (
                        (() => {
                            return (
                                <p dangerouslySetInnerHTML={{
                                    __html: `
                                        <strong>${regionStats.name}</strong> es una región única, sin países soberanos oficialmente reconocidos. 
                                        Está compuesta por varios territorios administrados por diferentes países bajo el Tratado Antártico. 
                                        Su población es principalmente científica y varía según la temporada, alcanzando un aproximado de 
                                        <strong>${regionStats.totalPopulation.toLocaleString()}</strong> habitantes en verano.<br>
                                        Los territorios destacados incluyen: 
                                        <ul>
                                            ${regionStats.territories
                                            .filter(territory => territory.population > 0)
                                            .map(territory => `
                                                    <li>
                                                        <strong>${territory.translations?.spa?.common || territory.name?.common}</strong> 
                                                        (con una población de <strong>${territory.population.toLocaleString()}</strong> habitantes)
                                                    </li>
                                                `).join("")}
                                        </ul>
                                        ${regionStats.territories.some(territory => territory.population === 0)
                                            ? `
                                                    <p>Además, los siguientes territorios no tienen registros de población:</p>
                                                    <ul>
                                                        ${regionStats.territories
                                                .filter(territory => territory.population === 0)
                                                .map(territory => `
                                                                <li>
                                                                    <strong>${territory.translations?.spa?.common || territory.name?.common}</strong>
                                                                </li>
                                                            `).join("")}
                                                    </ul>
                                                `
                                            : ""
                                        }
                                    `
                                }} />
                            );
                        })()
                    ) : (
                        (() => {
                            return (
                                <p dangerouslySetInnerHTML={{
                                    __html: `
                            <strong>${regionStats.name}</strong> está compuesta por <strong>${regionStats.officialCount}</strong> países oficialmente reconocidos y 
                            <strong>${regionStats.nonOfficialCount}</strong> territorios que no son soberanos o no cuentan con reconocimiento internacional. 
                            Su población total es de <strong>${regionStats.totalPopulation.toLocaleString()}</strong> habitantes en un área de 
                            <strong>${regionStats.totalArea.toLocaleString()}</strong> km² y una densidad de población de 
                            <strong>${regionStats.density}</strong> hab/km².<br> 
                            El país más poblado de ${regionStats.name} es <strong>${regionStats.mostPopulated.translations?.spa?.common || regionStats.mostPopulated.name?.common}</strong> 
                            (con <strong>${regionStats.mostPopulated.population.toLocaleString()}</strong> habitantes).<br> 
                            El país menos poblado de ${regionStats.name} es <strong>${regionStats.leastPopulated.translations?.spa?.common || regionStats.leastPopulated.name?.common}</strong> 
                            (con <strong>${regionStats.leastPopulated.population.toLocaleString()}</strong> habitantes).<br> 
                            ${regionStats.description || ""}
                        `
                                }} />
                            );
                        })()
                    )}
                </div>
            )}
        </div>
    );
}