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

type CategoryType = {
  id: number;
  category_name: string;
  date_added: string;
};

const EditCategory: React.FC = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryType | null>(null);
  const [editForm, setEditForm] = useState({ category_name: "" });
  const [modalError, setModalError] = useState("");

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const paginatedCategories = categories.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await http.get("/categories");
      const arr: any[] = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
      const sorted = arr.sort((a: any, b: any) => (b?.id ?? 0) - (a?.id ?? 0));
      setCategories(sorted as CategoryType[]);
    } catch {
      setError("Failed to fetch categories");
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openEditModal = (category: CategoryType) => {
    setSelectedCategory(category);
    setEditForm({ category_name: category.category_name });
    setModalError("");
  };

  const closeModal = () => {
    setSelectedCategory(null);
    setModalError("");
  };

  const handleUpdate = async () => {
    if (!editForm.category_name) {
      setModalError("Category name is required");
      return;
    }

    try {
      await http.put(`/categories/${selectedCategory?.id}`, editForm);
      toast.success("Category updated successfully");
      closeModal();
      fetchCategories();
    } catch {
      setModalError("Failed to update category");
      toast.error("Failed to update category");
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete?.id) return;

    try {
      await http.delete(`/categories/${categoryToDelete.id}`);
      toast.success("Category deleted successfully");
      setCategoryToDelete(null);
      fetchCategories();
    } catch {
      toast.error("Failed to delete category");
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
                  {["Category Name", "Date Added", "Actions"].map((header) => (
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
                {paginatedCategories.map(({ id, category_name, date_added }) => (
                  <TableRow key={id}>
                    <TableCell>{category_name}</TableCell>
                    <TableCell>{new Date(date_added).toLocaleString()}</TableCell>
                    <TableCell align="center">
                      <Button variant="contained" onClick={() => openEditModal({ id, category_name, date_added })} sx={{ mr: 1 }}>
                        <EditIcon sx={{ fontSize: "1rem" }} />
                      </Button>
                      <Button variant="contained" color="error" onClick={() => setCategoryToDelete({ id, category_name, date_added })}>
                        <DeleteIcon sx={{ fontSize: "1rem" }} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Pagination
            count={Math.ceil(categories.length / rowsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            sx={{ mt: 2, display: "flex", justifyContent: "center" }}
          />
        </>
      )}

      {/* Edit Modal */}
      {selectedCategory && (
        <Modal onClose={closeModal} title="Edit Category">
          <div className="mb-3">
            <label className="form-label">Category Name</label>
            <input
              name="category_name"
              type="text"
              className="form-control"
              value={editForm.category_name}
              onChange={(e) => setEditForm({ category_name: e.target.value })}
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
      {categoryToDelete && (
        <Modal onClose={() => setCategoryToDelete(null)} title="Confirm Delete">
          <p>
            Are you sure you want to delete <strong>{categoryToDelete.category_name}</strong>?
          </p>
          <div className="d-flex justify-content-end">
            <button className="btn btn-secondary me-2" onClick={() => setCategoryToDelete(null)}>
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

export default EditCategory;
