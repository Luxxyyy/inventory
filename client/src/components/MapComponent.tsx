import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import { addMapShape, getMapShapes } from '../api/mapShapes';

const MapComponent: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map('map', {
      center: [7.730655, 125.099958],
      zoom: 17,
    });
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: drawnItems,
      },
      draw: {
        polygon: {},
        polyline: {},
        rectangle: {},
        circle: {},
        marker: {},
        circlemarker: {},
      },
    });
    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, async (event: L.LeafletEvent) => {
      const createdEvent = event as L.DrawEvents.Created;
      const layer = createdEvent.layer;
      drawnItems.addLayer(layer);

      if ('toGeoJSON' in layer && typeof layer.toGeoJSON === 'function') {
        const geojson = layer.toGeoJSON();
        const radius = (layer as any).getRadius?.() || null;

        await addMapShape(geojson.geometry.type, geojson, radius);
      }
    });

    // Load existing shapes from DB
    const loadShapes = async () => {
      const shapes = await getMapShapes();
      shapes.forEach(({ geojson }) => {
        const layer = L.geoJSON(geojson);
        layer.addTo(drawnItems);
      });
    };

    loadShapes();
  }, []);

  return <div id="map" style={{ height: '600px', width: '100%' }} />;
};

export default MapComponent;
