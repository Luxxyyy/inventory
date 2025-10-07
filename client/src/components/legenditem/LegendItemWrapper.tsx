import React, { useState, useEffect } from "react";
import { getLegendItems } from "../../api/legend_api";
import CreateLegendItem from "./CreateLegendItem";

const LegendItemWrapper: React.FC = () => {
  const [legendItems, setLegendItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLegendItems = async () => {
    try {
      setLoading(true);
      const data = await getLegendItems();
      setLegendItems(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load legend items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLegendItems();
  }, []);

  const handleSave = () => {
    fetchLegendItems();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h3 className="mb-3">Legend Manager</h3>
      <CreateLegendItem onSave={handleSave} />

      <div className="mt-4">
        <h5>Current Legend Items:</h5>
        {legendItems.length === 0 ? (
          <p>No legend items found.</p>
        ) : (
          <ul>
            {legendItems.map((item) => (
              <li key={item.id}>
                <span
                  style={{
                    display: "inline-block",
                    width: 16,
                    height: 16,
                    backgroundColor: item.color,
                    marginRight: 8,
                    border: "1px solid #ccc",
                  }}
                ></span>
                {item.label} ({item.type})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LegendItemWrapper;
