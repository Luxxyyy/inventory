import React, { useEffect, useState } from "react";
import { getLegendItems } from "../../api/legend_api";
import CreateLegendItem from "./CreateLegendItem";

const LegendItemWrapper: React.FC<{ onSave: () => void }> = ({ onSave }) => {
  const [usedColors, setUsedColors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsedColors = async () => {
      try {
        const data = await getLegendItems();
        const colors = data.map((item: any) => item.color.toLowerCase());
        setUsedColors(colors);
      } catch (error) {
        console.error("Error fetching used colors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsedColors();
  }, []);

  if (loading) return <div>Loading...</div>;

  return <CreateLegendItem onSave={onSave} usedColors={usedColors} />;
};

export default LegendItemWrapper;
