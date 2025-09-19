import React, { useState } from "react";
import EditUsers from "../components/user/EditUser";
import AddUser from "../components/user/AddUser";
import Modal from "../components/Modal";

const User: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="container-fluid my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">User Management</h2>
        <button
          className="btn btn-success text-white"
          onClick={() => setShowAddModal(true)}
        >
          + Add User
        </button>
      </div>

      {/* Full-width EditUsers */}
      <div className="w-100">
        <EditUsers />
      </div>

      {showAddModal && (
        <Modal
          onClose={() => setShowAddModal(false)}
          title="Create New User"
          width="800px" // make modal larger
        >
          <div className="d-flex justify-content-center">
            <div style={{ width: "100%", maxWidth: "500px" }}>
              <AddUser />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default User;
