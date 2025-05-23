import React, { useRef, useEffect, forwardRef, useImperativeHandle, useState } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

const GlobeComponent = forwardRef(({ onCountrySelected }, ref) => {
  const viewerRef = useRef(null);
  const viewerInstanceRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Detectar si es móvil o escritorio

  useEffect(() => {
    // Detectar cambios de tamaño de pantalla
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (viewerInstanceRef.current) return;

    const viewer = new Cesium.Viewer(viewerRef.current, {
      baseLayerPicker: true,
      animation: false,
      timeline: false,
      geocoder: true,
    });

    viewer.scene.globe.depthTestAgainstTerrain = true;
    viewerInstanceRef.current = viewer;

    // Mostrar mensaje flotante arriba del visor
    const showFloatingTip = () => {
      const container = viewerRef.current;
      if (!container) return;

      const tooltip = document.createElement("div");
      tooltip.innerHTML = `
        Para una mejor experiencia, selecciona la capa <strong>Bing Maps Aerial with Labels</strong>
        <div class="tooltip-arrow-wrapper">
          <div class="tooltip-arrow"></div>
        </div>
      `;
      tooltip.style.position = "absolute";
      tooltip.style.top = "55px";
      tooltip.style.right = "20px";
      tooltip.style.background = "rgba(188,239,247, 0.95)";
      tooltip.style.padding = "10px 16px";
      tooltip.style.borderRadius = "8px";
      tooltip.style.fontSize = "15px";
      tooltip.style.maxWidth = "92%";
      tooltip.style.textAlign = "center";
      tooltip.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)";
      tooltip.style.zIndex = 9999;
      tooltip.style.opacity = "1";
      tooltip.style.transition = "opacity 0.4s ease";

      const style = document.createElement("style");
      style.textContent = `
        .tooltip-arrow-wrapper {
          position: absolute;
          top: -10px;
          left: 92.5%;
          transform: translateX(-50%);
          animation: bounceUp 1s infinite ease-in-out;
        }
    
        .tooltip-arrow {
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-bottom: 10px solid rgba(255, 0, 0, 0.95);
        }
    
        @keyframes bounceUp {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-4px); }
        }
      `;
      document.head.appendChild(style);

      container.appendChild(tooltip);

      const handleClick = () => {
        tooltip.style.opacity = "0";
        setTimeout(() => {
          tooltip.remove();
          style.remove();
        }, 400);
        container.removeEventListener("click", handleClick);
      };

      container.addEventListener("click", handleClick);
    };

    showFloatingTip();

    viewer.geocoder.viewModel.complete.addEventListener(async () => {
      let searchText = viewer.geocoder.viewModel.searchText.trim();

      if (searchText.includes(",")) {
        const parts = searchText.split(",");
        searchText = parts[parts.length - 1].trim();
      }

      const country = await fetchCountryData(searchText);
      if (country) {
        onCountrySelected(country, true);
      }

      viewer.geocoder.viewModel.searchText = "";
    });

    return () => {
      if (viewerInstanceRef.current && !viewerInstanceRef.current.isDestroyed()) {
        viewerInstanceRef.current.destroy();
        viewerInstanceRef.current = null;
      }
    };
  }, []);

  const fetchCountryData = async (searchText) => {
    try {
      let response = await fetch(`https://restcountries.com/v3.1/name/${searchText}`);
      let data = await response.json();

      if (data && data.length > 0) {
        return data[0];
      }

      response = await fetch(`https://restcountries.com/v3.1/capital/${searchText}`);
      data = await response.json();

      if (data && data.length > 0) {
        return data[0];
      }

      return null;
    } catch (error) {
      console.error("Error al buscar datos del país o capital:", error);
      return null;
    }
  };

  useImperativeHandle(ref, () => ({
    flyToRegion: (region) => {
      const regionCoordinates = {
        global: { lat: 0, lon: 0, height: 25000000 },
        Africa: { lat: 0, lon: 20, height: 20000000 },
        Americas: { lat: 10, lon: -80, height: 20000000 },
        Asia: { lat: 30, lon: 100, height: 20000000 },
        Europe: { lat: 50, lon: 10, height: 20000000 },
        Oceania: { lat: -20, lon: 140, height: 20000000 },
        Antarctica: { lat: -90, lon: 0, height: 5000000 },
      };

      const coordinates = regionCoordinates[region];
      if (coordinates) {
        viewerInstanceRef.current.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(
            coordinates.lon,
            coordinates.lat,
            coordinates.height
          ),
          duration: 2.0,
        });
      } else {
        console.error(`Region "${region}" not found in regionCoordinates.`);
      }
    },

    flyToCountry: (lat, lon) => {
      viewerInstanceRef.current.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lon, lat, 1000000),
        duration: 2.0,
      });
    },
  }));

  return (
    <div
      ref={viewerRef}
      className="w-100 "
      style={{
        height: isMobile ? "50vh" : "80vh",
      }}
    />
  );
});

export default GlobeComponent;
