// src/components/map/MapComponent2D.tsx
import React, { useEffect, useRef, useState, useCallback } from "react";
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
import {
  addNote,
  getNotes,
} from "../../api/note";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShapeDetailsModal from "./ShapeDetailsModal";
import PipeHistoryModal from "./PipeHistoryModal";
import NoteModal from "./NoteModal";
import { ShapeDetails } from "../../types/mapShape_type";
import "../../design/map.css";
import { useAuth } from "../../contexts/AuthContext";
import { RiStickyNoteAddLine } from "react-icons/ri";
import { createRoot } from "react-dom/client";

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
  const notesLayer = useRef<L.FeatureGroup>(new L.FeatureGroup()).current;
  const markerRef = useRef<L.Marker | null>(null);

  const [shapeModalOpen, setShapeModalOpen] = useState(false);
  const [editingLayer, setEditingLayer] = useState<CustomLayer | null>(null);
  const [formData, setFormData] = useState(defaultDetails);
  const [isEditing, setIsEditing] = useState(false);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyShapeId, setHistoryShapeId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);

  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [noteCoords, setNoteCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const { user } = useAuth();
  const isCreatingNoteRef = useRef(isCreatingNote);

  useEffect(() => {
    isCreatingNoteRef.current = isCreatingNote;
  }, [isCreatingNote]);

  const createColoredMarker = useCallback(
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

    const geojson = (editingLayer as any)?.toGeoJSON ? (editingLayer as any).toGeoJSON() : null;
    const radius = typeof (editingLayer as any)?.getRadius === "function" ? (editingLayer as any).getRadius() : null;
    const type = geojson?.geometry?.type ?? "Unknown";
    const payload = { type, geojson, radius, ...data };

    try {
      let saved: any;
      if (isEditing) {
        saved = await updateMapShape((editingLayer as any).dbId, payload);
      } else {
        saved = await (addMapShape as any)(
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

      (editingLayer as any).dbId = saved?.id ?? (editingLayer as any).dbId;
      (editingLayer as any).metadata = payload;

      if (editingLayer instanceof L.Marker && data.color) {
        (editingLayer as L.Marker).setIcon(createColoredMarker(data.color));
      } else if (data.color && "setStyle" in editingLayer) {
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
      console.error(err);
      toast.error((isEditing ? "Failed to update: " : "Failed to save: ") + (err?.message || ""));
    } finally {
      setShapeModalOpen(false);
      setEditingLayer(null);
      setFormData(defaultDetails);
      setIsEditing(false);
    }
  };

  const handleSaveNote = async (data: {
    title: string;
    message: string;
    image: string | null;
    latitude: number;
    longitude: number;
  }) => {
    try {
      const savedNote = await addNote(data);
      if (savedNote) {
        if (!savedNote.isDone) {
          const newNoteMarker = L.marker([savedNote.latitude, savedNote.longitude], {
            icon: L.icon({
              iconUrl: "https://cdn-icons-png.flaticon.com/512/3208/3208573.png",
              iconSize: [32, 32],
              iconAnchor: [16, 32],
              popupAnchor: [0, -25],
            }),
          });
          
          let popupContent = `
            <div>
              <strong>${savedNote.title || "Untitled Note"}</strong><br/>
              ${savedNote.message || ""}<br/>
              <em>By:</em> ${user?.username || "N/A"}<br/>
          `;

          if (savedNote.image) {
            popupContent += `<img src="${savedNote.image}" alt="Note Image" style="max-width: 100%; height: auto; margin-top: 10px;" />`;
          }

          popupContent += "</div>";

          newNoteMarker.bindPopup(popupContent);
          notesLayer.addLayer(newNoteMarker);
        }

        toast.success("Note saved!");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to save note: " + (err?.message || ""));
    } finally {
      setNoteModalOpen(false);
      setNoteCoords(null);
    }
  };

  useEffect(() => {
    if (mapRef.current) return;
    const map = L.map("map", { center: [7.730655, 125.099958], zoom: 17 });
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
    map.addLayer(drawnItems);
    map.addLayer(notesLayer);

    if (user?.role === "admin") {
      const drawControl = new L.Control.Draw({
        edit: { featureGroup: drawnItems },
      });
      map.addControl(drawControl);

      const NoteControl = L.Control.extend({
        onAdd: function (map: L.Map) {
          const container = L.DomUtil.create(
            "div",
            "leaflet-bar leaflet-control leaflet-control-custom"
          );
          container.style.zIndex = "1001";
          
          const buttonContainer = L.DomUtil.create("div", "note-control-btn", container);
          
          L.DomEvent.disableClickPropagation(buttonContainer);
          L.DomEvent.on(buttonContainer, 'click', L.DomEvent.stop);
          L.DomEvent.on(buttonContainer, 'dblclick', L.DomEvent.stop);
          
          const root = createRoot(buttonContainer);
          root.render(
            <RiStickyNoteAddLine 
              style={{ fontSize: "24px", cursor: "pointer", color: "#333", display: "block", margin: "4px" }} 
              onClick={() => {
                console.log("Note button clicked!");
                setIsCreatingNote(true);
              }}
            />
          );

          return container;
        },
      });

      map.addControl(new NoteControl({ position: "topleft" }));
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
              (layer as L.Path).setStyle({ color: color });
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

              const editBtn = popupEl.querySelector(".edit-btn") as HTMLElement | null;
              const historyBtn = popupEl.querySelector(".history-btn") as HTMLElement | null;

              if (editBtn && user?.role === "admin") {
                editBtn.addEventListener("click", () => {
                  setEditingLayer(layer);
                  setFormData(layer.metadata || defaultDetails);
                  setIsEditing(true);
                  setShapeModalOpen(true);
                });
              }

              if (historyBtn) {
                historyBtn.addEventListener("click", () => {
                  setHistoryShapeId((layer.dbId as number) ?? null);
                  setHistoryOpen(true);
                });
              }
            });

            drawnItems.addLayer(layer);
          }
        });
        toast.success("Shapes loaded");
      } catch (err: any) {
        console.error(err);
        toast.error("Failed to load shapes: " + (err?.message || ""));
      } finally {
        setLoading(false);
      }
    };

    const loadNotes = async () => {
      setLoading(true);
      try {
        notesLayer.clearLayers();
        const notes = await getNotes();
        notes.forEach((note: any) => {
          if (!note.isDone) {
            const marker = L.marker([note.latitude, note.longitude], {
              icon: L.icon({
                iconUrl: "https://cdn-icons-png.flaticon.com/512/3208/3208573.png",
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -25],
              }),
            });

            let popupContent = `
              <div>
                <strong>${note.title || "Untitled Note"}</strong><br/>
                ${note.message || ""}<br/>
                <em>By:</em> ${note.User?.username || "N/A"}<br/>
            `;

            if (note.image) {
              popupContent += `<img src="${note.image}" alt="Note Image" style="max-width: 100%; height: auto; margin-top: 10px;" />`;
            }

            popupContent += "</div>";
            marker.bindPopup(popupContent);
            notesLayer.addLayer(marker);
          }
        });
        toast.success("Notes loaded");
      } catch (err: any) {
        console.error(err);
        toast.error("Failed to load notes: " + (err?.message || ""));
      } finally {
        setLoading(false);
      }
    };

    loadShapes();
    loadNotes();
    
    map.on("click", (e: any) => {
      if (isCreatingNoteRef.current) {
        setNoteCoords(e.latlng);
        setNoteModalOpen(true);
        setIsCreatingNote(false);
      }
    });

    if (user?.role === "admin") {
      map.on(L.Draw.Event.CREATED, (e: any) => {
        drawnItems.addLayer(e.layer);
        setEditingLayer(e.layer);
        setFormData(defaultDetails);
        setIsEditing(false);
        setShapeModalOpen(true);
      });

      map.on(L.Draw.Event.EDITED, (e: any) => {
        e.layers.eachLayer((lyr: CustomLayer) => {
          setEditingLayer(lyr);
          setFormData(lyr.metadata || defaultDetails);
          setIsEditing(true);
          setShapeModalOpen(true);
        });
      });

      map.on(L.Draw.Event.DELETED, async (e: any) => {
        const ids: number[] = [];
        e.layers.eachLayer((lyr: CustomLayer) => lyr.dbId && ids.push(lyr.dbId));
        try {
          await Promise.all(ids.map((id) => deleteMapShape(id)));
          toast.success("Shape(s) deleted");
        } catch (err: any) {
          console.error(err);
          toast.error("Failed to delete shape(s): " + (err?.message || ""));
        }
      });
    }
  }, [createColoredMarker, user, drawnItems, notesLayer]);

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
        show={shapeModalOpen}
        onClose={() => setShapeModalOpen(false)}
        onSave={handleSave}
        initialData={formData}
      />
      <PipeHistoryModal
        shapeId={historyShapeId}
        show={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />
      <NoteModal
        show={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        onSave={handleSaveNote}
        initialCoords={noteCoords}
      />
    </>
  );
};

export default MapComponent2D;