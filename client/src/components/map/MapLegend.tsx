import React from "react";

const legendItems = [
  {
    label: "250mm (Green Line)",
    type: "line",
    color: "green-line",
  },
  {
    label: "AVIAR VALVE ASSEMBLY (Blue Dot)",
    type: "dot",
    color: "blue-dot",
  },
  {
    label: "SADDLE CLAMP (Yellow Dot)",
    type: "dot",
    color: "yellow-dot",
  },
];

const MapLegend: React.FC = React.memo(() => (
  <div className="card mb-3 mt-3" style={{ maxWidth: 400 }}>
    <div className="card-body py-2">
      <h6 className="card-title mb-2">Map Legend</h6>
      <div className="d-flex flex-column gap-3">
        {legendItems.map((item, idx) => (
          <div className="d-flex align-items-center gap-2" key={idx}>
            {item.type === "line" ? (
              <span className={item.color} />
            ) : (
              <span className={item.color} />
            )}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
));

export default MapLegend;