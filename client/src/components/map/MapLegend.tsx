import React from "react";

const legendItems = [
  {
    label: "250mm (Green Line)",
    type: "line",
    color: "green-line",
  },
  {
    label: "200mm (Lime Line)",
    type: "line",
    color: "lime-line",
  },
  {
    label: "75mm (Blue Line)",
    type: "line",
    color: "blue-line",
  },
  {
    label: "50mm (Aqua Line)",
    type: "line",
    color: "aqua-line",
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
  {
    label: "BREAK PRESSURE CHAMBER (Orange Dot)",
    type: "dot",
    color: "orange-dot",
  },
  {
    label: "TEE (Aqua Dot)",
    type: "dot",
    color: "aqua-dot",
  },
  {
    label: "GATE VALVE (Coral Dot)",
    type: "dot",
    color: "coral-dot",
  },
  {
    label: "REDUCER (Indianred Dot)",
    type: "dot",
    color: "indianred-dot",
  },
];

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
              <span className={item.color} />
              <span style={{ wordBreak: "break-word" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default MapLegend;
