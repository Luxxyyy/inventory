import React, { useState, useEffect, useMemo } from "react";
import http from "../../api/http";
import "../../design/maplegend.css";

type LegendItem = {
  id: number;
  label: string;
  type: "line" | "dot";
  color: string;
  cssClass: string;
};

const MapLegend: React.FC = React.memo(() => {
  const [searchTerm, setSearchTerm] = useState("");
  const [legendItems, setLegendItems] = useState<LegendItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLegendItems = async () => {
      try {
        const response = await http.get<LegendItem[]>("/legend");
        setLegendItems(response.data);
      } catch (error) {
        console.error("Failed to fetch legend items", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLegendItems();
  }, []);

  const filteredItems = useMemo(() => {
    return legendItems
      .filter((item) => item.color !== "#ffffff")
      .filter((item) =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [searchTerm, legendItems]);

  if (loading) {
    return (
      <div
        className="map-legend shadow-sm"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: "12px",
          borderRadius: "8px",
          maxHeight: "200px",
          overflowY: "auto",
          width: "90%",
          maxWidth: "400px",
        }}
      >
        <p>Loading legend...</p>
      </div>
    );
  }

  return (
    <div
      className="map-legend shadow-sm"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        padding: "12px",
        borderRadius: "8px",
        maxHeight: "200px",
        overflowY: "auto",
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
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div
              key={item.id}
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
          ))
        ) : (
          <div className="col-12 text-center text-muted">No results found.</div>
        )}
      </div>
    </div>
  );
});

export default MapLegend;