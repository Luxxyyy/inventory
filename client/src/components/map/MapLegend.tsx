import React from "react";
import { legendItems } from "../../utils/legendItems";

const MapLegend: React.FC = React.memo(() => {
  return (
    <div className="card mb-3 mt-3">
      <div className="card-body py-2">
        <h6 className="card-title mb-2">Map Legend</h6>
        <div className="d-flex flex-wrap gap-4">
          {legendItems.map((item, idx) => (
            <div
              key={idx}
              className="d-flex align-items-center gap-2"
              style={{ minWidth: "200px", flex: "1 1 auto" }}
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
