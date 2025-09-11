// src/components/map/MapComponent3D.tsx
import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Polyline,
  Polygon,
  InfoWindow,
} from "@react-google-maps/api";
import { getMapShapes } from "../../api/mapShape";
import { MapShape } from "../../types/mapShape_type";

type CenterType = {
  latitude?: string;
  longitude?: string;
};

type Props = {
  center?: CenterType | null;
};

const containerStyle = {
  width: "100%",
  height: "100%",
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
    getMapShapes()
      .then((res) => setShapes(Array.isArray(res) ? res : []))
      .catch((err) => {
        console.error(err);
        setShapes([]);
      });
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
    let latSum = 0,
      lngSum = 0;
    coordinates.forEach(([lng, lat]) => {
      latSum += lat;
      lngSum += lng;
    });
    return {
      lat: latSum / coordinates.length,
      lng: lngSum / coordinates.length,
    };
  };

  // create a properly-typed icon if google maps is available
  const createSvgIcon = (color?: string) => {
    if (!color) return undefined;
    try {
      const svg = encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/></svg>`
      );
      // window.google may not be available at compile-time; guard and cast
      const g = (window as any).google;
      if (g && g.maps && typeof g.maps.Size === "function" && typeof g.maps.Point === "function") {
        return {
          url: `data:image/svg+xml;utf8,${svg}`,
          scaledSize: new g.maps.Size(24, 24),
          anchor: new g.maps.Point(12, 12),
        } as any;
      }
      // Fallback: return a URL-only icon (some typings might still complain so we cast)
      return { url: `data:image/svg+xml;utf8,${svg}` } as any;
    } catch (err) {
      console.error("createSvgIcon error", err);
      return undefined;
    }
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

        const geom: any = geojson.geometry;

        // Point
        if (geom.type === "Point") {
          const [lng, lat] = geom.coordinates as number[];
          return (
            <Marker
              key={idx}
              position={{ lat, lng }}
              onClick={() => {
                setSelectedShape(shape);
                setInfoWindowPos({ lat, lng });
              }}
              icon={createSvgIcon(color)}
            />
          );
        }

        // MultiPoint
        if (geom.type === "MultiPoint") {
          return geom.coordinates.map(([lng, lat]: number[], i: number) => (
            <Marker
              key={`${idx}-mp-${i}`}
              position={{ lat, lng }}
              onClick={() => {
                setSelectedShape(shape);
                setInfoWindowPos({ lat, lng });
              }}
              icon={createSvgIcon(color)}
            />
          ));
        }

        // LineString
        if (geom.type === "LineString") {
          const path = geom.coordinates.map(([lng, lat]: number[]) => ({ lat, lng }));
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
                setInfoWindowPos(getMidPoint(geom.coordinates));
              }}
            />
          );
        }

        // MultiLineString
        if (geom.type === "MultiLineString") {
          return geom.coordinates.map((line: number[][], i: number) => {
            const path = line.map(([lng, lat]: number[]) => ({ lat, lng }));
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
        if (geom.type === "Polygon") {
          const paths = geom.coordinates.map((ring: number[][]) => ring.map(([lng, lat]: number[]) => ({ lat, lng })));
          const centroid = getPolygonCentroid(geom.coordinates[0]);
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
        if (geom.type === "MultiPolygon") {
          return geom.coordinates.map((poly: number[][][], i: number) => {
            const paths = poly.map((ring: number[][]) => ring.map(([lng, lat]: number[]) => ({ lat, lng })));
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
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  ) : (
    <p>Loading Map...</p>
  );
};

export default MapComponent3D;
