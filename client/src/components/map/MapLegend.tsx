import React, { useState, useMemo } from "react";
import { legendItems } from "../../utils/legendItems";

const MapLegend: React.FC = React.memo(() => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = useMemo(() => {
    return legendItems.filter((item) =>
      item.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div
      className="map-legend shadow-sm"
      style={{
        position: "absolute",
        bottom: "100px",
        right: "20px",
        backgroundColor: "rgba(255, 255, 255, 0.60)",
        padding: "12px",
        borderRadius: "8px",
        maxHeight: "200px",
        overflowY: "auto",
        zIndex: 1000,
        width: "90%", 
        maxWidth: "400px",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
        <strong className="mb-0">Map Legend</strong>
        <input
          type="text"
          placeholder="Search..."
          className="form-control form-control-sm"
          style={{ flexGrow: 1, minWidth: "120px", maxWidth: "150px" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="row">
        {filteredItems.map((item, idx) => (
          <div
            key={idx}
            className="col-12 col-sm-6 mb-1 d-flex align-items-center gap-2"
          >
            <span
              className={item.cssClass}
              style={{
                width: 16,
                height: 16,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: "0.8rem", wordBreak: "break-word" }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

export default MapLegend;
