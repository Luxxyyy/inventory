import React, { useState, useEffect } from "react";
import { getSources } from "../../api/source_api";
import { addSheet } from "../../api/sheet_api";
import type { Source } from "../../types/mapTypes";

function AddSheet() {
  const [sheet, setSheet] = useState("");
  const [source, setSource] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    getSources()
      .then((data: any) => {
        const arr: any[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : [];

        const valid = arr.filter(
          (item: any) => typeof item?.id === "number" && typeof item?.source === "string"
        );

        setSources(valid as Source[]);
      })
      .catch(() => setSources([]));
  }, []);

  const handleAdd = async () => {
    setError("");
    setSuccess("");

    if (!sheet || !source || !latitude || !longitude) {
      setError("All fields are required!");
      return;
    }

    const parsedSourceId = parseInt(source, 10);
    if (isNaN(parsedSourceId)) {
      setError("Invalid source selected!");
      return;
    }

    setLoading(true);
    try {
      await addSheet(sheet, parsedSourceId, longitude, latitude);
      setSuccess("Sheet added!");

      setSheet("");
      setSource("");
      setLatitude("");
      setLongitude("");
    } catch (err) {
      console.error(err);
      setError("Failed to add sheet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid mx-4 my-3" style={{ maxWidth: "600px" }}>
      <h2>Add Sheet</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="mb-3">
        <label htmlFor="sheetInput" className="form-label">Sheet</label>
        <input
          type="text"
          className="form-control"
          id="sheetInput"
          placeholder="Enter Sheet"
          value={sheet}
          onChange={(e) => setSheet(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="sourceInput" className="form-label">Source</label>
        <select
          className="form-select"
          id="sourceInput"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        >
          <option value="">Select Source</option>
          {sources.map((src) => (
            <option key={String(src.id)} value={String(src.id)}>
              {src.source}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="latitudeInput" className="form-label">Latitude</label>
        <input
          type="text"
          className="form-control"
          id="latitudeInput"
          placeholder="Enter Latitude"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="longitudeInput" className="form-label">Longitude</label>
        <input
          type="text"
          className="form-control"
          id="longitudeInput"
          placeholder="Enter Longitude"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
        />
      </div>

      <button
        type="button"
        className="btn btn-success text-white"
        onClick={handleAdd}
        disabled={loading}
      >
        {loading ? "Adding..." : "Add"}
      </button>
    </div>
  );
}

export default AddSheet;
