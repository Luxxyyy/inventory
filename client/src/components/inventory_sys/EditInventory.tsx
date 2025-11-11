import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  TextField,
  Button,
} from "@mui/material";
import { getInventory, updateInventory } from "../../api/inventory_api";

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

const EditInventory: React.FC<{ searchQuery: string }> = ({ searchQuery }) => {
  const [inventory, setInventory] = useState<InventoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [editId, setEditId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<{ quantity: number; price: number }>({
    quantity: 0,
    price: 0,
  });

  const rowsPerPage = 10;

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await getInventory();
      const sorted = data.sort((a, b) => (b?.id ?? 0) - (a?.id ?? 0));
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

  const handleEdit = (item: InventoryType) => {
    setEditId(item.id);
    setEditValues({ quantity: item.quantity, price: item.price });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditValues({ quantity: 0, price: 0 });
  };

  // ✅ FIXED: sends updated values (not additive)
  const handleSave = async (item: InventoryType) => {
    try {
      await updateInventory(
        item.id,
        item.item_id,
        item.supplier_id,
        item.category_id,
        editValues.quantity,
        editValues.price
      );

      toast.success(`Inventory for "${item.item_name}" updated successfully`);
      setEditId(null);
      fetchInventory();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update inventory item");
    }
  };

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
                    "Category",
                    "Quantity",
                    "Price",
                    "Amount",
                    "Date Added",
                    "Actions",
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
                      <TableCell>{item.category_name}</TableCell>

                      <TableCell>
                        {editId === item.id ? (
                          <TextField
                            type="number"
                            size="small"
                            value={editValues.quantity}
                            onChange={(e) =>
                              setEditValues({
                                ...editValues,
                                quantity: Number(e.target.value),
                              })
                            }
                            sx={{ width: 90 }}
                          />
                        ) : (
                          item.quantity
                        )}
                      </TableCell>

                      <TableCell>
                        {editId === item.id ? (
                          <TextField
                            type="number"
                            size="small"
                            value={editValues.price}
                            onChange={(e) =>
                              setEditValues({
                                ...editValues,
                                price: Number(e.target.value),
                              })
                            }
                            sx={{ width: 90 }}
                          />
                        ) : (
                          item.price
                        )}
                      </TableCell>

                      <TableCell>{item.quantity * item.price}</TableCell>
                      <TableCell>
                        {new Date(item.date_added).toLocaleString()}
                      </TableCell>

                      <TableCell>
                        {editId === item.id ? (
                          <>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              onClick={() => handleSave(item)}
                              sx={{ mr: 1 }}
                            >
                              Save
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="inherit"
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            onClick={() => handleEdit(item)}
                          >
                            Edit
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
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
