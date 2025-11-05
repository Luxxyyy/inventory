import React, { useState } from "react";
import { addSupplier } from "../../api/supplier_api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AddSupplierProps {
  onClose: () => void;
  onAdded: () => void;
}

const AddSupplier: React.FC<AddSupplierProps> = ({ onClose, onAdded }) => {
  const [form, setForm] = useState({
    supplier_name: "",
    supplier_image: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.supplier_name.trim()) {
      setError("Supplier name is required");
      return;
    }

    try {
      await addSupplier(form.supplier_name, form.supplier_image || null);
      toast.success("Supplier added successfully!");
      onAdded();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add supplier");
      setError("Failed to add supplier");
    }
  };

  return (
    <div className="p-3">
      <h4 className="mb-3">Add Supplier</h4>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-semibold">Supplier Name</label>
          <input
            type="text"
            name="supplier_name"
            className="form-control"
            placeholder="Enter supplier name"
            value={form.supplier_name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Supplier Image (optional)</label>
          <input
            type="text"
            name="supplier_image"
            className="form-control"
            placeholder="Enter image URL or leave blank"
            value={form.supplier_image}
            onChange={handleChange}
          />
        </div>

        <div className="d-flex justify-content-end mt-4">
          <button
            type="button"
            className="btn btn-secondary me-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-success text-white">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSupplier;
