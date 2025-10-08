import React, { useEffect, useState } from "react";
import { getSources } from "../../api/source_api";
import { getSheets, updateSheet, deleteSheet } from "../../api/sheet_api";
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

type SheetType = {
  id: number;
  sheet: string;
  latitude: string;
  longitude: string;
  date_added: string;
  source_id: number;
  source_name?: string | null;
};

const EditSheet: React.FC = () => {
  const [sheets, setSheets] = useState<SheetType[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedSheet, setSelectedSheet] = useState<SheetType | null>(null);
  const [sheetToDelete, setSheetToDelete] = useState<SheetType | null>(null);
  const [editForm, setEditForm] = useState({
    sheet: "",
    latitude: "",
    longitude: "",
    source_id: "",
  });
  const [modalError, setModalError] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const paginatedSheets = sheets.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const fetchSheets = async () => {
    try {
      setLoading(true);
      const data: any = await getSheets();
      const arr: any[] = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];

      const parsed = arr.map((s: any) => ({
        id: s.id,
        sheet: s.sheet_name,
        latitude: s.latitude,
        longitude: s.longitude,
        date_added: s.date_added,
        source_id: s.source_id,
        source_name: s.source_name,
      }));

      const sorted = parsed.sort((a, b) => (b?.id ?? 0) - (a?.id ?? 0));
      setSheets(sorted);
    } catch {
      setError("Failed to fetch sheets");
      toast.error("Failed to fetch sheets");
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
    fetchSheets();
    fetchSources();
  }, []);

  const openEditModal = (sheet: SheetType) => {
    setSelectedSheet(sheet);
    setEditForm({
      sheet: sheet.sheet,
      latitude: sheet.latitude,
      longitude: sheet.longitude,
      source_id: String(sheet.source_id),
    });
    setModalError("");
  };

  const closeModal = () => {
    setSelectedSheet(null);
    setModalError("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    const { sheet, latitude, longitude, source_id } = editForm;

    if (!sheet || !latitude || !longitude || !source_id) {
      setModalError("All fields are required");
      return;
    }

    try {
      await updateSheet(selectedSheet?.id!, sheet, parseInt(source_id), longitude, latitude);
      toast.success("Sheet updated successfully");
      closeModal();
      fetchSheets();
    } catch {
      setModalError("Failed to update sheet");
      toast.error("Failed to update sheet");
    }
  };

  const handleDelete = async () => {
    if (!sheetToDelete?.id) return;

    try {
      await deleteSheet(sheetToDelete.id);
      toast.success("Sheet deleted successfully");
      setSheetToDelete(null);
      fetchSheets();
    } catch {
      toast.error("Failed to delete sheet");
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
                    Sheet
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
                {paginatedSheets.map(({ id, sheet, latitude, longitude, source_name, source_id, date_added }) => (
                  <TableRow key={id}>
                    <TableCell>{sheet}</TableCell>
                    <TableCell>{latitude}</TableCell>
                    <TableCell>{longitude}</TableCell>
                    <TableCell>{source_name}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        onClick={() =>
                          openEditModal({ id, sheet, latitude, longitude, source_name, source_id, date_added })
                        }
                        sx={{ mr: 1 }}
                      >
                        <EditIcon sx={{ fontSize: '1rem' }} />
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() =>
                          setSheetToDelete({ id, sheet, latitude, longitude, source_name, source_id, date_added })
                        }
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
            count={Math.ceil(sheets.length / rowsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            sx={{ mt: 2, display: "flex", justifyContent: "center" }}
          />
        </>
      )}

      {/* Edit Modal */}
      {selectedSheet && (
        <Modal onClose={closeModal} title="Edit Sheet">
          <div className="mb-3">
            <label className="form-label">Sheet</label>
            <input
              name="sheet"
              type="text"
              className="form-control"
              value={editForm.sheet}
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
      {sheetToDelete && (
        <Modal onClose={() => setSheetToDelete(null)} title="Confirm Delete">
          <p>
            Are you sure you want to delete <strong>{sheetToDelete.sheet}</strong>?
          </p>
          <div className="d-flex justify-content-end">
            <button className="btn btn-secondary me-2" onClick={() => setSheetToDelete(null)}>
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

export default EditSheet;
