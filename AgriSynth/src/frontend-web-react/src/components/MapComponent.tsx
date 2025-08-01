// Vitor h. Lemes

import React, { useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import L from 'leaflet';
import 'leaflet-draw';

// Importando os CSS necessários para o Leaflet e o plugin de desenho
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

// Corrigindo um problema comum do Leaflet com ícones padrão no React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;


interface MapComponentProps {
  onDrawComplete: (geometry: GeoJSON.FeatureCollection) => void;
  initialCenter?: [number, number];
}

const MapComponent: React.FC<MapComponentProps> = ({ onDrawComplete, initialCenter = [-18.73, -48.28] }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const drawnItems = useRef<L.FeatureGroup>(new L.FeatureGroup());

  useEffect(() => {
    if (mapInstance.current || !mapContainer.current) return; // Inicializa apenas uma vez

    // 1. Cria a instância do mapa
    mapInstance.current = L.map(mapContainer.current).setView(initialCenter, 13);

    // 2. Adiciona a camada de mapa (os "azulejos" visuais) do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstance.current);

    // 3. Adiciona a camada onde os desenhos do usuário ficarão
    mapInstance.current.addLayer(drawnItems.current);

    // 4. Configura e adiciona os controles de desenho
    const drawControl = new L.Control.Draw({
      draw: {
        polygon: {
          shapeOptions: { color: '#f48fb1' },
          allowIntersection: false,
          drawError: { color: 'orange', timeout: 1000 },
          showArea: true,
        },
        // Desativa outras ferramentas de desenho
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false,
      },
      edit: {
        featureGroup: drawnItems.current,
      }
    });
    mapInstance.current.addControl(drawControl);

    // 5. Event listener para quando um polígono é criado
    mapInstance.current.on(L.Draw.Event.CREATED, (e) => {
      const layer = e.layer;
      drawnItems.current.clearLayers(); // Limpa desenhos antigos
      drawnItems.current.addLayer(layer);
      
      // Converte o desenho para GeoJSON e envia para o componente pai
      const geoJson = drawnItems.current.toGeoJSON() as GeoJSON.FeatureCollection;
      onDrawComplete(geoJson);
    });

    // Event listener para quando um desenho é deletado
    mapInstance.current.on(L.Draw.Event.DELETED, () => {
        onDrawComplete({ type: 'FeatureCollection', features: [] });
    });

  }, []);

  return (
    <Box>
      <Box ref={mapContainer} sx={{ height: '500px', width: '100%', borderRadius: 1, zIndex: 0 }} />
    </Box>
  );
};

export default MapComponent;