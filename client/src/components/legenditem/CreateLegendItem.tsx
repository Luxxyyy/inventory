import React, { useState } from "react";
import { addLegendItem } from "../../api/legend_api";

interface Props {
  onSave: () => void;
}

const CreateLegendItem: React.FC<Props> = ({ onSave }) => {
  const [formData, setFormData] = useState({
    label: "",
    type: "line",
    color: "#ffffff",
    cssClass: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    setError("");
    setSuccess("");

    if (!formData.label || !formData.color) {
      setError("Label and Color are required!");
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
      setFormData({
        label: "",
        type: "line",
        color: "#000000",
        cssClass: "",
      });
      onSave();
    } catch (err) {
      console.error(err);
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
        <label htmlFor="colorInput" className="form-label">
          Color
        </label>
        <input
          type="color"
          className="form-control"
          id="colorInput"
          name="color"
          value={formData.color}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="cssClassInput" className="form-label">
          CSS Class (optional)
        </label>
        <input
          type="text"
          className="form-control"
          id="cssClassInput"
          placeholder="e.g., blue-dot"
          name="cssClass"
          value={formData.cssClass}
          onChange={handleChange}
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