import { useEffect, useState } from "react";
import { getSources, SourceType } from "../../api/source_api";
import http from "../../api/http";
import Modal from "../Modal";
import '../../design/source.css';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditSource = () => {
    const [sources, setSources] = useState<SourceType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedSource, setSelectedSource] = useState<SourceType | null>(null);
    const [editForm, setEditForm] = useState({
        source: "",
        latitude: "",
        longitude: ""
    });
    const [modalError, setModalError] = useState("");

    const [sourceToDelete, setSourceToDelete] = useState<SourceType | null>(null);

    const fetchSources = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await getSources();
            const sorted = data.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
            setSources(sorted);
        } catch {
            setError("Failed to fetch sources");
            toast.error("Failed to fetch sources");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSources();
    }, []);

    const openEditModal = (source: SourceType) => {
        setSelectedSource(source);
        setEditForm({
            source: source.source,
            latitude: source.latitude,
            longitude: source.longitude,
        });
        setModalError("");
    };

    const closeModal = () => {
        setSelectedSource(null);
        setModalError("");
    };

    const openDeleteModal = (source: SourceType) => {
        setSourceToDelete(source);
    };

    const cancelDelete = () => {
        setSourceToDelete(null);
    };

    const confirmDelete = async () => {
        if (!sourceToDelete?.id) return;
        try {
            await http.delete(`/sources/${sourceToDelete.id}`);
            toast.success("Source deleted successfully");
            setSourceToDelete(null);
            fetchSources();
        } catch {
            toast.error("Failed to delete source");
        }
    };

    const handleUpdate = async () => {
        const { source, latitude, longitude } = editForm;

        if (!source.trim() || !latitude.trim() || !longitude.trim()) {
            setModalError("All fields are required");
            return;
        }

        try {
            await http.put(`/sources/${selectedSource?.id}`, {
                source: source.trim(),
                latitude: latitude.trim(),
                longitude: longitude.trim(),
            });
            toast.success("Source updated successfully");
            closeModal();
            fetchSources();
        } catch {
            setModalError("Failed to update source");
            toast.error("Failed to update source");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="container mx-auto my-4" style={{ maxWidth: 900 }}>
            <h2 className="mb-4">Edit Sources</h2>
            {loading && (
                <div className="d-flex justify-content-center my-5">
                    <div className="spinner-border text-primary" role="status" aria-label="Loading">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
            {error && <div className="alert alert-danger">{error}</div>}
            {!loading && !error && (
                <>
                    {sources.length === 0 ? (
                        <p>No sources found.</p>
                    ) : (
                        <div className="card shadow-sm">
                            <div
                                className="table-responsive"
                                style={{ maxHeight: 400, overflowY: "auto" }}
                            >
                                <table className="table table-hover mb-0">
                                    <thead className="sticky-top source-header">
                                        <tr>
                                            <th>Source</th>
                                            <th>Latitude</th>
                                            <th>Longitude</th>
                                            <th className="text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sources.map(({ id, source, latitude, longitude }) => (
                                            <tr key={id}>
                                                <td>{source}</td>
                                                <td>{latitude}</td>
                                                <td>{longitude}</td>
                                                <td className="text-center">
                                                    <button
                                                        className="btn btn-sm btn-success me-2 text-white"
                                                        onClick={() =>
                                                            openEditModal({ id, source, latitude, longitude })
                                                        }
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-sm source-button btn-danger text-white"
                                                        onClick={() =>
                                                            openDeleteModal({ id, source, latitude, longitude })
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
                </>
            )}
            {selectedSource && (
                <Modal onClose={closeModal} title="Edit Source">
                    <div className="mb-3">
                        <label htmlFor="source" className="form-label">Source</label>
                        <input
                            id="source"
                            name="source"
                            type="text"
                            className="form-control"
                            value={editForm.source}
                            onChange={handleInputChange}
                            autoFocus
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="latitude" className="form-label">Latitude</label>
                        <input
                            id="latitude"
                            name="latitude"
                            type="text"
                            className="form-control"
                            value={editForm.latitude}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="longitude" className="form-label">Longitude</label>
                        <input
                            id="longitude"
                            name="longitude"
                            type="text"
                            className="form-control"
                            value={editForm.longitude}
                            onChange={handleInputChange}
                        />
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
            {sourceToDelete && (
                <Modal
                    onClose={cancelDelete}
                    title="Confirm Delete"
                >
                    <p>
                        Are you sure you want to delete <strong>{sourceToDelete.source}</strong>?
                    </p>
                    <div className="d-flex justify-content-end">
                        <button className="btn btn-primary me-2" onClick={cancelDelete}>
                            Cancel
                        </button>
                        <button className="btn btn-danger text-white" onClick={confirmDelete}>
                            Confirm Delete
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default EditSource;