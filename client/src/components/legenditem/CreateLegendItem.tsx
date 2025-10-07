import React, { useState } from "react";
import { addLegendItem, getLegendItems } from "../../api/legend_api";
import cssNamedColors from "../../utils/cssNamedColors";

interface CreateLegendItemProps {
  onSave: () => void;
}

const CreateLegendItem: React.FC<CreateLegendItemProps> = ({ onSave }) => {
  const [formData, setFormData] = useState({
    label: "",
    type: "line",
    color: "", // start blank as requested
    cssClass: "",
  });
  const [useUniqueColor, setUseUniqueColor] = useState(true);
  const [isFetchingColor, setIsFetchingColor] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Build a hex -> name map for normalization (keys lowercased)
  const hexToName = (Object.entries(cssNamedColors) as [string, string][]).reduce<
    Record<string, string>
  >((acc, [name, hex]) => {
    acc[hex.toLowerCase()] = name.toLowerCase();
    return acc;
  }, {});

  // Normalize DB color values to consistent names
  const normalizeDbColorValue = (raw: any): string | null => {
    if (raw === null || raw === undefined) return null;
    const v = String(raw).toLowerCase().trim();
    if (!v) return null;
    if (v.includes("-")) return v.split("-")[0];
    if (v.startsWith("#")) return hexToName[v] ?? v;
    return v;
  };

  // Fetch DB colors for given type
  const fetchUsedNamesForType = async (type: string): Promise<Set<string>> => {
    const used = new Set<string>();
    try {
      const data: any[] = await getLegendItems();
      (data || []).forEach((item) => {
        if (!item || !item.color) return;
        if (item.type !== type) return;
        const n = normalizeDbColorValue(item.color);
        if (!n) return;
        if (n === "white" || n === "#ffffff") return;
        used.add(n);
      });
    } catch (err) {
      console.error("fetchUsedNamesForType error:", err);
    }
    return used;
  };

  const listAllNamedColors = (): string[] =>
    Object.keys(cssNamedColors).map((n) => n.toLowerCase()).filter((n) => n !== "white");

  const pickUnusedColorForType = async (type: string): Promise<string | null> => {
    const usedNames = await fetchUsedNamesForType(type);
    const allNames = listAllNamedColors();
    const available = allNames.filter((n) => !usedNames.has(n));
    if (available.length === 0) return null;
    const idx = Math.floor(Math.random() * available.length);
    return available[idx];
  };

  const handleGetColor = async () => {
    setIsFetchingColor(true);
    try {
      const chosen = await pickUnusedColorForType(formData.type);
      if (!chosen) {
        window.alert("No available named colors left for this type.");
      } else {
        setFormData((prev) => ({
          ...prev,
          color: chosen,
          cssClass: `${chosen}-${prev.type}`,
        }));
      }
    } catch (err) {
      console.error("handleGetColor error:", err);
      window.alert("Failed to get color. Try again.");
    } finally {
      setIsFetchingColor(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const label = formData.label.trim();
    if (!label) {
      window.alert("Label is required.");
      return;
    }

    const colorToSave = useUniqueColor ? formData.color : "#ffffff";
    const cssClassToSave = useUniqueColor ? formData.cssClass : `white-${formData.type}`;

    if (useUniqueColor && !colorToSave) {
      window.alert("Please get a color before saving (click Get Color).");
      return;
    }

    setIsSaving(true);
    try {
      await addLegendItem(label, formData.type, colorToSave, cssClassToSave);
      onSave();
      setFormData({
        label: "",
        type: "line",
        color: "",
        cssClass: "",
      });
    } catch (err) {
      console.error("save error:", err);
      window.alert("Failed to save legend item.");
    } finally {
      setIsSaving(false);
    }
  };

  const previewColorCss = (colorNameOrHex: string) => {
    if (!colorNameOrHex) return "transparent";
    const lower = colorNameOrHex.toLowerCase();
    return (cssNamedColors as Record<string, string>)[lower] ?? colorNameOrHex;
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded bg-white">
      <h5 className="mb-3">Create Legend Item</h5>

      <div className="mb-3">
        <label className="form-label">Label</label>
        <input
          className="form-control"
          value={formData.label}
          onChange={(e) => setFormData((p) => ({ ...p, label: e.target.value }))}
          placeholder="Enter label"
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Type</label>
        <select
          className="form-select"
          value={formData.type}
          onChange={(e) =>
            setFormData((p) => ({ ...p, type: e.target.value, color: "", cssClass: "" }))
          }
        >
          <option value="line">Line</option>
          <option value="dot">Dot</option>
        </select>
      </div>

      <div className="mb-3 form-check">
        <input
          id="uniqueColorCheck"
          className="form-check-input"
          type="checkbox"
          checked={useUniqueColor}
          onChange={(e) => {
            setUseUniqueColor(e.target.checked);
            setFormData((p) => ({ ...p, color: "", cssClass: "" }));
          }}
        />
        <label className="form-check-label" htmlFor="uniqueColorCheck">
          Use unique color (per type)
        </label>
      </div>

      <div className="mb-3">
        <label className="form-label">Color</label>
        {useUniqueColor ? (
          formData.color ? (
            <div>
              <div
                style={{
                  width: 60,
                  height: 28,
                  backgroundColor: previewColorCss(formData.color),
                  border: "1px solid #ccc",
                  borderRadius: 4,
                }}
              />
              <div className="mt-1">
                <small className="text-muted">{formData.color}</small>
              </div>
              <div className="mt-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => {
                    setFormData((p) => ({ ...p, color: "", cssClass: "" }));
                  }}
                >
                  Reset / Get different color
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleGetColor}
              disabled={isFetchingColor}
            >
              {isFetchingColor ? "Finding..." : "Get Color"}
            </button>
          )
        ) : (
          <div>
            <div
              style={{
                width: 60,
                height: 28,
                backgroundColor: "#ffffff",
                border: "1px solid #ccc",
                borderRadius: 4,
              }}
            />
            <div className="mt-1">
              <small className="text-muted">#ffffff (fixed)</small>
            </div>
          </div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">CSS Class (auto)</label>
        <input className="form-control" readOnly value={formData.cssClass} />
      </div>

      <div className="d-flex gap-2">
        <button className="btn btn-success text-white" type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          className="btn btn-danger text-white"
          onClick={() =>
            setFormData({
              label: "",
              type: "line",
              color: "",
              cssClass: "",
            })
          }
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CreateLegendItem;
