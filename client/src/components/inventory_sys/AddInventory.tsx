import React, { useState } from 'react';
import { addInventory } from '../../api/inventory_api';

function AddInventory() {
  const [itemName, setItemName] = useState('');
  const [supplier, setSupplier] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAdd = async () => {
    setError('');
    setSuccess('');

    if (!itemName || !supplier || !quantity || !price) {
      setError('All fields are required!');
      return;
    }

    const qty = parseInt(quantity, 10);
    const prc = parseFloat(price);
    if (isNaN(qty) || isNaN(prc)) {
      setError('Quantity and Price must be numbers!');
      return;
    }

    setLoading(true);
    try {
      await addInventory(itemName, supplier, qty, prc);
      setSuccess('Inventory item added!');
      setItemName('');
      setSupplier('');
      setQuantity('');
      setPrice('');
    } catch {
      setError('Failed to add inventory item.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid mx-4 my-3" style={{ maxWidth: '600px' }}>
      <h2>Add Inventory Item</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="mb-3">
        <label className="form-label">Item Name</label>
        <input
          type="text"
          className="form-control"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Supplier</label>
        <input
          type="text"
          className="form-control"
          value={supplier}
          onChange={(e) => setSupplier(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Quantity</label>
        <input
          type="number"
          className="form-control"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Price</label>
        <input
          type="number"
          step="0.01"
          className="form-control"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      <button className="btn btn-success text-white" onClick={handleAdd} disabled={loading}>
        {loading ? 'Adding...' : 'Add'}
      </button>
    </div>
  );
}

export default AddInventory;
