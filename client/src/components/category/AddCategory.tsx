import React, { useState } from "react";
import { addCategory } from "../../api/category_api";

const AddCategory: React.FC = () => {
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAdd = async () => {
    setError("");
    setSuccess("");

    if (!categoryName) {
      setError("Category name is required");
      return;
    }

    setLoading(true);
    try {
      await addCategory(categoryName);
      setSuccess("Category added successfully!");
      setCategoryName("");
    } catch (err) {
      console.error(err);
      setError("Failed to add category.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid mx-4 my-3" style={{ maxWidth: "600px" }}>
      <h2>Add Category</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="mb-3">
        <label className="form-label">Category Name</label>
        <input
          type="text"
          className="form-control"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
      </div>

      <button
        className="btn btn-success text-white"
        onClick={handleAdd}
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Category"}
      </button>
    </div>
  );
};

export default AddCategory;
