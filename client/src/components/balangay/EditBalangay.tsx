import React, { useEffect, useState } from "react";
import { getSources } from "../../api/source_api";
import http from "../../api/http";
import Modal from "../Modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { Source } from "../../types/mapTypes";

// MUI Components
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

type BalangayType = {
  id: number;
  balangay: string;
  latitude: string;
  longitude: string;
  date_added: string;
  source_id: number;
  source_name?: string | null;
};

const EditBalangay: React.FC = () => {
  const [balangays, setBalangays] = useState<BalangayType[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
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

  // Pagination
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const paginatedBalangays = balangays.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const fetchBalangays = async () => {
    try {
      setLoading(true);
      const { data } = await http.get("/balangays");
      const arr: any[] = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
      const sorted = arr.sort((a: any, b: any) => (b?.id ?? 0) - (a?.id ?? 0));
      setBalangays(sorted as BalangayType[]);
    } catch {
      setError("Failed to fetch balangays");
      toast.error("Failed to fetch balangays");
    } finally {
      setLoading(false);
    }
  };

  const fetchSources = async () => {
    try {
      const data: any = await getSources();
      const arr: any[] = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
      const valid = arr.filter((s: any) => typeof s?.id === "number" && typeof s?.source === "string");
      setSources(valid as Source[]);
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
    setEditForm((prev) => ({ ...prev, [name]: value }));
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
        source_id: parseInt(source_id, 10),
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
    <div className="container mx-auto my-4" style={{ maxWidth: "95%" }}>
      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ maxHeight: 750 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1rem", backgroundColor: "#17a2b8", color: "white" }}>
                    Barangay
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1rem", backgroundColor: "#17a2b8", color: "white" }}>
                    Latitude
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1rem", backgroundColor: "#17a2b8", color: "white" }}>
                    Longitude
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1rem", backgroundColor: "#17a2b8", color: "white" }}>
                    Source
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "1rem", backgroundColor: "#17a2b8", color: "white" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedBalangays.map(({ id, balangay, latitude, longitude, source_name, source_id, date_added }) => (
                  <TableRow key={id}>
                    <TableCell>{balangay}</TableCell>
                    <TableCell>{latitude}</TableCell>
                    <TableCell>{longitude}</TableCell>
                    <TableCell>{source_name}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        onClick={() =>
                          openEditModal({ id, balangay, latitude, longitude, source_name, source_id, date_added })
                        }
                        sx={{ mr: 1 }}
                      > <EditIcon sx={{ fontSize: '1rem' }} />
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() =>
                          setBalangayToDelete({ id, balangay, latitude, longitude, source_name, source_id, date_added })
                        }
                      > <DeleteIcon sx={{ fontSize: '1rem' }} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Pagination
            count={Math.ceil(balangays.length / rowsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            sx={{ mt: 2, display: "flex", justifyContent: "center" }}
          />
        </>
      )}

      {/* Edit Modal */}
      {selectedBalangay && (
        <Modal onClose={closeModal} title="Edit Balangay">
          <div className="mb-3">
            <label className="form-label">Barangay</label>
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
                <option key={src.id} value={String(src.id)}>
                  {src.source}
                </option>
              ))}
            </select>
          </div>
          {modalError && <div className="alert alert-danger">{modalError}</div>}
          <div className="d-flex justify-content-end">
            <button className="btn btn-secondary me-2" onClick={closeModal}>
              Cancel
            </button>
            <button className="btn btn-success text-white" onClick={handleUpdate}>
              Save
            </button>
          </div>
        </Modal>
      )}

      {/* Delete Modal */}
      {balangayToDelete && (
        <Modal onClose={() => setBalangayToDelete(null)} title="Confirm Delete">
          <p>
            Are you sure you want to delete <strong>{balangayToDelete.balangay}</strong>?
          </p>
          <div className="d-flex justify-content-end">
            <button className="btn btn-secondary me-2" onClick={() => setBalangayToDelete(null)}>
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
