import React, { useEffect, useState } from 'react';
import http from '../../api/http';
import Modal from '../Modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

type InventoryType = {
  id: number;
  item_name: string;
  supplier: string;
  quantity: number;
  price: number;
  amount: number;
  date_added: string;
};

const EditInventory: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryType | null>(null);
  const [itemToDelete, setItemToDelete] = useState<InventoryType | null>(null);
  const [editForm, setEditForm] = useState({ item_name: '', supplier: '', quantity: '', price: '' });
  const [modalError, setModalError] = useState('');

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const paginatedItems = inventory.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const { data } = await http.get('/inventory');
      const arr = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
      const sorted = arr.sort((a: any, b: any) => (b?.id ?? 0) - (a?.id ?? 0));
      setInventory(sorted);
    } catch {
      setError('Failed to fetch inventory');
      toast.error('Failed to fetch inventory');
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
      item_name: item.item_name,
      supplier: item.supplier,
      quantity: String(item.quantity),
      price: String(item.price),
    });
    setModalError('');
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    const { item_name, supplier, quantity, price } = editForm;

    if (!item_name || !supplier || !quantity || !price) {
      setModalError('All fields are required');
      return;
    }

    try {
      await http.put(`/inventory/${selectedItem?.id}`, {
        item_name,
        supplier,
        quantity: parseInt(quantity, 10),
        price: parseFloat(price),
      });
      toast.success('Inventory updated');
      closeModal();
      fetchInventory();
    } catch {
      setModalError('Failed to update inventory');
      toast.error('Failed to update inventory');
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete?.id) return;

    try {
      await http.delete(`/inventory/${itemToDelete.id}`);
      toast.success('Inventory deleted');
      setItemToDelete(null);
      fetchInventory();
    } catch {
      toast.error('Failed to delete inventory');
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
                  {['Item Name', 'Supplier', 'Quantity', 'Price', 'Amount', 'Date Added', 'Actions'].map((header) => (
                    <TableCell
                      key={header}
                      sx={{ fontWeight: 'bold', backgroundColor: '#17a2b8', color: 'white' }}
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
                    <TableCell>{item.supplier}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>{item.amount}</TableCell>
                    <TableCell>{item.date_added}</TableCell>
                    <TableCell>
                      <Button onClick={() => openEditModal(item)}><EditIcon /></Button>
                      <Button onClick={() => setItemToDelete(item)}><DeleteIcon /></Button>
                    </TableCell>
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

      {/* Edit Modal */}
      {selectedItem && (
        <Modal onClose={closeModal} title="Edit Inventory Item">
          {modalError && <div className="alert alert-danger">{modalError}</div>}
          <input
            name="item_name"
            placeholder="Item Name"
            value={editForm.item_name}
            onChange={handleInputChange}
            className="form-control mb-2"
          />
          <input
            name="supplier"
            placeholder="Supplier"
            value={editForm.supplier}
            onChange={handleInputChange}
            className="form-control mb-2"
          />
          <input
            name="quantity"
            placeholder="Quantity"
            type="number"
            value={editForm.quantity}
            onChange={handleInputChange}
            className="form-control mb-2"
          />
          <input
            name="price"
            placeholder="Price"
            type="number"
            step="0.01"
            value={editForm.price}
            onChange={handleInputChange}
            className="form-control mb-2"
          />
          <button className="btn btn-success mt-2" onClick={handleUpdate}>Update</button>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <Modal onClose={() => setItemToDelete(null)} title="Confirm Delete">
          <p>Are you sure you want to delete <b>{itemToDelete.item_name}</b>?</p>
          <button className="btn btn-danger me-2" onClick={handleDelete}>Delete</button>
          <button className="btn btn-secondary" onClick={() => setItemToDelete(null)}>Cancel</button>
        </Modal>
      )}
    </div>
  );
};

export default EditInventory;
