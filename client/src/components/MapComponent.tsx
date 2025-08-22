import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import { addMapShape, getMapShapes, deleteMapShape } from "../api/mapShapes";

const MapComponent: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map("map", {
      center: [7.730655, 125.099958],
      zoom: 17,
    });
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
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

    // Load existing shapes from DB and add to map
    const loadShapes = async () => {
      try {
        const shapes = await getMapShapes();
        shapes.forEach(({ id, geojson }: any) => {
          const layer = L.geoJSON(geojson).getLayers()[0];
          if (layer) {
            (layer as any).dbId = id; // save DB id on layer
            drawnItems.addLayer(layer);
          }
        });
      } catch (error) {
        console.error("Error loading shapes:", error);
      }
    };
    loadShapes();

    // When user creates a new shape
    map.on(L.Draw.Event.CREATED, async (event: L.DrawEvents.Created) => {
      const layer = event.layer as
        | L.Circle
        | L.CircleMarker
        | L.Marker
        | L.Polygon
        | L.Polyline
        | L.Rectangle
        | L.Layer;

      drawnItems.addLayer(layer);

      let shapeType = "";
      let geojson: GeoJSON.Feature;
      let radius: number | null = null;

      if (layer instanceof L.Circle || layer instanceof L.CircleMarker) {
        shapeType = layer instanceof L.Circle ? "circle" : "circlemarker";
        geojson = layer.toGeoJSON();
        radius = layer.getRadius();
      } else if (layer instanceof L.Marker) {
        shapeType = "marker";
        geojson = layer.toGeoJSON();
      } else if (layer instanceof L.Polygon) {
        shapeType = "polygon";
        geojson = layer.toGeoJSON();
      } else if (layer instanceof L.Polyline) {
        shapeType = "polyline";
        geojson = layer.toGeoJSON();
      } else if (layer instanceof L.Rectangle) {
        shapeType = "rectangle";
        geojson = layer.toGeoJSON();
      } else {
        // fallback - assume geojson available
        geojson = (layer as any).toGeoJSON();
        shapeType = geojson.geometry.type;
      }

      try {
        const savedShape = await addMapShape(shapeType, geojson, radius);
        (layer as any).dbId = savedShape.id; // save DB id on layer for future edits/deletes
      } catch (error) {
        console.error("Error saving shape:", error);
      }
    });

    // When user deletes shapes
    map.on(L.Draw.Event.DELETED, async (event: L.DrawEvents.Deleted) => {
      const layersToDelete: number[] = [];
      event.layers.eachLayer((layer) => {
        const dbId = (layer as any).dbId;
        if (dbId) {
          layersToDelete.push(dbId);
        }
      });

      if (layersToDelete.length === 0) {
        console.warn("No dbId found on deleted layers.");
        return;
      }

      try {
        await Promise.all(layersToDelete.map((id) => deleteMapShape(id)));
        console.log("Deleted shapes from DB:", layersToDelete);
      } catch (error) {
        console.error("Error deleting shapes from DB:", error);
      }
    });
  }, []);

  return <div id="map" style={{ height: "600px", width: "100%" }} />;
};

export default MapComponent;
