import React, { useState } from "react";
import AddSheet from "../components/sheet/AddSheet";
import EditSheet from "../components/sheet/EditSheet";
import Modal from "../components/Modal";

function Sheet() {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="container-fluid my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Sheet Management</h2>
        <button
          className="btn btn-success text-white"
          onClick={() => setShowAddModal(true)}
        >
          + Add Sheet
        </button>
      </div>

      <div className="w-100">
        <EditSheet />
      </div>

      {showAddModal && (
        <Modal
          onClose={() => setShowAddModal(false)}
          title="Create New Sheet"
          width="700px"
        >
          <div className="d-flex justify-content-center">
            <div style={{ width: "100%", maxWidth: "500px" }}>
              <AddSheet />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Sheet;
