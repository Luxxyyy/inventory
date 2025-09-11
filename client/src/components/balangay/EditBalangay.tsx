import { useEffect, useState } from "react";
import { getSources } from "../../api/source_api";
import http from "../../api/http";
import Modal from "../Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../../design/balangay.css';

type BalangayType = {
  id: number;
  balangay: string;
  latitude: string;
  longitude: string;
  date_added: string;
  source_id: number;
  source_name?: string | null;
};

const EditBalangay = () => {
  const [balangays, setBalangays] = useState<BalangayType[]>([]);
  const [sources, setSources] = useState<{ id: number; source: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBalangay, setSelectedBalangay] = useState<BalangayType | null>(null);
  const [balangayToDelete, setBalangayToDelete] = useState<BalangayType | null>(null);
  const [editForm, setEditForm] = useState({
    balangay: "",
    latitude: "",
    longitude: "",
    source_id: "",
  });
  const [modalError, setModalError] = useState("");

  const fetchBalangays = async () => {
    try {
      setLoading(true);
      const { data } = await http.get("/balangays");
      const sorted = data.sort((a: BalangayType, b: BalangayType) => (b.id ?? 0) - (a.id ?? 0));
      setBalangays(sorted);
    } catch {
      setError("Failed to fetch balangays");
      toast.error("Failed to fetch balangays");
    } finally {
      setLoading(false);
    }
  };

  const fetchSources = async () => {
    try {
      const data = await getSources();
      setSources(data);
    } catch {
      toast.error("Failed to fetch sources");
    }
  };

  useEffect(() => {
    fetchBalangays();
    fetchSources();
  }, []);

  const openEditModal = (balangay: BalangayType) => {
    setSelectedBalangay(balangay);
    setEditForm({
      balangay: balangay.balangay,
      latitude: balangay.latitude,
      longitude: balangay.longitude,
      source_id: String(balangay.source_id),
    });
    setModalError("");
  };

  const closeModal = () => {
    setSelectedBalangay(null);
    setModalError("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    const { balangay, latitude, longitude, source_id } = editForm;

    if (!balangay || !latitude || !longitude || !source_id) {
      setModalError("All fields are required");
      return;
    }

    try {
      await http.put(`/balangays/${selectedBalangay?.id}`, {
        balangay,
        latitude,
        longitude,
        source_id: parseInt(source_id),
      });

      toast.success("Balangay updated successfully");
      closeModal();
      fetchBalangays();
    } catch {
      setModalError("Failed to update balangay");
      toast.error("Failed to update balangay");
    }
  };

  const handleDelete = async () => {
    if (!balangayToDelete?.id) return;

    try {
      await http.delete(`/balangays/${balangayToDelete.id}`);
      toast.success("Balangay deleted successfully");
      setBalangayToDelete(null);
      fetchBalangays();
    } catch {
      toast.error("Failed to delete balangay");
    }
  };

  return (
    <div className="container mx-auto my-4" style={{ maxWidth: 900 }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="mb-4">Edit Balangays</h2>

      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div className="card shadow-sm">
          <div className="table-responsive" style={{ maxHeight: 400, overflowY: "auto" }}>
            <table className="table table-hover mb-0">
              <thead className="sticky-top balangay-header">
                <tr>
                  <th>Balangay</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                  <th>Source</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {balangays.map(({ id, balangay, latitude, longitude, source_name, source_id, date_added }) => (
                  <tr key={id}>
                    <td>{balangay}</td>
                    <td>{latitude}</td>
                    <td>{longitude}</td>
                    <td>{source_name}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-success text-white me-2"
                        onClick={() =>
                          openEditModal({ id, balangay, latitude, longitude, source_name, source_id, date_added })
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger text-white"
                        onClick={() =>
                          setBalangayToDelete({ id, balangay, latitude, longitude, source_name, source_id, date_added })
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedBalangay && (
        <Modal onClose={closeModal} title="Edit Balangay">
          <div className="mb-3">
            <label className="form-label">Balangay</label>
            <input
              name="balangay"
              type="text"
              className="form-control"
              value={editForm.balangay}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Latitude</label>
            <input
              name="latitude"
              type="text"
              className="form-control"
              value={editForm.latitude}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Longitude</label>
            <input
              name="longitude"
              type="text"
              className="form-control"
              value={editForm.longitude}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Source</label>
            <select
              name="source_id"
              className="form-select"
              value={editForm.source_id}
              onChange={handleInputChange}
            >
              <option value="">Select source</option>
              {sources.map((src) => (
                <option key={src.id} value={src.id}>
                  {src.source}
                </option>
              ))}
            </select>
          </div>

          {modalError && <div className="alert alert-danger">{modalError}</div>}

          <div className="d-flex justify-content-end">
            <button className="btn btn-primary me-2 text-white" onClick={closeModal}>
              Cancel
            </button>
            <button className="btn btn-success text-white" onClick={handleUpdate}>
              Save
            </button>
          </div>
        </Modal>
      )}

      {balangayToDelete && (
        <Modal onClose={() => setBalangayToDelete(null)} title="Confirm Delete">
          <p>
            Are you sure you want to delete <strong>{balangayToDelete.balangay}</strong>?
          </p>
          <div className="d-flex justify-content-end">
            <button className="btn btn-primary me-2" onClick={() => setBalangayToDelete(null)}>
              Cancel
            </button>
            <button className="btn btn-danger text-white" onClick={handleDelete}>
              Confirm Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EditBalangay;
