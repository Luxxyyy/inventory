import React, { useState } from "react";
import AddBalangay from "../components/balangay/AddBalangay";
import EditBalangay from "../components/balangay/EditBalangay";
import Modal from "../components/Modal";

function Balangay() {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="container-fluid my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Balangay Management</h2>
        <button
          className="btn btn-success text-white"
          onClick={() => setShowAddModal(true)}
        >
          + Add Balangay
        </button>
      </div>

      <div className="w-100">
        <EditBalangay />
      </div>

      {showAddModal && (
        <Modal
          onClose={() => setShowAddModal(false)}
          title="Create New Balangay"
          width="700px"
        >
          <div className="d-flex justify-content-center">
            <div style={{ width: "100%", maxWidth: "500px" }}>
              <AddBalangay />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Balangay;
