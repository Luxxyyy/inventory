import React from "react";
import { legendItems } from "../../utils/legendItems";

const MapLegend: React.FC = React.memo(() => {
  return (
    <div
      className="card mt-3 shadow-sm"
      style={{
        width: "100%",
        maxHeight: "200px", 
        overflowY: "auto", 
      }}
    >
      <div className="card-body py-2">
        <h6 className="card-title mb-2">Map Legend</h6>
        <div className="d-flex flex-wrap gap-3">
          {legendItems.map((item, idx) => (
            <div
              key={idx}
              className="d-flex align-items-center gap-2"
              style={{ minWidth: "200px" }}
            >
              <span className={item.cssClass} />
              <span style={{ wordBreak: "break-word" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default MapLegend;
