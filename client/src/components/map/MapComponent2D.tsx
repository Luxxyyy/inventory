import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import {
  addMapShape,
  getMapShapes,
  deleteMapShape,
  updateMapShape,
} from "../../api/mapShape";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShapeDetailsModal from "./ShapeDetailsModal";
import PipeHistoryModal from "./PipeHistoryModal";
import { ShapeDetails } from "../../types/mapShape_type";
import { useAuth } from "../../contexts/AuthContext"; // <-- Make sure this is correctly pointing to your context

const defaultDetails: ShapeDetails = {
  title: "",
  description: "",
  status: "",
  color: "",
  size: "",
};

type CustomLayer = L.Layer & {
  dbId?: number;
  metadata?: ShapeDetails;
};

type CenterType = {
  latitude?: string;
  longitude?: string;
};

const MapComponent2D: React.FC<{ center?: CenterType | null }> = ({ center }) => {
  const mapRef = useRef<L.Map | null>(null);
  const drawnItems = useRef<L.FeatureGroup>(new L.FeatureGroup()).current;
  const markerRef = useRef<L.Marker | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingLayer, setEditingLayer] = useState<CustomLayer | null>(null);
  const [formData, setFormData] = useState(defaultDetails);
  const [isEditing, setIsEditing] = useState(false);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyShapeId, setHistoryShapeId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);

  const { user } = useAuth(); // <-- Required to check role

  const createColoredMarker = React.useCallback(
    (color: string) =>
      L.divIcon({
        className: "custom-marker",
        html: `<div style="background:${color}; width:16px; height:16px; border-radius:50%; border:2px solid white;"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      }),
    []
  );

  const handleSave = async (data: typeof defaultDetails) => {
    if (!editingLayer) return;
    const geojson = editingLayer.toGeoJSON();
    const radius =
      "getRadius" in editingLayer ? (editingLayer as any).getRadius() : null;
    const type = geojson.geometry.type;
    const payload = { type, geojson, radius, ...data };

    try {
      let saved;
      if (isEditing) {
        saved = await updateMapShape((editingLayer as any).dbId, payload);
      } else {
        saved = await addMapShape(
          type,
          geojson,
          radius,
          data.title,
          data.description,
          data.status,
          data.color,
          data.size
        );
      }
      (editingLayer as any).dbId = saved.id;
      (editingLayer as any).metadata = payload;

      if (editingLayer instanceof L.Marker && data.color) {
        editingLayer.setIcon(createColoredMarker(data.color));
      } else if ("setStyle" in editingLayer && data.color) {
        (editingLayer as L.Path).setStyle({ color: data.color });
      }

      editingLayer.bindPopup(`
        <div>
          <strong>${data.title || "Untitled"}</strong><br/>
          ${data.description || ""}<br/>
          <em>Status:</em> ${data.status || "N/A"}<br/>
          <em>Size:</em> ${data.size || "N/A"}<br/>
          <div class="mt-2 d-flex gap-2">
            <button class="btn btn-sm btn-primary edit-btn">Edit</button>
            <button class="btn btn-sm btn-dark history-btn">History</button>
          </div>
        </div>
      `);

      toast.success(isEditing ? "Shape updated!" : "Shape saved!");
    } catch (err: any) {
      toast.error((isEditing ? "Failed to update: " : "Failed to save: ") + (err?.message || ""));
    } finally {
      setModalOpen(false);
      setEditingLayer(null);
      setFormData(defaultDetails);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (mapRef.current) return;
    const map = L.map("map", { center: [7.730655, 125.099958], zoom: 17 });
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
    map.addLayer(drawnItems);

    if (user?.role === "admin") {
      const drawControl = new L.Control.Draw({
        edit: { featureGroup: drawnItems },
      });
      map.addControl(drawControl);
    }

    const loadShapes = async () => {
      setLoading(true);
      try {
        const shapes = await getMapShapes();
        shapes.forEach(({ id, geojson, title, description, status, color, size }: any) => {
          const layer = L.geoJSON(geojson).getLayers()[0] as CustomLayer;
          if (layer) {
            layer.dbId = id;
            layer.metadata = { title, description, status, color, size };

            if (layer instanceof L.Marker && color) {
              (layer as L.Marker).setIcon(createColoredMarker(color));
            } else if (color && "setStyle" in layer) {
              (layer as L.Path).setStyle({ color });
            }

            layer.bindPopup(`
              <div>
                <strong>${title || "Untitled"}</strong><br/>
                ${description || ""}<br/>
                <em>Status:</em> ${status || "N/A"}<br/>
                <em>Size:</em> ${size || "N/A"}<br/>
                <div class="mt-2 d-flex gap-2">
                  <button class="btn btn-sm btn-primary edit-btn">Edit</button>
                  <button class="btn btn-sm btn-dark history-btn">History</button>
                </div>
              </div>
            `);

            layer.on("popupopen", (e) => {
              const popupEl = e.popup.getElement();
              if (!popupEl) return;

              const editBtn = popupEl.querySelector(".edit-btn");
              const historyBtn = popupEl.querySelector(".history-btn");

              if (editBtn && user?.role === "admin") {
                L.DomEvent.on(editBtn, "click", () => {
                  setEditingLayer(layer);
                  setFormData(layer.metadata || defaultDetails);
                  setIsEditing(true);
                  setModalOpen(true);
                });
              }

              if (historyBtn) {
                L.DomEvent.on(historyBtn, "click", () => {
                  setHistoryShapeId(layer.dbId);
                  setHistoryOpen(true);
                });
              }
            });

            drawnItems.addLayer(layer);
          }
        });
        toast.success("Shapes loaded");
      } catch (err: any) {
        toast.error("Failed to load shapes: " + (err?.message || ""));
      } finally {
        setLoading(false);
      }
    };

    loadShapes();

    if (user?.role === "admin") {
      map.on(L.Draw.Event.CREATED, (e: any) => {
        drawnItems.addLayer(e.layer);
        setEditingLayer(e.layer);
        setFormData(defaultDetails);
        setIsEditing(false);
        setModalOpen(true);
      });

      map.on(L.Draw.Event.EDITED, (e: any) => {
        e.layers.eachLayer((lyr: CustomLayer) => {
          setEditingLayer(lyr);
          setFormData(lyr.metadata || defaultDetails);
          setIsEditing(true);
          setModalOpen(true);
        });
      });

      map.on(L.Draw.Event.DELETED, async (e: any) => {
        const ids: number[] = [];
        e.layers.eachLayer((lyr: CustomLayer) => lyr.dbId && ids.push(lyr.dbId));
        try {
          await Promise.all(ids.map((id) => deleteMapShape(id)));
          toast.success("Shape(s) deleted");
        } catch (err: any) {
          toast.error("Failed to delete shape(s): " + (err?.message || ""));
        }
      });
    }
  }, [createColoredMarker, user]);

  useEffect(() => {
    if (center && mapRef.current && center.latitude && center.longitude) {
      const lat = Number(center.latitude);
      const lng = Number(center.longitude);
      mapRef.current.setView([lat, lng], 17);

      if (markerRef.current) {
        mapRef.current.removeLayer(markerRef.current);
      }

      markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);
    }
  }, [center]);

  return (
    <>
      <ToastContainer />
      {loading && <div className="loading-indicator">Loading map shapes...</div>}
      <div id="map" style={{ height: "100%", minHeight: "400px", width: "100%", maxWidth: "100vw" }} />
      <ShapeDetailsModal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={formData}
      />
      <PipeHistoryModal
        shapeId={historyShapeId}
        show={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />
    </>
  );
};

export default MapComponent2D;
