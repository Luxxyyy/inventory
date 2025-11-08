import React, { useEffect, useState } from "react";
import http from "../../api/http";
import Modal from "../Modal";
import { toast } from "react-toastify";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
} from "@mui/material";

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

// 👇 Accept searchQuery as a prop
const EditInventory: React.FC<{ searchQuery: string }> = ({ searchQuery }) => {
  const [inventory, setInventory] = useState<InventoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const { data } = await http.get("/inventory");
      const arr = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : [];
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

  // 🔍 Filter inventory by search query (case-insensitive)
  const filteredInventory = inventory.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.item_name.toLowerCase().includes(query) ||
      item.supplier_name.toLowerCase().includes(query) ||
      item.category_name.toLowerCase().includes(query)
    );
  });

  const paginatedItems = filteredInventory.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

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
                  {[
                    "Item Name",
                    "Supplier",
                    "Quantity",
                    "Price",
                    "Amount",
                    "Date Added",
                  ].map((header) => (
                    <TableCell
                      key={header}
                      sx={{
                        fontWeight: "bold",
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
                {paginatedItems.length > 0 ? (
                  paginatedItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.item_name}</TableCell>
                      <TableCell>{item.supplier_name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.price}</TableCell>
                      <TableCell>{item.amount}</TableCell>
                      <TableCell>
                        {new Date(item.date_added).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No items found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Pagination
            count={Math.ceil(filteredInventory.length / rowsPerPage)}
            page={page}
            onChange={handlePageChange}
            sx={{ mt: 2, display: "flex", justifyContent: "center" }}
          />
        </>
      )}
    </div>
  );
};

export default EditInventory;
