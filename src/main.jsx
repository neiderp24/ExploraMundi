import * as Cesium from 'cesium';
import { CESIUM_TOKEN } from './cesium-config';
import "bootstrap/dist/css/bootstrap.min.css";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import "cesium/Build/Cesium/Widgets/widgets.css";

// Configuración global crítica
window.Cesium = Cesium;
Cesium.Ion.defaultAccessToken = CESIUM_TOKEN;

// Verificación del token
if (!CESIUM_TOKEN || CESIUM_TOKEN.includes('aquí_va_tu_token')) {
  console.error('ERROR: Token de Cesium Ion no configurado correctamente');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);