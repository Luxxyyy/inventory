import React, { useState } from 'react';
import AddInventory from '../components/inventory_sys/AddInventory';
import EditInventory from '../components/inventory_sys/EditInventory';
import Modal from '../components/Modal';

function Inventory() {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="container-fluid my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Inventory Management</h2>
        <button className="btn btn-success text-white" onClick={() => setShowAddModal(true)}>
          + Add Item
        </button>
      </div>

      <EditInventory />

      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)} title="Add New Inventory Item" width="700px">
          <div className="d-flex justify-content-center">
            <div style={{ width: '100%', maxWidth: '500px' }}>
              <AddInventory />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Inventory;
