import React, { useState, useEffect } from "react";
import MapComponent2D from "../components/map/MapComponent2D";
import MapComponent3D from "../components/MapComponent3D";
import MapLegend from "../components/map/MapLegend";
import { getSources } from "../api/source_api";
import { getBalangays } from "../api/balangay_api";
import { getPuroks } from "../api/purok_api";

function Dashboard() {
  const [is2DMap, setIs2DMap] = useState(true);
  const [sources, setSources] = useState<{ id?: number; source: string; latitude?: string; longitude?: string; balangay?: string; purok?: string }[]>([]);
  const [balangays, setBalangays] = useState<{ id?: number; balangay: string; latitude?: string; longitude?: string }[]>([]);
  const [puroks, setPuroks] = useState<{ id?: number; purok: string; latitude?: string; longitude?: string }[]>([]);
  const [selectedSource, setSelectedSource] = useState<{ latitude?: string; longitude?: string } | null>(null);
  const [selectedBalangay, setSelectedBalangay] = useState<{ latitude?: string; longitude?: string } | null>(null);
  const [selectedPurok, setSelectedPurok] = useState<{ latitude?: string; longitude?: string } | null>(null);

  useEffect(() => {
    getSources()
      .then((data) => setSources(data))
      .catch(() => setSources([]));
    getBalangays()
      .then((data) => setBalangays(data))
      .catch(() => setBalangays([]));
    getPuroks()
      .then((data) => setPuroks(data))
      .catch(() => setPuroks([]));
  }, []);

  // Priority: Source > Balangay > Purok
  const getCenter = () => {
    if (selectedSource && selectedSource.latitude && selectedSource.longitude) {
      return selectedSource;
    }
    if (selectedBalangay && selectedBalangay.latitude && selectedBalangay.longitude) {
      return selectedBalangay;
    }
    if (selectedPurok && selectedPurok.latitude && selectedPurok.longitude) {
      return selectedPurok;
    }
    return null;
  };

  const center = getCenter();

  return (
    <div className="container-fluid p-3">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <button
          className="btn btn-primary me-2 mb-2"
          onClick={() => setIs2DMap((prev) => !prev)}
        >
          Switch to {is2DMap ? "Google" : "2D"} Map
        </button>

        <div className="d-flex flex-wrap gap-2">
          {/* Source Dropdown */}
          <div className="dropdown">
            <button
              className="btn btn-outline-secondary dropdown-toggle"
              type="button"
              id="sourceDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Source
            </button>
            <ul className="dropdown-menu" aria-labelledby="sourceDropdown">
              {sources.length === 0 ? (
                <li>
                  <span className="dropdown-item text-muted">No sources found</span>
                </li>
              ) : (
                sources.map((src) => (
                  <li key={src.id || src.source}>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setSelectedSource({ latitude: src.latitude, longitude: src.longitude });
                        setSelectedBalangay(null);
                        setSelectedPurok(null);
                      }}
                      disabled={!src.latitude || !src.longitude}
                    >
                      {src.source}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
          {/* Balangay Dropdown */}
          <div className="dropdown">
            <button
              className="btn btn-outline-secondary dropdown-toggle"
              type="button"
              id="balangayDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Balangay
            </button>
            <ul className="dropdown-menu" aria-labelledby="balangayDropdown">
              {balangays.length === 0 ? (
                <li>
                  <span className="dropdown-item text-muted">No balangays found</span>
                </li>
              ) : (
                balangays.map((bal) => (
                  <li key={bal.id || bal.balangay}>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setSelectedBalangay({ latitude: bal.latitude, longitude: bal.longitude });
                        setSelectedSource(null);
                        setSelectedPurok(null);
                      }}
                      disabled={!bal.latitude || !bal.longitude}
                    >
                      {bal.balangay}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
          {/* Purok Dropdown */}
          <div className="dropdown">
            <button
              className="btn btn-outline-secondary dropdown-toggle"
              type="button"
              id="purokDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Purok
            </button>
            <ul className="dropdown-menu" aria-labelledby="purokDropdown">
              {puroks.length === 0 ? (
                <li>
                  <span className="dropdown-item text-muted">No puroks found</span>
                </li>
              ) : (
                puroks.map((purok) => (
                  <li key={purok.id || purok.purok}>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setSelectedPurok({ latitude: purok.latitude, longitude: purok.longitude });
                        setSelectedSource(null);
                        setSelectedBalangay(null);
                      }}
                      disabled={!purok.latitude || !purok.longitude}
                    >
                      {purok.purok}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
      <div className="w-100" style={{ height: "100%", minHeight: "500px" }}>
        {is2DMap ? <MapComponent2D center={center} /> : <MapComponent3D center={center} />}
      </div>
      <MapLegend />
    </div>
  );
}

export default Dashboard;