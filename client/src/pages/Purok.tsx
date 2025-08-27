import { useState, useEffect } from "react";
import { getBalangays } from "../api/balangay_api";
import { getSources } from "../api/source_api";
import { addPurok } from "../api/purok_api";

function Purok() {
  const [purok, setPurok] = useState('');
  const [balangay, setBalangay] = useState('');
  const [source, setSource] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [balangays, setBalangays] = useState<{ id?: number; balangay: string }[]>([]);
  const [sources, setSources] = useState<{ id?: number; source: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getBalangays()
      .then((data) => setBalangays(data))
      .catch(() => setBalangays([]));
    getSources()
      .then((data) => setSources(data))
      .catch(() => setSources([]));
  }, []);

  const handleAdd = async () => {
    if (!purok || !balangay || !source || !latitude || !longitude) {
      alert("All fields are required!");
      return;
    }
    setLoading(true);
    try {
      await addPurok(purok, balangay, source, latitude, longitude);
      alert("Purok added!");
      setPurok('');
      setBalangay('');
      setSource('');
      setLatitude('');
      setLongitude('');
    } catch (error) {
      alert("Failed to add purok.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fuild-container mx-4 my-3">
        <div className="mb-3" id="input-box">
        <label htmlFor="putokInput" className="form-label">Purok</label>
        <input
          type="text"
          className="form-control"
          id="purokInput"
          placeholder="Enter Purok"
          value={purok}
          onChange={(e) => setPurok(e.target.value)}
        />
      </div>
      <div className="mb-3" id="input-box">
        <label htmlFor="balangayInput" className="form-label">Balangay</label>
        <select
          className="form-select"
          id="balangayInput"
          value={balangay}
          onChange={(e) => setBalangay(e.target.value)}
        >
          <option value="">Select Balangay</option>
          {balangays.map((b) => (
            <option key={b.id || b.balangay} value={b.balangay}>
              {b.balangay}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3" id="input-box">
        <label htmlFor="sourceInput" className="form-label">Source</label>
        <select
          className="form-select"
          id="sourceInput"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        >
          <option value="">Select Source</option>
          {sources.map((src) => (
            <option key={src.id || src.source} value={src.source}>
              {src.source}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3" id="input-box">
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
      <div className="mb-3" id="input-box">
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
        className="btn btn-primary m-1"
        onClick={handleAdd}
        disabled={loading}
      >
        {loading ? "Adding..." : "Add"}
      </button>
    </div>
  );
}

export default Purok;