import React, { useEffect, useState, useMemo, Suspense } from "react";
import { Spinner } from "react-bootstrap";
import SharedDropdown from "../components/map/SharedDropdown";
import MapLegend from "../components/map/MapLegend";
import { getSources } from "../api/source_api";
import { getBalangays } from "../api/balangay_api";
import { getPuroks } from "../api/purok_api";
import { getSheets } from "../api/sheet_api";
import { getCenterFromSelection } from "../utils/mapUtils";
import type { Source, Balangay, Purok, Sheet } from "../types/mapTypes";
import "../design/dashboard.css";

const MapComponent2D = React.lazy(() => import("../components/map/MapComponent2D"));
const MapComponent3D = React.lazy(() => import("../components/map/MapComponent3D"));

const Dashboard = () => {
  const [is2DMap, setIs2DMap] = useState(true);
  const [sources, setSources] = useState<Source[]>([]);
  const [balangays, setBalangays] = useState<Balangay[]>([]);
  const [puroks, setPuroks] = useState<Purok[]>([]);
  const [sheets, setSheets] = useState<Sheet[]>([]);

  const [selection, setSelection] = useState<{
    source: Source | null;
    balangay: Balangay | null;
    purok: Purok | null;
    sheet: Sheet | null;
  }>({
    source: null,
    balangay: null,
    purok: null,
    sheet: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [legendVersion, setLegendVersion] = useState(0);

  useEffect(() => {
    setLoading(true);
    Promise.all([getSources(), getBalangays(), getPuroks(), getSheets()])
      .then(([src, bal, pur, sht]: any) => {
        setSources(src || []);
        setBalangays(bal || []);
        setPuroks(pur || []);
        setSheets(sht || []);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load map data.");
      })
      .finally(() => setLoading(false));
  }, []);

  const center = useMemo(() => {
    return getCenterFromSelection(
      selection.source,
      selection.balangay,
      selection.purok
    );
  }, [selection]);

  if (loading) return <div className="p-4">Loading map data...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="dashboard-container">
      <div className="map-container">
        <Suspense
          fallback={
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100%" }}>
              <Spinner animation="border" /> Loading map...
            </div>
          }
        >
          {is2DMap ? (
            <MapComponent2D center={center} />
          ) : (
            <MapComponent3D center={center} />
          )}
        </Suspense>
      </div>

      <div
        className={`map-controls ${is2DMap ? "controls-2d" : "controls-3d"}`}
        style={{ flexWrap: "wrap", gap: "0.5rem", maxWidth: "100vw" }}
      >
        <button
          className="btn btn-primary me-2 mb-2 hidden-mobile"
          onClick={() => setIs2DMap((prev) => !prev)}
          aria-label={`Switch to ${is2DMap ? "Google 3D" : "2D"} Map`}
        >
          Switch to {is2DMap ? "Google" : "2D"} Map
        </button>

        {/* Source Dropdown */}
        <SharedDropdown
          label="Source"
          items={sources}
          getLabel={(src) => src.source}
          onSelect={(src) =>
            setSelection({
              source: src,
              balangay: null,
              purok: null,
              sheet: null,
            })
          }
          disabledCheck={(src) => !src.latitude || !src.longitude}
        />

        {/* Balangay Dropdown (only shown when a source is selected) */}
        {selection.source && (
          <SharedDropdown
            label="Balangay"
            items={balangays.filter((b) => b.source_id === selection.source?.id)}
            getLabel={(b) => b.balangay}
            onSelect={(bal) =>
              setSelection((prev) => ({
                ...prev,
                balangay: bal,
                purok: null,
              }))
            }
            disabledCheck={(b) => !b.latitude || !b.longitude}
          />
        )}

        {/* Sheet Dropdown (only shown when a source is selected) */}
        {selection.source && (
          <SharedDropdown
            label="Sheet"
            items={sheets.filter((s) => s.source_id === selection.source?.id)}
            getLabel={(s) => s.sheet}
            onSelect={(sheet) =>
              setSelection((prev) => ({
                ...prev,
                sheet: sheet,
              }))
            }
            disabledCheck={(s) => !s.latitude || !s.longitude}
          />
        )}

        {/* Purok Dropdown - only if Balangay is selected */}
        {selection.balangay && (
          <SharedDropdown
            label="Purok"
            items={puroks.filter((p) => p.balangay_id === selection.balangay?.id)}
            getLabel={(p) => p.purok}
            onSelect={(pur) =>
              setSelection((prev) => ({
                ...prev,
                purok: pur,
              }))
            }
            disabledCheck={(p) => !p.latitude || !p.longitude}
          />
        )}
      </div>

      <div className={`map-legend-wrapper ${is2DMap ? "legend-2d" : "legend-3d"}`}>
        <MapLegend key={legendVersion} />
      </div>
    </div>
  );
};

export default Dashboard;
