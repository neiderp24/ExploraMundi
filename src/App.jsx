import React, { useState, useEffect, useRef } from "react";
import { getCountries } from "./api";
import SearchBar from "./components/SearchBar";
import GlobeComponent from "./components/GlobeComponent";
import CountryCardList from "./components/CountryCardList";
import CountryDetails from "./components/CountryDetails";
import RegionSelector from "./components/RegionSelector";
import SortSelector from "./components/SortSelector";

export default function App() {
  const [originalCountries, setOriginalCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [region, setRegion] = useState("global");
  const [selectedRegion, setSelectedRegion] = useState("global");
  const [sortOrder, setSortOrder] = useState("default");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [regionStats, setRegionStats] = useState(null);
  const globeRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [previousPage, setPreviousPage] = useState(1);
  const scrollPositionRef = useRef(0);

  const regionInfo = {
    "Africa": { name: "África" },
    "Americas": { name: "América" },
    "Asia": { name: "Asia" },
    "Europe": { name: "Europa" },
    "Oceania": { name: "Oceanía" },
    "Antarctica": { name: "Antártida" },
    "global": { name: "el mundo" }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getCountries();
        const updatedData = data.map(country =>
          country.name.common === "India" ? { ...country, population: 1428627663 } : country
        );
        setOriginalCountries(updatedData);
        setFilteredCountries(updatedData);
        updateRegionDescription("global", updatedData);
      } catch (error) {
        console.error("Error al cargar los datos de los países:", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    let data = [...originalCountries];

    if (region !== "global") {
      const selectedRegionName = regionInfo[region]?.name?.toLowerCase() || region.toLowerCase();

      if (selectedRegionName === "antártida") {
        data = data.filter((c) => {
          const r = c.region?.toLowerCase() || "";
          const sr = c.subregion?.toLowerCase() || "";
          const conts = (c.continents || []).map((cont) => cont.toLowerCase());

          return r.includes("antarctica") || sr.includes("antarctica") || conts.includes("antarctica");
        });
      } else {
        data = data.filter(
          (c) => c.region?.toLowerCase() === region.toLowerCase()
        );
      }
    }

    if (searchText.trim()) {
      data = data.filter((c) =>
        c.name.common.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if ((sortOrder === "asc" || sortOrder === "desc") && region === "global") {
      data = data.filter((c) => c.population > 0);
    }

    if (sortOrder === "asc") {
      data = [...data].sort((a, b) => (a.population || 0) - (b.population || 0));
    } else if (sortOrder === "desc") {
      data = [...data].sort((a, b) => (b.population || 0) - (a.population || 0));
    }

    if (sortOrder === "default") {
      data = data
        .map((item) => ({ ...item, sortKey: Math.random() }))
        .sort((a, b) => a.sortKey - b.sortKey)
        .map(({ ...item }) => item);
    }

    setFilteredCountries(data);
    updateRegionDescription(region, data);
  }, [searchText, region, sortOrder, originalCountries]);

  useEffect(() => {
    if (!selectedCountry) {
      window.scrollTo(0, scrollPositionRef.current);
    }
  }, [selectedCountry]);

  const updateRegionDescription = (selectedRegion, countries) => {
    const regionCountries = selectedRegion === "global"
      ? countries
      : countries.filter(c => c.region === selectedRegion || (selectedRegion === "Antarctica" && c.continents?.includes("Antarctica")));

    const totalPopulation = regionCountries.reduce((sum, country) => sum + (country.population || 0), 0);
    const officialCount = regionCountries.filter(c => c.unMember).length;
    const nonOfficialCount = regionCountries.length - officialCount;

    const mostPopulated = regionCountries.reduce((max, country) =>
      (country.population > max.population ? country : max),
      { population: 0, name: { common: "N/A" } });

    const leastPopulated = regionCountries.reduce((min, country) =>
      (country.population < min.population ? country : min),
      { population: Infinity, name: { common: "N/A" } });

    const totalArea = regionCountries.reduce((sum, country) => sum + (country.area || 0), 0);
    const density = totalArea > 0 ? (totalPopulation / totalArea).toFixed(2) : 0;

    const regionName = regionInfo[selectedRegion]?.name || "Región desconocida";

    const territories = selectedRegion === "Antarctica"
      ? regionCountries.map(country => ({
        name: country.name,
        translations: country.translations,
        population: country.population || 0
      }))
      : [];

    setRegionStats({
      name: regionName,
      totalPopulation,
      officialCount,
      nonOfficialCount,
      mostPopulated,
      leastPopulated,
      totalArea,
      density,
      territories,
      description: regionCountries.length === 0
        ? "Esta región no cuenta con países soberanos reconocidos por la API."
        : ""
    });
  };

  const handleSearchTextChange = (textOrCountry, skipFlyTo = false) => {
    scrollPositionRef.current = window.scrollY;

    if (typeof textOrCountry === "string") {
      const trimmedText = textOrCountry.trim();
      setSearchText(trimmedText);
      setSelectedCountry(null);

      let countryName = trimmedText;
      if (trimmedText.includes(",")) {
        const parts = trimmedText.split(",");
        countryName = parts[parts.length - 1].trim();
      }

      const country = originalCountries.find(
        (c) => c.name.common.toLowerCase() === countryName.toLowerCase()
      );

      if (country) {
        setPreviousPage(currentPage);
        setSelectedCountry(country);
        if (!skipFlyTo && globeRef.current && country.latlng) {
          const [lat, lon] = country.latlng;
          globeRef.current.flyToCountry(lat, lon);
        }
      } else {
        console.error("No se encontró el país:", countryName);
      }
    } else if (typeof textOrCountry === "object" && textOrCountry.name?.common) {
      setPreviousPage(currentPage);
      setSelectedCountry(textOrCountry);
      if (!skipFlyTo && globeRef.current && textOrCountry.latlng) {
        const [lat, lon] = textOrCountry.latlng;
        globeRef.current.flyToCountry(lat, lon);
      }
    } else {
      console.error("El valor recibido no es válido:", textOrCountry);
    }
  };

  const handleRegionChange = (region) => {
    setRegion(region);
    setSelectedRegion(region);
    setCurrentPage(1);
    setSearchText("");
    setSelectedCountry(null);
    if (globeRef.current) {
      globeRef.current.flyToRegion(region);
    }
  };

  const handleBack = () => {
    setSelectedCountry(null);
    setCurrentPage(previousPage);

    if (globeRef.current) {
      globeRef.current.flyToRegion(selectedRegion);
    }

    setTimeout(() => {
      window.scrollTo(0, scrollPositionRef.current);
    }, 100);
  };

  return (
    <div className="container-fluid p-0">
      <header
        className="py-3 text-center"
        style={{
          position: "sticky",
          top: 0,
          backgroundColor: "white",
          zIndex: 10,
          height: "80px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div className="container">
          <div>
            <h1 className="h3 fw-bold mb-0">Explorador de Regiones</h1>
            <p className="mb-0 small">Explora datos detallados sobre países y regiones del mundo.</p>
          </div>
          <div>
            <SearchBar
              searchTerm={searchText}
              onSearch={(text) => handleSearchTextChange(text, true)}
            />
          </div>
        </div>
      </header>

      <div
        className="row m-0 flex-md-row flex-column"
        style={{
          minHeight: "calc(100vh - 80px)",
        }}
      >
        <aside
          className="col-lg-4 col-md-5 col-12 bg-light overflow-auto order-2 order-md-1"
          id="left-panel"
          style={{
            height: "100%",
            flex: "0 0 35%",
            overflowY: "auto",
          }}
        >
          <div className="px-2 px-md-4 py-4 h-100">
            {!selectedCountry && (
              <>
                <div className="mb-4">
                  <SortSelector sortOrder={sortOrder} setSortOrder={setSortOrder} />
                </div>
                <div className="mb-4">
                  <RegionSelector
                    region={region}
                    setRegion={setRegion}
                    onRegionChange={handleRegionChange}
                    countries={originalCountries}
                    regionStats={regionStats}
                  />
                </div>
              </>
            )}

            {selectedCountry ? (
              <CountryDetails country={selectedCountry} onBack={handleBack} />
            ) : (
              <CountryCardList
                countries={filteredCountries}
                onCountryClick={handleSearchTextChange}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            )}
          </div>
        </aside>
        <main
          className="col-lg-8 col-md-7 col-12 p-0 order-1 order-md-2"
          id="right-panel"
          style={{
            position: "sticky",
            top: "80px", // se fija justo debajo del header
            height: "calc(100vh - 80px)",
            zIndex: 1,
            overflow: "hidden",
            flex: "0 0 65%",
          }}
        >
          <div
            className="position-relative w-100 h-100 pt-lg-4 pt-0"
            id="globe-container"
          >
            <GlobeComponent ref={globeRef} onCountrySelected={handleSearchTextChange} />
          </div>
        </main>

      </div>
    </div>
  );

}