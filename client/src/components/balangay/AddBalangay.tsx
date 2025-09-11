import { useState, useEffect } from "react";
import { getSources } from "../../api/source_api";
import { addBalangay } from "../../api/balangay_api";

function AddBalangay() {
  const [balangay, setBalangay] = useState('');
  const [source, setSource] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [sources, setSources] = useState<{ id: number; source: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getSources()
      .then((data) => setSources(data))
      .catch(() => setSources([]));
  }, []);

  const handleAdd = async () => {
    setError('');
    setSuccess('');

    if (!balangay || !source || !latitude || !longitude) {
      setError("All fields are required!");
      return;
    }

    const parsedSourceId = parseInt(source);
    if (isNaN(parsedSourceId)) {
      setError("Invalid source selected!");
      return;
    }

    setLoading(true);
    try {
      await addBalangay(balangay, parsedSourceId, longitude, latitude);
      setSuccess("Balangay added!");

      setBalangay('');
      setSource('');
      setLatitude('');
      setLongitude('');
    } catch (error) {
      setError("Failed to add balangay.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid mx-4 my-3" style={{ maxWidth: '600px' }}>
      <h2>Add Balangay</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="mb-3">
        <label htmlFor="balangayInput" className="form-label">Balangay</label>
        <input
          type="text"
          className="form-control"
          id="balangayInput"
          placeholder="Enter Balangay"
          value={balangay}
          onChange={(e) => setBalangay(e.target.value)}
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

export default AddBalangay;
