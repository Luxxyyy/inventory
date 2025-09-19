import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "../Modal";
import http from "../../api/http";
import { getSources } from "../../api/source_api";
import { getBalangays } from "../../api/balangay_api";
import "../../design/purok.css";

type PurokType = {
    id: number;
    purok: string;
    latitude: string;
    longitude: string;
    date_added: string;
    balangay_id: number;
    balangay_name?: string;
    source_id: number;
    source_name?: string;
};

type Source = { id: number; source: string };
type Balangay = { id: number; balangay: string };

const EditPurok = () => {
    const [puroks, setPuroks] = useState<PurokType[]>([]);
    const [sources, setSources] = useState<Source[]>([]);
    const [balangays, setBalangays] = useState<Balangay[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedPurok, setSelectedPurok] = useState<PurokType | null>(null);
    const [deletePurokItem, setDeletePurokItem] = useState<PurokType | null>(null);

    const [editForm, setEditForm] = useState({
        purok: "",
        latitude: "",
        longitude: "",
        balangay_id: "",
        source_id: "",
    });

    const [modalError, setModalError] = useState("");

    const fetchPuroks = async () => {
        try {
            const { data } = await http.get("/puroks");
            setPuroks(data);
        } catch {
            setError("Failed to fetch puroks");
            toast.error("Failed to fetch puroks");
        } finally {
            setLoading(false);
        }
    };

    const fetchSourcesAndBalangays = async () => {
        try {
            const [srcListRaw, bgyListRaw] = await Promise.all([
                getSources(),
                getBalangays(),
            ]);

            const srcList: any = srcListRaw as any;
            const bgyList: any = bgyListRaw as any;

            const srcArr: any[] = Array.isArray(srcList)
                ? srcList
                : Array.isArray(srcList?.data)
                ? srcList.data
                : [];

            const bgyArr: any[] = Array.isArray(bgyList)
                ? bgyList
                : Array.isArray(bgyList?.data)
                ? bgyList.data
                : [];

            const validSources = srcArr.filter(
                (s: any) =>
                    typeof s?.id === "number" && typeof s?.source === "string"
            );
            const validBalangays = bgyArr.filter(
                (b: any) =>
                    typeof b?.id === "number" && typeof b?.balangay === "string"
            );

            setSources(validSources as Source[]);
            setBalangays(validBalangays as Balangay[]);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch sources or balangays");
        }
    };

    useEffect(() => {
        fetchPuroks();
        fetchSourcesAndBalangays();
    }, []);

    const openEditModal = (p: PurokType) => {
        setSelectedPurok(p);
        setEditForm({
            purok: p.purok,
            latitude: p.latitude,
            longitude: p.longitude,
            balangay_id: String(p.balangay_id),
            source_id: String(p.source_id),
        });
        setModalError("");
    };

    const closeModal = () => {
        setSelectedPurok(null);
        setModalError("");
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        const { purok, latitude, longitude, balangay_id, source_id } = editForm;
        if (!purok || !latitude || !longitude || !balangay_id || !source_id) {
            setModalError("All fields are required");
            return;
        }

        try {
            await http.put(`/puroks/${selectedPurok?.id}`, {
                purok,
                latitude,
                longitude,
                balangay_id: parseInt(balangay_id),
                source_id: parseInt(source_id),
            });
            toast.success("Purok updated successfully");
            closeModal();
            fetchPuroks();
        } catch {
            setModalError("Failed to update purok");
            toast.error("Failed to update purok");
        }
    };

    const handleDelete = async () => {
        if (!deletePurokItem) return;
        try {
            await http.delete(`/puroks/${deletePurokItem.id}`);
            toast.success("Purok deleted successfully");
            setDeletePurokItem(null);
            fetchPuroks();
        } catch {
            toast.error("Failed to delete purok");
        }
    };

    return (
        <div className="container my-4" style={{ maxWidth: "95%" }}>
            {loading ? (
                <div className="text-center my-5">
                    <div className="spinner-border text-primary" role="status" />
                </div>
            ) : error ? (
                <div className="alert alert-danger">{error}</div>
            ) : (
                <div className="card shadow-sm">
                    <div
                        className="table-responsive"
                        style={{ maxHeight: 400, overflowY: "auto" }}
                    >
                        <table className="table table-hover mb-0">
                            <thead className="sticky-top purok-header">
                                <tr>
                                    <th>Purok</th>
                                    <th>Latitude</th>
                                    <th>Longitude</th>
                                    <th>Barangay</th>
                                    <th>Source</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {puroks.map((p) => (
                                    <tr key={p.id}>
                                        <td>{p.purok}</td>
                                        <td>{p.latitude}</td>
                                        <td>{p.longitude}</td>
                                        <td>{p.balangay_name}</td>
                                        <td>{p.source_name}</td>
                                        <td className="text-center">
                                            <button
                                                className="btn btn-sm btn-success me-2 text-white"
                                                onClick={() => openEditModal(p)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger text-white"
                                                onClick={() => setDeletePurokItem(p)}
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
            {selectedPurok && (
                <Modal onClose={closeModal} title="Edit Purok">
                    <div className="mb-3">
                        <label className="form-label">Purok/Balangay</label>
                        <input
                            name="purok"
                            className="form-control"
                            value={editForm.purok}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Latitude</label>
                        <input
                            name="latitude"
                            className="form-control"
                            value={editForm.latitude}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Longitude</label>
                        <input
                            name="longitude"
                            className="form-control"
                            value={editForm.longitude}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Barangay</label>
                        <select
                            name="balangay_id"
                            className="form-select"
                            value={editForm.balangay_id}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Barangay</option>
                            {balangays.map((b) => (
                                <option key={b.id} value={b.id}>
                                    {b.balangay}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Source</label>
                        <select
                            name="source_id"
                            className="form-select"
                            value={editForm.source_id}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Source</option>
                            {sources.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.source}
                                </option>
                            ))}
                        </select>
                    </div>
                    {modalError && (
                        <div className="alert alert-danger">{modalError}</div>
                    )}
                    <div className="d-flex justify-content-end">
                        <button className="btn btn-primary me-2" onClick={closeModal}>
                            Cancel
                        </button>
                        <button className="btn btn-success text-white" onClick={handleUpdate}>
                            Save
                        </button>
                    </div>
                </Modal>
            )}
            {deletePurokItem && (
                <Modal onClose={() => setDeletePurokItem(null)} title="Confirm Delete">
                    <p>
                        Are you sure you want to delete{" "}
                        <strong>{deletePurokItem.purok}</strong>?
                    </p>
                    <div className="d-flex justify-content-end">
                        <button
                            className="btn btn-primary me-2"
                            onClick={() => setDeletePurokItem(null)}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn btn-danger text-white"
                            onClick={handleDelete}
                        >
                            Delete
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default EditPurok;