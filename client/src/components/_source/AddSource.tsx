import { useState } from 'react';
import { addSource } from '../../api/source_api';

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddSource() {
  const [source, setSource] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleSubmit = async () => {
    if (!source.trim() || !latitude.trim() || !longitude.trim()) {
      toast.error('All fields are required!');
      return;
    }

    try {
      const data = await addSource(source.trim(), latitude.trim(), longitude.trim());
      toast.success(`Inserted: ${data.source}`);
      setSource('');
      setLatitude('');
      setLongitude('');
    } catch (error) {
      console.error('Error inserting source:', error);
      toast.error('Something went wrong!');
    }
  };

  return (
    <div className="container-fluid mx-4 my-3" style={{ maxWidth: '600px' }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <h2>Add Source</h2>

      <div className="mb-3">
        <label className="form-label">Source</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter Source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Latitude</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter Latitude"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Longitude</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter Longitude"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
        />
      </div>

      <button type="button" className="btn btn-success text-white" onClick={handleSubmit}>
        Add
      </button>
    </div>
  );
}

export default AddSource;
