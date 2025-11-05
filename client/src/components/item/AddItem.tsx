import React, { useEffect, useState } from "react";
import { getCategories } from "../../api/category_api";
import { addItem } from "../../api/item_api";
import type { Category } from "../../types/itemTypes";

const AddItem: React.FC = () => {
  const [itemName, setItemName] = useState("");
  const [barcode, setBarcode] = useState("");
  const [itemImage, setItemImage] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    getCategories()
      .then((data: any) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  const handleAdd = async () => {
    setError("");
    setSuccess("");

    if (!itemName || !barcode || !category) {
      setError("All required fields must be filled");
      return;
    }

    setLoading(true);
    try {
      await addItem(itemName, barcode, parseInt(category, 10), itemImage || null);
      setSuccess("Item added successfully!");
      setItemName("");
      setBarcode("");
      setItemImage("");
      setCategory("");
    } catch (err) {
      console.error(err);
      setError("Failed to add item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid mx-4 my-3" style={{ maxWidth: "600px" }}>
      <h2>Add Item</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="mb-3">
        <label className="form-label">Item Name</label>
        <input
          type="text"
          className="form-control"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Barcode (optional)</label>
        <input
            type="text"
            className="form-control"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="Enter barcode (optional)"
        />
        </div>

      <div className="mb-3">
        <label className="form-label">Category</label>
        <select
          className="form-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={String(cat.id)}>
              {cat.category_name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Item Image (optional)</label>
        <input
          type="text"
          className="form-control"
          value={itemImage}
          placeholder="Enter image URL (optional)"
          onChange={(e) => setItemImage(e.target.value)}
        />
      </div>

      <button
        className="btn btn-success text-white"
        onClick={handleAdd}
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Item"}
      </button>
    </div>
  );
};

export default AddItem;
