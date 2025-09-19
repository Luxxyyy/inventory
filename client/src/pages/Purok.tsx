import React, { useState } from "react";
import AddPurok from "../components/purok/AddPurok";
import EditPurok from "../components/purok/EditPurok";
import Modal from "../components/Modal";

const Purok = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="container-fluid my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Purok Management</h2>
        <button
          className="btn btn-success text-white"
          onClick={() => setShowAddModal(true)}
        >
          + Add Purok
        </button>
      </div>

      <div className="w-100">
        <EditPurok />
      </div>

      {showAddModal && (
        <Modal
          onClose={() => setShowAddModal(false)}
          title="Create New Purok"
          width="700px"
        >
          <div className="d-flex justify-content-center">
            <div style={{ width: "100%", maxWidth: "500px" }}>
              <AddPurok />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Purok;
