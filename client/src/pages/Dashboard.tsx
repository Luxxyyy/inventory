import React, { useEffect, useState, useMemo, Suspense } from "react";
import SharedDropdown from "../components/map/SharedDropdown";
import MapLegend from "../components/map/MapLegend";
import { getSources } from "../api/source_api";
import { getBalangays } from "../api/balangay_api";
import { getPuroks } from "../api/purok_api";
import { getCenterFromSelection } from "../utils/mapUtils";
import type { Source, Balangay, Purok } from "../types/mapTypes";
import "../design/dashboard.css";

const MapComponent2D = React.lazy(() => import("../components/map/MapComponent2D"));
const MapComponent3D = React.lazy(() => import("../components/map/MapComponent3D"));

const Dashboard = () => {
  const [is2DMap, setIs2DMap] = useState(true);
  const [sources, setSources] = useState<Source[]>([]);
  const [balangays, setBalangays] = useState<Balangay[]>([]);
  const [puroks, setPuroks] = useState<Purok[]>([]);
  const [selection, setSelection] = useState<{
    source: Source | null;
    balangay: Balangay | null;
    purok: Purok | null;
  }>({
    source: null,
    balangay: null,
    purok: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([getSources(), getBalangays(), getPuroks()])
      .then(([src, bal, pur]: any) => {
        const srcArr = Array.isArray(src) ? src : Array.isArray(src?.data) ? src.data : [];
        const balArr = Array.isArray(bal) ? bal : Array.isArray(bal?.data) ? bal.data : [];
        const purArr = Array.isArray(pur) ? pur : Array.isArray(pur?.data) ? pur.data : [];

        const validSrc = srcArr.filter(
          (s: any) => typeof s?.id === "number" && typeof s?.source === "string"
        );
        const validBal = balArr.filter(
          (b: any) => typeof b?.id === "number" && typeof b?.balangay === "string"
        );
        const validPur = purArr.filter(
          (p: any) => typeof p?.id === "number" && typeof p?.purok === "string"
        );

        setSources(validSrc as Source[]);
        setBalangays(validBal as Balangay[]);
        setPuroks(validPur as Purok[]);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load map data.");
      })
      .finally(() => setLoading(false));
  }, []);

  const center = useMemo(() => {
    return getCenterFromSelection(selection.source, selection.balangay, selection.purok);
  }, [selection]);

  if (loading) return <div className="p-4">Loading map data...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="dashboard-container">
      <div className="map-container">
        <Suspense fallback={<div>Loading map...</div>}>
          {is2DMap ? <MapComponent2D center={center} /> : <MapComponent3D center={center} />}
        </Suspense>
      </div>

      <div
        className={`map-controls ${is2DMap ? "controls-2d" : "controls-3d"}`}
        style={{
          flexWrap: "wrap",
          gap: "0.5rem",
          maxWidth: "100vw",
        }}
      >
        <button
          className="btn btn-primary me-2 mb-2 hidden-mobile"
          onClick={() => setIs2DMap((prev) => !prev)}
          aria-label={`Switch to ${is2DMap ? "Google 3D" : "2D"} Map`}
        >
          Switch to {is2DMap ? "Google" : "2D"} Map
        </button>

        <SharedDropdown
          label="Source"
          items={sources}
          getLabel={(src) => src.source}
          onSelect={(src) => setSelection({ source: src, balangay: null, purok: null })}
          disabledCheck={(src) => !src.latitude || !src.longitude}
        />

        <SharedDropdown
          label="Balangay"
          items={balangays}
          getLabel={(bal) => bal.balangay}
          onSelect={(bal) => setSelection({ source: null, balangay: bal, purok: null })}
          disabledCheck={(bal) => !bal.latitude || !bal.longitude}
        />

        <SharedDropdown
          label="Purok"
          items={puroks}
          getLabel={(pur) => pur.purok}
          onSelect={(pur) => setSelection({ source: null, balangay: null, purok: pur })}
          disabledCheck={(pur) => !pur.latitude || !pur.longitude}
        />
      </div>

      <div className={`map-legend-wrapper ${is2DMap ? "legend-2d" : "legend-3d"}`}>
        <MapLegend />
      </div>
    </div>
  );
};

export default Dashboard;
