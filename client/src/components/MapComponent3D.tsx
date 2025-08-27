import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Polyline,
  Polygon,
  InfoWindow,
} from "@react-google-maps/api";
import { getMapShapes } from "../api/mapShape";
import { MapShape } from "../types/mapShape_type";

type CenterType = {
  latitude?: string;
  longitude?: string;
};

type Props = {
  center?: CenterType | null;
};

const containerStyle = {
  width: "100%",
  height: "600px",
};

const defaultCenter = {
  lat: 7.731782,
  lng: 125.099118,
};

const MapComponent3D: React.FC<Props> = ({ center }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [shapes, setShapes] = useState<MapShape[]>([]);
  const [selectedShape, setSelectedShape] = useState<MapShape | null>(null);
  const [infoWindowPos, setInfoWindowPos] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  useEffect(() => {
    getMapShapes().then(setShapes).catch(console.error);
  }, []);

  useEffect(() => {
    if (center && center.latitude && center.longitude) {
      setMapCenter({
        lat: Number(center.latitude),
        lng: Number(center.longitude),
      });
    }
  }, [center]);

  // Helper to get InfoWindow position for lines/polygons
  const getMidPoint = (coordinates: number[][]) => {
    if (!coordinates.length) return mapCenter;
    const midIdx = Math.floor(coordinates.length / 2);
    const [lng, lat] = coordinates[midIdx];
    return { lat, lng };
  };

  // Helper for polygons (get centroid)
  const getPolygonCentroid = (coordinates: number[][]) => {
    let latSum = 0, lngSum = 0;
    coordinates.forEach(([lng, lat]) => {
      latSum += lat;
      lngSum += lng;
    });
    return {
      lat: latSum / coordinates.length,
      lng: lngSum / coordinates.length,
    };
  };

  return isLoaded ? (
    <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={17}>
      {/* Marker for selected center */}
      {center && center.latitude && center.longitude && (
        <Marker position={{ lat: Number(center.latitude), lng: Number(center.longitude) }} />
      )}

      {/* Render shapes from database */}
      {shapes.map((shape, idx) => {
        const { geojson, title, description, status, color } = shape;
        if (!geojson?.geometry) return null;

        // Point
        if (geojson.geometry.type === "Point") {
          const [lng, lat] = geojson.geometry.coordinates;
          return (
            <Marker
              key={idx}
              position={{ lat, lng }}
              onClick={() => {
                setSelectedShape(shape);
                setInfoWindowPos({ lat, lng });
              }}
              icon={
                color
                  ? {
                      url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/></svg>`,
                      scaledSize: { width: 24, height: 24 },
                    }
                  : undefined
              }
            />
          );
        }

        // MultiPoint
        if (geojson.geometry.type === "MultiPoint") {
          return geojson.geometry.coordinates.map(([lng, lat]: number[], i: number) => (
            <Marker
              key={`${idx}-mp-${i}`}
              position={{ lat, lng }}
              onClick={() => {
                setSelectedShape(shape);
                setInfoWindowPos({ lat, lng });
              }}
              icon={
                color
                  ? {
                      url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/></svg>`,
                      scaledSize: { width: 24, height: 24 },
                    }
                  : undefined
              }
            />
          ));
        }

        // LineString
        if (geojson.geometry.type === "LineString") {
          const path = geojson.geometry.coordinates.map(([lng, lat]: number[]) => ({
            lat,
            lng,
          }));
          return (
            <Polyline
              key={idx}
              path={path}
              options={{
                strokeColor: color || "#28a745",
                strokeWeight: 6,
              }}
              onClick={() => {
                setSelectedShape(shape);
                setInfoWindowPos(getMidPoint(geojson.geometry.coordinates));
              }}
            />
          );
        }

        // MultiLineString
        if (geojson.geometry.type === "MultiLineString") {
          return geojson.geometry.coordinates.map((line: number[][], i: number) => {
            const path = line.map(([lng, lat]: number[]) => ({
              lat,
              lng,
            }));
            return (
              <Polyline
                key={`${idx}-mls-${i}`}
                path={path}
                options={{
                  strokeColor: color || "#28a745",
                  strokeWeight: 6,
                }}
                onClick={() => {
                  setSelectedShape(shape);
                  setInfoWindowPos(getMidPoint(line));
                }}
              />
            );
          });
        }

        // Polygon
        if (geojson.geometry.type === "Polygon") {
          // Google Maps expects array of arrays of LatLng
          const paths = geojson.geometry.coordinates.map((ring: number[][]) =>
            ring.map(([lng, lat]: number[]) => ({ lat, lng }))
          );
          // Use centroid of first ring for InfoWindow
          const centroid = getPolygonCentroid(geojson.geometry.coordinates[0]);
          return (
            <Polygon
              key={idx}
              paths={paths}
              options={{
                strokeColor: color || "#28a745",
                fillColor: color || "#28a745",
                fillOpacity: 0.3,
                strokeWeight: 4,
              }}
              onClick={() => {
                setSelectedShape(shape);
                setInfoWindowPos(centroid);
              }}
            />
          );
        }

        // MultiPolygon
        if (geojson.geometry.type === "MultiPolygon") {
          return geojson.geometry.coordinates.map((poly: number[][][], i: number) => {
            const paths = poly.map((ring: number[][]) =>
              ring.map(([lng, lat]: number[]) => ({ lat, lng }))
            );
            const centroid = getPolygonCentroid(poly[0]);
            return (
              <Polygon
                key={`${idx}-mpoly-${i}`}
                paths={paths}
                options={{
                  strokeColor: color || "#28a745",
                  fillColor: color || "#28a745",
                  fillOpacity: 0.3,
                  strokeWeight: 4,
                }}
                onClick={() => {
                  setSelectedShape(shape);
                  setInfoWindowPos(centroid);
                }}
              />
            );
          });
        }

        return null;
      })}

      {selectedShape && infoWindowPos && (
        <InfoWindow
          position={infoWindowPos}
          onCloseClick={() => {
            setSelectedShape(null);
            setInfoWindowPos(null);
          }}
        >
          <div style={{ minWidth: 180 }}>
            <strong>{selectedShape.title || "No Title"}</strong>
            <div>{selectedShape.description}</div>
            <div>Status: {selectedShape.status}</div>
            {/* Add more details if needed */}
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  ) : (
    <p>Loading Map...</p>
  );
};

export default MapComponent3D;