import React, { useEffect, useState, useMemo, Suspense } from "react";
import SharedDropdown from "../components/map/SharedDropdown";
import MapLegend from "../components/map/MapLegend";
import { getSources } from "../api/source_api";
import { getBalangays } from "../api/balangay_api";
import { getPuroks } from "../api/purok_api";
import { getCenterFromSelection } from "../utils/mapUtils";
import type { Source, Balangay, Purok } from "../types/mapTypes";

const MapComponent2D = React.lazy(() => import("../components/map/MapComponent2D"));
const MapComponent3D = React.lazy(() => import("../components/map/MapComponent3D"));

function Dashboard() {
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
      .then(([src, bal, pur]) => {
        setSources(src);
        setBalangays(bal);
        setPuroks(pur);
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
    <div
      className="position-relative"
      style={{ height: "100%", width: "100%", overflow: "hidden" }}
    >
      <div className="position-absolute top-0 start-0 w-100 h-100 z-0">
        <Suspense fallback={<div>Loading map...</div>}>
          {is2DMap ? <MapComponent2D center={center} /> : <MapComponent3D center={center} />}
        </Suspense>
      </div>

      <div
        className="position-absolute top-0 end-0 p-3 d-flex flex-wrap gap-2 align-items-start z-1"
        style={{
          background: "rgba(255,255,255,0.0)",
          borderBottomRightRadius: "8px",
        }}
      >
        <button
          className="btn btn-primary me-2 mb-2"
          onClick={() => setIs2DMap((prev) => !prev)}
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

      <MapLegend />
    </div>
  );
}

export default Dashboard;
