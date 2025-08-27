import { useState } from 'react';
import { addSource } from '../api/source_api';

function Source() {
  const [balangay, setBalangay] = useState('');
  const [source, setSource] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleSubmit = async () => {
    if (!balangay || !source || !latitude || !longitude) {
      alert('All fields are required!');
      return;
    }

    try {
      const data = await addSource(balangay, source, latitude, longitude);
      alert(`Inserted: ${data.source} (${data.balangay})`);
      setBalangay('');
      setSource('');
      setLatitude('');
      setLongitude('');
    } catch (error) {
      console.error('Error inserting source:', error);
      alert('Something went wrong!');
    }
  };

  return (
    <div className="fuild-container mx-4 my-3">
      <div className="mb-3" id="input-box">
        <label className="form-label">Balangay</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter Balangay"
          value={balangay}
          onChange={(e) => setBalangay(e.target.value)}
        />
      </div>
      <div className="mb-3" id="input-box">
        <label className="form-label">Source</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter Source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />
      </div>
      <div className="mb-3" id="input-box">
        <label className="form-label">Latitude</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter Latitude"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
        />
      </div>
      <div className="mb-3" id="input-box">
        <label className="form-label">Longitude</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter Longitude"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
        />
      </div>
      <button type="button" className="btn btn-primary m-1" onClick={handleSubmit}>
        Add
      </button>
    </div>
  );
}

export default Source;