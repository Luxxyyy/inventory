import React, { useEffect, useState } from "react";
import {
  getLegendItems,
  updateLegendItem,
  deleteLegendItem,
} from "../../api/legend_api";
import cssNamedColors from "../../utils/cssNamedColors";
import Modal from "../Modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Alert from "@mui/material/Alert";

type LegendItem = {
  id: number;
  label: string;
  type: "line" | "dot";
  color: string;
  cssClass: string;
};

const EditLegendItem: React.FC = () => {
  const [legendItems, setLegendItems] = useState<LegendItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedItem, setSelectedItem] = useState<LegendItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<LegendItem | null>(null);
  const [editForm, setEditForm] = useState({
    label: "",
    type: "line",
    color: "",
    cssClass: "",
  });
  const [modalError, setModalError] = useState("");

  const [page, setPage] = useState(1);
  const rowsPerPage = 15;

  useEffect(() => {
    fetchLegendItems();
  }, []);

  const fetchLegendItems = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getLegendItems();
      const sortedItems = data.sort(
        (a: LegendItem, b: LegendItem) => b.id - a.id
      );
      setLegendItems(sortedItems);
    } catch (err) {
      setError("Failed to fetch legend items");
      toast.error("Failed to fetch legend items");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (item: LegendItem) => {
    setSelectedItem(item);
    setEditForm({
      label: item.label,
      type: item.type,
      color: item.color,
      cssClass: item.cssClass,
    });
    setModalError("");
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalError("");
  };

  const handleTextFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({ ...prev, [name!]: value }));
  };

  const handleColorChange = (event: SelectChangeEvent<string>) => {
    const selectedColor = event.target.value;
    setEditForm((prev) => ({
      ...prev,
      color: selectedColor,
      cssClass: `${selectedColor}-${prev.type}`,
    }));
  };

  const handleUpdate = async () => {
    const { label, type, color, cssClass } = editForm;

    if (!label.trim() || !type.trim() || !color.trim()) {
      setModalError("Label, Type, and Color are required.");
      return;
    }

    try {
      if (selectedItem?.id) {
        await updateLegendItem(
          selectedItem.id,
          label.trim(),
          type.trim() as "line" | "dot",
          color.trim(), // Save as named color
          cssClass.trim()
        );
      }
      toast.success("Legend item updated successfully");
      closeModal();
      fetchLegendItems();
    } catch (err) {
      setModalError("Failed to update legend item");
      toast.error("Failed to update legend item");
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete?.id) return;

    try {
      await deleteLegendItem(itemToDelete.id);
      toast.success("Legend item deleted successfully");
      setItemToDelete(null);
      fetchLegendItems();
    } catch (err) {
      toast.error("Failed to delete legend item");
    }
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const paginatedItems = legendItems.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <div className="container mx-auto my-4" style={{ maxWidth: "95%" }}>
      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div
            className="spinner-border text-primary"
            role="status"
            aria-label="Loading"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          {legendItems.length === 0 ? (
            <p>No legend items found.</p>
          ) : (
            <>
              <TableContainer component={Paper} sx={{ maxHeight: 750 }}>
                <Table
                  stickyHeader
                  aria-label="legend items table"
                  size="small"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "1rem",
                          backgroundColor: "#17a2b8",
                          color: "white",
                        }}
                      >
                        Label
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "1rem",
                          backgroundColor: "#17a2b8",
                          color: "white",
                        }}
                      >
                        Type
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "1rem",
                          backgroundColor: "#17a2b8",
                          color: "white",
                        }}
                      >
                        Color
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          fontSize: "1rem",
                          backgroundColor: "#17a2b8",
                          color: "white",
                        }}
                      >
                        CSS Class
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: "bold",
                          fontSize: "1rem",
                          backgroundColor: "#17a2b8",
                          color: "white",
                        }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedItems.map(
                      ({ id, label, type, color, cssClass }) => (
                        <TableRow key={id} hover>
                          <TableCell>{label}</TableCell>
                          <TableCell>{type}</TableCell>
                          <TableCell>
                            <div
                              style={{
                                width: "20px",
                                height: "20px",
                                backgroundColor:
                                  (cssNamedColors as any)[color] || color,
                                border: "1px solid #ccc",
                                display: "inline-block",
                                marginRight: "8px",
                              }}
                            />
                            <span>{color}</span>
                          </TableCell>
                          <TableCell>{cssClass || "-"}</TableCell>
                          <TableCell align="center">
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() =>
                                openEditModal({ id, label, type, color, cssClass })
                              }
                              sx={{ mr: 1 }}
                            >
                              <EditIcon sx={{ fontSize: "1rem" }} />
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() =>
                                setItemToDelete({ id, label, type, color, cssClass })
                              }
                              sx={{ fontSize: ".75rem" }}
                            >
                              <DeleteIcon sx={{ fontSize: "1rem" }} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Pagination
                count={Math.ceil(legendItems.length / rowsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                sx={{ mt: 2, display: "flex", justifyContent: "center" }}
              />
            </>
          )}
        </>
      )}

      {selectedItem && (
        <Modal onClose={closeModal} title="Edit Legend Item">
          <form noValidate>
            <TextField
              fullWidth
              label="Label"
              name="label"
              value={editForm.label}
              onChange={handleTextFieldChange}
              margin="normal"
              autoFocus
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="type-label">Type</InputLabel>
              <Select
                labelId="type-label"
                label="Type"
                name="type"
                value={editForm.type}
                onChange={handleSelectChange}
              >
                <MenuItem value="line">Line</MenuItem>
                <MenuItem value="dot">Dot</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel id="color-label">Color</InputLabel>
              <Select
                labelId="color-label"
                label="Color"
                name="color"
                value={editForm.color}
                onChange={handleColorChange}
              >
                {Object.keys(cssNamedColors).map((name) => (
                  <MenuItem key={name} value={name}>
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: (cssNamedColors as any)[name],
                        display: "inline-block",
                        marginRight: "8px",
                        border: "1px solid #ccc",
                      }}
                    />
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="CSS Class"
              name="cssClass"
              value={editForm.cssClass}
              onChange={handleTextFieldChange}
              margin="normal"
            />

            {modalError && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {modalError}
              </Alert>
            )}

            <Stack
              direction="row"
              justifyContent="flex-end"
              spacing={1}
              sx={{ mt: 2 }}
            >
              <Button variant="outlined" onClick={closeModal}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleUpdate}>
                Save
              </Button>
            </Stack>
          </form>
        </Modal>
      )}

      {itemToDelete && (
        <Modal onClose={() => setItemToDelete(null)} title="Confirm Delete">
          <p>
            Are you sure you want to delete{" "}
            <strong>{itemToDelete.label}</strong>?
          </p>
          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={1}
            sx={{ mt: 2 }}
          >
            <Button variant="outlined" onClick={() => setItemToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={confirmDelete}
            >
              Confirm Delete
            </Button>
          </Stack>
        </Modal>
      )}
    </div>
  );
};

export default EditLegendItem;
