import React, { useState } from "react";
import AddCategory from "../components/category/AddCategory";
import EditCategory from "../components/category/EditCategory";
import Modal from "../components/Modal";

function Category() {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="container-fluid my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Category Management</h2>
        <button
          className="btn btn-success text-white"
          onClick={() => setShowAddModal(true)}
        >
          + Add Category
        </button>
      </div>

      <div className="w-100">
        <EditCategory />
      </div>

      {showAddModal && (
        <Modal
          onClose={() => setShowAddModal(false)}
          title="Create New Category"
          width="700px"
        >
          <div className="d-flex justify-content-center">
            <div style={{ width: "100%", maxWidth: "500px" }}>
              <AddCategory />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Category;
