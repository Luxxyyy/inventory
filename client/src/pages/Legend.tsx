import React, { useState } from "react";
import CreateLegendItem from "../components/legenditem/CreateLegendItem";
import EditLegendItem from "../components/legenditem/EditLegendItem";
import Modal from "../components/Modal";
import "../design/legend.css";

const Legend = () => {
  const [updateKey, setUpdateKey] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleUpdate = () => {
    setUpdateKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="container-fluid my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Legend Management</h2>
        <button
          className="btn btn-success text-white"
          onClick={() => setShowAddModal(true)}
        >
          + Add Legend Item
        </button>
      </div>

      <div className="w-100">
        <EditLegendItem key={updateKey} />
      </div>

      {showAddModal && (
        <Modal
          onClose={() => setShowAddModal(false)}
          title="Create New Legend Item"
          width="700px"
        >
          <div className="d-flex justify-content-center">
            <div style={{ width: "100%", maxWidth: "500px" }}>
              <CreateLegendItem onSave={handleUpdate} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Legend;
