import { useEffect, useState } from "react";
import { getSources, SourceType } from "../../api/source_api";
import http from "../../api/http";
import Modal from "../Modal";
import '../../design/source.css';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// MUI Components
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

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

    const [page, setPage] = useState(1);
    const rowsPerPage = 10;

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

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const paginatedSources = sources.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    return (
        <div className="container mx-auto my-4" style={{ maxWidth: "95%" }}>
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
                        <>
                            <TableContainer component={Paper} sx={{ maxHeight: 750 }}>
                                <Table stickyHeader aria-label="sources table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', backgroundColor: '#17a2b8', color: 'white' }}>Source</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', backgroundColor: '#17a2b8', color: 'white' }}>Latitude</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', backgroundColor: '#17a2b8', color: 'white' }}>Longitude</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1rem', backgroundColor: '#17a2b8', color: 'white' }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paginatedSources.map(({ id, source, latitude, longitude }) => (
                                            <TableRow key={id}>
                                                <TableCell>{source}</TableCell>
                                                <TableCell>{latitude}</TableCell>
                                                <TableCell>{longitude}</TableCell>
                                                <TableCell align="center">
                                                    <Button
                                                        variant="contained"
                                                        onClick={() => openEditModal({ id, source, latitude, longitude })}
                                                        sx={{ mr: 1 }}
                                                    >
                                                        <EditIcon sx={{ fontSize: '1rem' }} />
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        onClick={() => openDeleteModal({ id, source, latitude, longitude })}
                                                        sx={{ fontSize: '.75rem' }}
                                                    >
                                                        <DeleteIcon sx={{ fontSize: '1rem' }} />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Pagination
                                count={Math.ceil(sources.length / rowsPerPage)}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                                sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
                            />
                        </>
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
                <Modal onClose={cancelDelete} title="Confirm Delete">
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
