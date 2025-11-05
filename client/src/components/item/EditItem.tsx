import React, { useEffect, useState } from "react";
import http from "../../api/http";
import { getCategories } from "../../api/category_api";
import Modal from "../Modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { Category } from "../../types/itemTypes";

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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

type ItemType = {
  id: number;
  item_name: string;
  barcode?: string | null;
  item_image?: string | null;
  category_id: number;
  category_name?: string | null;
  date_added: string;
};

const EditItem: React.FC = () => {
  const [items, setItems] = useState<ItemType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);
  const [itemToDelete, setItemToDelete] = useState<ItemType | null>(null);
  const [editForm, setEditForm] = useState({
    item_name: "",
    barcode: "",
    item_image: "",
    category_id: "",
  });
  const [modalError, setModalError] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const paginatedItems = items.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data } = await http.get("/items");
      const arr: any[] = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
      const sorted = arr.sort((a: any, b: any) => (b?.id ?? 0) - (a?.id ?? 0));
      setItems(sorted as ItemType[]);
    } catch {
      setError("Failed to fetch items");
      toast.error("Failed to fetch items");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data: any = await getCategories();
      const arr: any[] = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
      const valid = arr.filter((c: any) => typeof c?.id === "number" && typeof c?.category_name === "string");
      setCategories(valid as Category[]);
    } catch {
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const openEditModal = (item: ItemType) => {
    setSelectedItem(item);
    setEditForm({
      item_name: item.item_name,
      barcode: item.barcode || "",
      item_image: item.item_image || "",
      category_id: String(item.category_id),
    });
    setModalError("");
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalError("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    const { item_name, barcode, item_image, category_id } = editForm;

    if (!item_name || !category_id) {
      setModalError("Item name and category are required");
      return;
    }

    try {
      await http.put(`/items/${selectedItem?.id}`, {
        item_name,
        barcode: barcode || null,
        item_image: item_image || null,
        category_id: parseInt(category_id, 10),
      });
      toast.success("Item updated successfully");
      closeModal();
      fetchItems();
    } catch {
      setModalError("Failed to update item");
      toast.error("Failed to update item");
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete?.id) return;

    try {
      await http.delete(`/items/${itemToDelete.id}`);
      toast.success("Item deleted successfully");
      setItemToDelete(null);
      fetchItems();
    } catch {
      toast.error("Failed to delete item");
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
                  {["Item Name", "Barcode", "Category", "Image", "Actions"].map((header) => (
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
                {paginatedItems.map(({ id, item_name, barcode, category_name, item_image }) => (
                  <TableRow key={id}>
                    <TableCell>{item_name}</TableCell>
                    <TableCell>{barcode || "-"}</TableCell>
                    <TableCell>{category_name || "-"}</TableCell>
                    <TableCell>
                      {item_image ? (
                        <img src={item_image} alt="item" width="60" height="60" style={{ objectFit: "cover" }} />
                      ) : (
                        <span className="text-muted">No image</span>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        onClick={() => openEditModal({ id, item_name, barcode, category_name, category_id: 0, item_image, date_added: "" })}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon sx={{ fontSize: "1rem" }} />
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => setItemToDelete({ id, item_name, barcode, category_name, category_id: 0, item_image, date_added: "" })}
                      >
                        <DeleteIcon sx={{ fontSize: "1rem" }} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Pagination
            count={Math.ceil(items.length / rowsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            sx={{ mt: 2, display: "flex", justifyContent: "center" }}
          />
        </>
      )}

      {/* Edit Modal */}
      {selectedItem && (
        <Modal onClose={closeModal} title="Edit Item">
          <div className="mb-3">
            <label className="form-label">Item Name</label>
            <input
              name="item_name"
              type="text"
              className="form-control"
              value={editForm.item_name}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Barcode (optional)</label>
            <input
              name="barcode"
              type="text"
              className="form-control"
              value={editForm.barcode}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Category</label>
            <select
              name="category_id"
              className="form-select"
              value={editForm.category_id}
              onChange={handleInputChange}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={String(cat.id)}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Item Image (optional)</label>
            <input
              name="item_image"
              type="text"
              className="form-control"
              value={editForm.item_image}
              onChange={handleInputChange}
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
      {itemToDelete && (
        <Modal onClose={() => setItemToDelete(null)} title="Confirm Delete">
          <p>
            Are you sure you want to delete <strong>{itemToDelete.item_name}</strong>?
          </p>
          <div className="d-flex justify-content-end">
            <button className="btn btn-secondary me-2" onClick={() => setItemToDelete(null)}>
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

export default EditItem;
