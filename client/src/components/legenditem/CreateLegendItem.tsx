import React, { useState, useEffect } from "react";
import { addLegendItem } from "../../api/legend_api";
import cssNamedColors from "../../utils/cssNamedColors";

interface Props {
  onSave: () => void;
  usedColors?: string[];
}

const CreateLegendItem: React.FC<Props> = ({ onSave, usedColors = [] }) => {
  const [formData, setFormData] = useState({
    label: "",
    type: "line",
    color: "white",
    cssClass: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [useUniqueColor, setUseUniqueColor] = useState(true);

  const findUniqueColor = (): string => {
    const usedLower = usedColors.map((c) => c.toLowerCase());

    for (const [name] of Object.entries(cssNamedColors)) {
      const lowerName = name.toLowerCase();
      if (lowerName !== "white" && !usedLower.includes(lowerName)) {
        return lowerName;
      }
    }
    return "white";
  };

  useEffect(() => {
    if (useUniqueColor) {
      const uniqueColor = findUniqueColor();
      setFormData((prev) => ({
        ...prev,
        color: uniqueColor,
        cssClass: `${uniqueColor}-${prev.type}`,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        color: "white",
        cssClass: `white-${prev.type}`,
      }));
    }
  }, [formData.type, useUniqueColor, usedColors]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let updatedCssClass = prev.cssClass;

      if (name === "type") {
        updatedCssClass = `${prev.color}-${value}`;
      }


      return {
        ...prev,
        [name]: value,
        cssClass: updatedCssClass,
      };
    });
  };

  const handleCreate = async () => {
    setError("");
    setSuccess("");

    if (!formData.label.trim()) {
      setError("Label is required.");
      return;
    }

    setLoading(true);
    try {
      await addLegendItem(
        formData.label,
        formData.type,
        formData.color,
        formData.cssClass
      );
      setSuccess("Legend item created!");
      onSave();
      setFormData({
        label: "",
        type: "line",
        color: useUniqueColor ? findUniqueColor() : "white",
        cssClass: "",
      });
    } catch (err) {
      setError("Failed to create legend item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="mb-3">
        <label htmlFor="labelInput" className="form-label">
          Label
        </label>
        <input
          type="text"
          className="form-control"
          id="labelInput"
          placeholder="Enter Label"
          name="label"
          value={formData.label}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="typeSelect" className="form-label">
          Type
        </label>
        <select
          className="form-select"
          id="typeSelect"
          name="type"
          value={formData.type}
          onChange={handleChange}
        >
          <option value="line">Line</option>
          <option value="dot">Dot</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Select Color</label>
        <div>
          <input
            type="radio"
            id="uniqueColor"
            name="colorOption"
            checked={useUniqueColor}
            onChange={() => setUseUniqueColor(true)}
          />
          <label htmlFor="uniqueColor" className="me-3">
            Unique Color
          </label>

          <input
            type="radio"
            id="whiteColor"
            name="colorOption"
            checked={!useUniqueColor}
            onChange={() => setUseUniqueColor(false)}
          />
          <label htmlFor="whiteColor">White (fixed)</label>
        </div>
      </div>

      {!useUniqueColor && (
        <div className="mb-3">
          <label htmlFor="colorInput" className="form-label">
            Color
          </label>
          <input
            type="text"
            className="form-control"
            id="colorInput"
            name="color"
            value="#ffffff"
            readOnly
            style={{ cursor: "not-allowed" }}
          />
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="cssClassInput" className="form-label">
          CSS Class (auto generated)
        </label>
        <input
          type="text"
          className="form-control"
          id="cssClassInput"
          name="cssClass"
          value={formData.cssClass}
          readOnly
        />
      </div>

      <button
        type="button"
        className="btn btn-success text-white"
        onClick={handleCreate}
        disabled={loading}
      >
        {loading ? "Creating..." : "Create"}
      </button>
    </div>
  );
};

export default CreateLegendItem;
