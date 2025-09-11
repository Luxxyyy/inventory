import { useState, useEffect } from "react";
import { getBalangays } from "../../api/balangay_api";
import { getSources } from "../../api/source_api";
import { addPurok } from "../../api/purok_api";

function AddPurok() {
  const [purok, setPurok] = useState('');
  const [balangay, setBalangay] = useState('');
  const [source, setSource] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [balangays, setBalangays] = useState<{ id: number; balangay: string }[]>([]);
  const [sources, setSources] = useState<{ id: number; source: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getBalangays()
      .then((data) => setBalangays(data))
      .catch(() => setBalangays([]));
    getSources()
      .then((data) => setSources(data))
      .catch(() => setSources([]));
  }, []);

  const handleAdd = async () => {
    setError('');
    setSuccess('');

    if (!purok || !balangay || !source || !latitude || !longitude) {
      setError("All fields are required!");
      return;
    }

    const balangay_id = parseInt(balangay);
    const source_id = parseInt(source);
    if (isNaN(balangay_id) || isNaN(source_id)) {
      setError("Invalid balangay or source selection.");
      return;
    }

    setLoading(true);
    try {
      await addPurok(purok, balangay_id, source_id, latitude, longitude);
      setSuccess("Purok added!");
      setPurok('');
      setBalangay('');
      setSource('');
      setLatitude('');
      setLongitude('');
    } catch (error) {
      setError("Failed to add purok.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid mx-4 my-3" style={{ maxWidth: '600px' }}>
      <h2>Add Purok</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="mb-3">
        <label htmlFor="purokInput" className="form-label">Purok</label>
        <input
          type="text"
          className="form-control"
          id="purokInput"
          placeholder="Enter Purok"
          value={purok}
          onChange={(e) => setPurok(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="balangayInput" className="form-label">Balangay</label>
        <select
          className="form-select"
          id="balangayInput"
          value={balangay}
          onChange={(e) => setBalangay(e.target.value)}
        >
          <option value="">Select Balangay</option>
          {balangays.map((b) => (
            <option key={b.id} value={b.id}>
              {b.balangay}
            </option>
          ))}
        </select>
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
            <option key={src.id} value={src.id}>
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

export default AddPurok;
