import React, { useEffect, useState } from "react";
import http from "../../api/http";
import Modal from "../Modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

type InventoryType = {
  id: number;
  item_id: number;
  supplier_id: number;
  category_id: number;
  item_name: string;
  supplier_name: string;
  category_name: string;
  quantity: number;
  price: number;
  amount: number;
  date_added: string;
};

const EditInventory: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedItem, setSelectedItem] = useState<InventoryType | null>(null);
  const [itemToDelete, setItemToDelete] = useState<InventoryType | null>(null);

  const [editForm, setEditForm] = useState({
    quantity: "",
    price: "",
  });
  const [modalError, setModalError] = useState("");

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const paginatedItems = inventory.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const { data } = await http.get("/inventory");
      const arr = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
      const sorted = arr.sort((a: any, b: any) => (b?.id ?? 0) - (a?.id ?? 0));
      setInventory(sorted);
    } catch {
      setError("Failed to fetch inventory");
      toast.error("Failed to fetch inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const openEditModal = (item: InventoryType) => {
    setSelectedItem(item);
    setEditForm({
      quantity: String(item.quantity),
      price: String(item.price),
    });
    setModalError("");
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalError("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    const { quantity, price } = editForm;

    if (!quantity || !price) {
      setModalError("All fields are required");
      return;
    }

    try {
      await http.put(`/inventory/${selectedItem?.id}`, {
        item_id: selectedItem?.item_id,
        supplier_id: selectedItem?.supplier_id,
        category_id: selectedItem?.category_id,
        quantity: parseInt(quantity, 10),
        price: parseFloat(price),
      });
      toast.success("Inventory updated");
      closeModal();
      fetchInventory();
    } catch {
      setModalError("Failed to update inventory");
      toast.error("Failed to update inventory");
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete?.id) return;

    try {
      await http.delete(`/inventory/${itemToDelete.id}`);
      toast.success("Inventory deleted");
      setItemToDelete(null);
      fetchInventory();
    } catch {
      toast.error("Failed to delete inventory");
    }
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <div className="container mx-auto my-4">
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
                  {["Item Name", "Supplier", "Quantity", "Price", "Amount", "Date Added"].map((header) => (
                    <TableCell
                      key={header}
                      sx={{ fontWeight: "bold", backgroundColor: "#17a2b8", color: "white" }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.item_name}</TableCell>
                    <TableCell>{item.supplier_name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>{item.amount}</TableCell>
                    <TableCell>{new Date(item.date_added).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Pagination
            count={Math.ceil(inventory.length / rowsPerPage)}
            page={page}
            onChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default EditInventory;
