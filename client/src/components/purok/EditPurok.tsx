import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "../Modal";
import http from "../../api/http";
import { getSources } from "../../api/source_api";
import { getBalangays } from "../../api/balangay_api";

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
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

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

type Source = {
  id: number;
  source: string;
};

type Balangay = {
  id: number;
  balangay: string;
};

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
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const fetchPuroks = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await http.get("/puroks");
      const sorted = data.sort((a: any, b: any) => (b.id ?? 0) - (a.id ?? 0));
      setPuroks(sorted);
    } catch {
      setError("Failed to fetch puroks");
      toast.error("Failed to fetch puroks");
    } finally {
      setLoading(false);
    }
  };

  const fetchSourcesAndBalangays = async () => {
    try {
      const [srcListRaw, bgyListRaw] = await Promise.all([getSources(), getBalangays()]);

      const srcArr = Array.isArray(srcListRaw)
        ? srcListRaw
        : Array.isArray((srcListRaw as any)?.data)
        ? (srcListRaw as any).data
        : [];

      const bgyArr = Array.isArray(bgyListRaw)
        ? bgyListRaw
        : Array.isArray((bgyListRaw as any)?.data)
        ? (bgyListRaw as any).data
        : [];

      const validSources = srcArr.filter(
        (s: any) => typeof s?.id === "number" && typeof s?.source === "string"
      );
      const validBalangays = bgyArr.filter(
        (b: any) => typeof b?.id === "number" && typeof b?.balangay === "string"
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

  const handleInputFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const paginatedPuroks = puroks.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="container mx-auto my-4" style={{ maxWidth: "95%" }}>
      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status" aria-label="Loading">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          {puroks.length === 0 ? (
            <p>No puroks found.</p>
          ) : (
            <>
              <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                <Table stickyHeader aria-label="puroks table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', color: 'white', backgroundColor: '#17a2b8', fontSize: '1rem' }}>Purok</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'white', backgroundColor: '#17a2b8', fontSize: '1rem' }}>Latitude</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'white', backgroundColor: '#17a2b8', fontSize: '1rem' }}>Longitude</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'white', backgroundColor: '#17a2b8', fontSize: '1rem' }}>Barangay</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'white', backgroundColor: '#17a2b8', fontSize: '1rem' }}>Source</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold', color: 'white', backgroundColor: '#17a2b8', fontSize: '1rem' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedPuroks.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>{p.purok}</TableCell>
                        <TableCell>{p.latitude}</TableCell>
                        <TableCell>{p.longitude}</TableCell>
                        <TableCell>{p.balangay_name}</TableCell>
                        <TableCell>{p.source_name}</TableCell>
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            size="small"
                            sx={{ mr: 1 }}
                            onClick={() => openEditModal(p)}
                          >
                            <EditIcon sx={{ fontSize: '1rem' }} />
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => setDeletePurokItem(p)}
                          >
                            <DeleteIcon sx={{ fontSize: '1rem' }} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Stack spacing={2} sx={{ mt: 2 }} alignItems="center">
                <Pagination
                  count={Math.ceil(puroks.length / rowsPerPage)}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Stack>
            </>
          )}
        </>
      )}

      {/* Edit Modal */}
      {selectedPurok && (
        <Modal onClose={closeModal} title="Edit Purok">
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Purok/Balangay"
              name="purok"
              value={editForm.purok}
              onChange={handleInputFieldChange}
              fullWidth
              autoFocus
            />
            <TextField
              label="Latitude"
              name="latitude"
              value={editForm.latitude}
              onChange={handleInputFieldChange}
              fullWidth
            />
            <TextField
              label="Longitude"
              name="longitude"
              value={editForm.longitude}
              onChange={handleInputFieldChange}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id="balangay-label">Barangay</InputLabel>
              <Select
                labelId="balangay-label"
                label="Barangay"
                name="balangay_id"
                value={editForm.balangay_id}
                onChange={handleSelectChange}
              >
                <MenuItem value="">
                  <em>Select Barangay</em>
                </MenuItem>
                {balangays.map((b) => (
                  <MenuItem key={b.id} value={b.id}>
                    {b.balangay}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="source-label">Source</InputLabel>
              <Select
                labelId="source-label"
                label="Source"
                name="source_id"
                value={editForm.source_id}
                onChange={handleSelectChange}
              >
                <MenuItem value="">
                  <em>Select Source</em>
                </MenuItem>
                {sources.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.source}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {modalError && (
              <div className="alert alert-danger" style={{ marginTop: 8 }}>
                {modalError}
              </div>
            )}
            <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 2 }}>
              <Button variant="outlined" onClick={closeModal}>
                Cancel
              </Button>
              <Button variant="contained" color="success" onClick={handleUpdate}>
                Save
              </Button>
            </Stack>
          </Stack>
        </Modal>
      )}

      {/* Delete Modal */}
      {deletePurokItem && (
        <Modal onClose={() => setDeletePurokItem(null)} title="Confirm Delete">
          <p>
            Are you sure you want to delete <strong>{deletePurokItem.purok}</strong>?
          </p>
          <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button variant="outlined" onClick={() => setDeletePurokItem(null)}>
              Cancel
            </Button>
            <Button variant="contained" color="error" onClick={handleDelete}>
              Delete
            </Button>
          </Stack>
        </Modal>
      )}
    </div>
  );
};

export default EditPurok;
