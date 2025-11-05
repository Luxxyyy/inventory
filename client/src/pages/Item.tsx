import React, { useState } from "react";
import AddItem from "../components/item/AddItem";
import EditItem from "../components/item/EditItem";
import Modal from "../components/Modal";

function Item() {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="container-fluid my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Item Management</h2>
        <button className="btn btn-success text-white" onClick={() => setShowAddModal(true)}>
          + Add Item
        </button>
      </div>

      <div className="w-100">
        <EditItem />
      </div>

      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)} title="Create New Item" width="700px">
          <div className="d-flex justify-content-center">
            <div style={{ width: "100%", maxWidth: "500px" }}>
              <AddItem />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Item;
