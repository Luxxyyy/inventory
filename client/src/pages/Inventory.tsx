import React, { useState } from 'react';
import AddInventory from '../components/inventory_sys/AddInventory';
import EditInventory from '../components/inventory_sys/EditInventory';
import Modal from '../components/Modal';

function Inventory() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState(''); // 🔍 search state

  const handleAdded = () => {
    setShowAddModal(false);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="container-fluid my-4">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Inventory Management</h2>

        <div className="d-flex align-items-center" style={{ gap: '10px' }}>
          {/* 🔍 Search bar beside button */}
          <input
            type="text"
            placeholder="Search items..."
            className="form-control"
            style={{ width: '250px' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <button
            className="btn btn-success text-white"
            onClick={() => setShowAddModal(true)}
          >
            + Add Item
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <EditInventory key={refreshKey} searchQuery={searchQuery} />

      {/* Add Modal */}
      {showAddModal && (
        <Modal
          onClose={() => setShowAddModal(false)}
          title="Add New Inventory Item"
          width="700px"
        >
          <div className="d-flex justify-content-center">
            <div style={{ width: '100%', maxWidth: '500px' }}>
              <AddInventory
                onClose={() => setShowAddModal(false)}
                onAdded={handleAdded}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Inventory;
