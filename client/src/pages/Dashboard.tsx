import React, { useState } from "react";
import MapComponent2D from "../components/MapComponent2D";
import MapComponent3D from "../components/MapComponent3D";

function Dashboard() {
  const [is2DMap, setIs2DMap] = useState(true);

  return (
    <div className="container-fluid p-3">
      {/* Controls Row */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
        {/* Map Toggle Button */}
        <button
          className="btn btn-primary me-2 mb-2"
          onClick={() => setIs2DMap((prev) => !prev)}
        >
          Switch to {is2DMap ? "3D" : "2D"} Map
        </button>

        {/* Dropdowns */}
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
              <li><a className="dropdown-item" href="#">Source 1</a></li>
              <li><a className="dropdown-item" href="#">Source 2</a></li>
              <li><a className="dropdown-item" href="#">Source 3</a></li>
            </ul>
          </div>

          {/* Barangay Dropdown */}
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
              <li><a className="dropdown-item" href="#">Barangay A</a></li>
              <li><a className="dropdown-item" href="#">Barangay B</a></li>
              <li><a className="dropdown-item" href="#">Barangay C</a></li>
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
              <li><a className="dropdown-item" href="#">Purok 1</a></li>
              <li><a className="dropdown-item" href="#">Purok 2</a></li>
              <li><a className="dropdown-item" href="#">Purok 3</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Map Display */}
      <div className="w-100" style={{ height: "100%", minHeight: "500px" }}>
        {is2DMap ? <MapComponent2D /> : <MapComponent3D />}
      </div>
    </div>
  );
}

export default Dashboard;
