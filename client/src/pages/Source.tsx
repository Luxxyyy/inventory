import React, { useState } from "react";
import AddSource from "../components/_source/AddSource";
import EditSource from "../components/_source/EditSource";
import Modal from "../components/Modal";

function Source() {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="container-fluid my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Source Management</h2>
        <button
          className="btn btn-success text-white"
          onClick={() => setShowAddModal(true)}
        >
          + Add Source
        </button>
      </div>

      <div className="w-100">
        <EditSource />
      </div>

      {showAddModal && (
        <Modal
          onClose={() => setShowAddModal(false)}
          title="Create New Source"
          width="700px"
        >
          <div className="d-flex justify-content-center">
            <div style={{ width: "100%", maxWidth: "500px" }}>
              <AddSource />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Source;
