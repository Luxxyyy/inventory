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
import ShapeDetailsModal from "../ShapeDetailsModal";
import PipeHistoryModal from "./PipeHistoryModal";
import { ShapeDetails } from "../../types/mapShape_type";

const defaultDetails: ShapeDetails = {
  title: "",
  description: "",
  status: "",
  color: "",
  size: "",
};

const MapComponent2D: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);
  const drawnItems = useRef<L.FeatureGroup>(new L.FeatureGroup()).current;

  const [modalOpen, setModalOpen] = useState(false);
  const [editingLayer, setEditingLayer] = useState<L.Layer | null>(null);
  const [formData, setFormData] = useState(defaultDetails);
  const [isEditing, setIsEditing] = useState(false);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyShapeId, setHistoryShapeId] = useState<number | null>(null);

  // 🔹 helper to bind popup with edit + history events
  const bindShapePopup = (layer: any, data: ShapeDetails) => {
    layer.bindPopup(`
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

    layer.off("popupopen"); // prevent duplicate listeners
    layer.on("popupopen", (e: any) => {
      const popupEl = e.popup.getElement();
      if (!popupEl) return;

      const editBtn = popupEl.querySelector(".edit-btn");
      const historyBtn = popupEl.querySelector(".history-btn");

      if (editBtn) {
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
  };

  // Save or update shape
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

      // 🔹 Always re-bind popup after save
      bindShapePopup(editingLayer, data);

      toast.success(isEditing ? "Shape updated!" : "Shape saved!");
    } catch {
      toast.error(isEditing ? "Failed to update" : "Failed to save");
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

    const drawControl = new L.Control.Draw({ edit: { featureGroup: drawnItems } });
    map.addControl(drawControl);

    // Load saved shapes
    const loadShapes = async () => {
      try {
        const shapes = await getMapShapes();
        shapes.forEach(({ id, geojson, title, description, status, color, size }: any) => {
          const layer = L.geoJSON(geojson).getLayers()[0];
          if (layer) {
            (layer as any).dbId = id;
            (layer as any).metadata = { title, description, status, color, size };

            if (color && "setStyle" in layer)
              (layer as L.Path).setStyle({ color });

            // 🔹 bind popup with buttons
            bindShapePopup(layer, { title, description, status, color, size });

            drawnItems.addLayer(layer);
          }
        });
        toast.success("Shapes loaded");
      } catch {
        toast.error("Failed to load shapes");
      }
    };
    loadShapes();

    // Handle create
    map.on(L.Draw.Event.CREATED, (e: any) => {
      drawnItems.addLayer(e.layer);
      setEditingLayer(e.layer);
      setFormData(defaultDetails);
      setIsEditing(false);
      setModalOpen(true);
    });

    // Handle edit
    map.on(L.Draw.Event.EDITED, (e: any) => {
      e.layers.eachLayer((lyr: any) => {
        setEditingLayer(lyr);
        setFormData(lyr.metadata || defaultDetails);
        setIsEditing(true);
        setModalOpen(true);
      });
    });

    // Handle delete
    map.on(L.Draw.Event.DELETED, async (e: any) => {
      const ids: number[] = [];
      e.layers.eachLayer((lyr: any) => lyr.dbId && ids.push(lyr.dbId));
      try {
        await Promise.all(ids.map((id) => deleteMapShape(id)));
        toast.success("Shape(s) deleted");
      } catch {
        toast.error("Failed to delete shape(s)");
      }
    });
  }, []);

  return (
    <>
      <ToastContainer />
      <div id="map" style={{ height: "600px" }} />
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
