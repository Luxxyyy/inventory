import React, { useEffect, useState } from "react";
import http from "../../api/http";
import Modal from "../Modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// MUI
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

type SupplierType = {
  id: number;
  supplier_name: string;
  supplier_image?: string | null;
  date_added: string;
};

const EditSupplier: React.FC = () => {
  const [suppliers, setSuppliers] = useState<SupplierType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedSupplier, setSelectedSupplier] = useState<SupplierType | null>(null);
  const [supplierToDelete, setSupplierToDelete] = useState<SupplierType | null>(null);
  const [editForm, setEditForm] = useState({ supplier_name: "", supplier_image: "" });
  const [modalError, setModalError] = useState("");

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const { data } = await http.get("/suppliers");

      // Handle different possible API response shapes
      const arr =
        Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.suppliers)
          ? data.suppliers
          : [];

      const sorted = arr.sort((a: any, b: any) => (b?.id ?? 0) - (a?.id ?? 0));
      setSuppliers(sorted as SupplierType[]);
      setError("");
    } catch (err) {
      console.error("Supplier fetch error:", err);
      setError("Failed to fetch suppliers");
      toast.error("Failed to fetch suppliers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const openEditModal = (supplier: SupplierType) => {
    setSelectedSupplier(supplier);
    setEditForm({
      supplier_name: supplier.supplier_name,
      supplier_image: supplier.supplier_image || "",
    });
    setModalError("");
  };

  const closeModal = () => {
    setSelectedSupplier(null);
    setModalError("");
  };

  const handleUpdate = async () => {
    if (!editForm.supplier_name.trim()) {
      setModalError("Supplier name is required");
      return;
    }

    try {
      await http.put(`/suppliers/${selectedSupplier?.id}`, editForm);
      toast.success("Supplier updated successfully");
      closeModal();
      fetchSuppliers();
    } catch (err) {
      console.error("Update error:", err);
      setModalError("Failed to update supplier");
      toast.error("Failed to update supplier");
    }
  };

  const handleDelete = async () => {
    if (!supplierToDelete?.id) return;

    try {
      await http.delete(`/suppliers/${supplierToDelete.id}`);
      toast.success("Supplier deleted successfully");
      setSupplierToDelete(null);
      fetchSuppliers();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete supplier");
    }
  };

  // Pagination data
  const paginatedSuppliers = suppliers.slice((page - 1) * rowsPerPage, page * rowsPerPage);

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
                  {["Supplier Name", "Image", "Date Added", "Actions"].map((header) => (
                    <TableCell
                      key={header}
                      sx={{
                        fontWeight: "bold",
                        fontSize: "1rem",
                        backgroundColor: "#17a2b8",
                        color: "white",
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedSuppliers.length > 0 ? (
                  paginatedSuppliers.map(({ id, supplier_name, supplier_image, date_added }) => (
                    <TableRow key={id}>
                      <TableCell>{supplier_name}</TableCell>
                      <TableCell>
                        {supplier_image ? (
                          <img
                            src={supplier_image}
                            alt="Supplier"
                            style={{
                              width: "60px",
                              height: "60px",
                              borderRadius: "8px",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <span className="text-muted">No Image</span>
                        )}
                      </TableCell>
                      <TableCell>{new Date(date_added).toLocaleString()}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          onClick={() =>
                            openEditModal({ id, supplier_name, supplier_image, date_added })
                          }
                          sx={{ mr: 1 }}
                        >
                          <EditIcon sx={{ fontSize: "1rem" }} />
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() =>
                            setSupplierToDelete({ id, supplier_name, supplier_image, date_added })
                          }
                        >
                          <DeleteIcon sx={{ fontSize: "1rem" }} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No suppliers found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Pagination
            count={Math.ceil(suppliers.length / rowsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            sx={{ mt: 2, display: "flex", justifyContent: "center" }}
          />
        </>
      )}

      {/* Edit Modal */}
      {selectedSupplier && (
        <Modal onClose={closeModal} title="Edit Supplier">
          <div className="mb-3">
            <label className="form-label">Supplier Name</label>
            <input
              type="text"
              className="form-control"
              value={editForm.supplier_name}
              onChange={(e) => setEditForm({ ...editForm, supplier_name: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Supplier Image (optional)</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter image URL or leave blank"
              value={editForm.supplier_image}
              onChange={(e) => setEditForm({ ...editForm, supplier_image: e.target.value })}
            />
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
      {supplierToDelete && (
        <Modal onClose={() => setSupplierToDelete(null)} title="Confirm Delete">
          <p>
            Are you sure you want to delete{" "}
            <strong>{supplierToDelete.supplier_name}</strong>?
          </p>
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-secondary me-2"
              onClick={() => setSupplierToDelete(null)}
            >
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

export default EditSupplier;
