import React, { useState, useEffect } from "react";
import MapComponent2D from "../components/map/MapComponent2D";
import MapComponent3D from "../components/MapComponent3D";
import MapLegend from "../components/map/MapLegend";
import { getSources } from "../api/source_api";

function Dashboard() {
  const [is2DMap, setIs2DMap] = useState(true);
  const [sources, setSources] = useState<{ id?: number; source: string; latitude?: string; longitude?: string; barangay?: string; purok?: string }[]>([]);
  const [selectedSource, setSelectedSource] = useState<{ latitude?: string; longitude?: string } | null>(null);
  const [barangays, setBarangays] = useState<string[]>(["Barangay A", "Barangay B", "Barangay C"]);
  const [puroks, setPuroks] = useState<string[]>(["Purok 1", "Purok 2", "Purok 3"]);
  const [selectedBarangay, setSelectedBarangay] = useState<string | null>(null);
  const [selectedPurok, setSelectedPurok] = useState<string | null>(null);

  useEffect(() => {
    getSources()
      .then((data) => setSources(data))
      .catch(() => setSources([]));
  }, []);

  const getCenter = () => {
    if (selectedSource && selectedSource.latitude && selectedSource.longitude) {
      return selectedSource;
    }
    if (selectedBarangay) {
      const found = sources.find(src => src.barangay === selectedBarangay && src.latitude && src.longitude);
      if (found) return { latitude: found.latitude, longitude: found.longitude };
    }
    if (selectedPurok) {
      const found = sources.find(src => src.purok === selectedPurok && src.latitude && src.longitude);
      if (found) return { latitude: found.latitude, longitude: found.longitude };
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
          Switch to {is2DMap ? "3D" : "2D"} Map
        </button>

        <div className="d-flex flex-wrap gap-2">
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
                        setSelectedBarangay(src.barangay || null);
                        setSelectedPurok(src.purok || null);
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
          <div className="dropdown">
            <button
              className="btn btn-outline-secondary dropdown-toggle"
              type="button"
              id="barangayDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Barangay
            </button>
            <ul className="dropdown-menu" aria-labelledby="barangayDropdown">
              {barangays.map((barangay) => (
                <li key={barangay}>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setSelectedBarangay(barangay);
                      setSelectedSource(null);
                    }}
                  >
                    {barangay}
                  </button>
                </li>
              ))}
            </ul>
          </div>
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
              {puroks.map((purok) => (
                <li key={purok}>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setSelectedPurok(purok);
                      setSelectedSource(null);
                    }}
                  >
                    {purok}
                  </button>
                </li>
              ))}
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