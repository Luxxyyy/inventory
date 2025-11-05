import React, { useEffect, useState } from "react";
import { addInventory } from "../../api/inventory_api";
import { getItems } from "../../api/item_api";
import { getSuppliers } from "../../api/supplier_api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AddInventoryProps {
  onClose: () => void;
  onAdded: () => void;
}

interface ItemType {
  id: number;
  item_name: string;
}

interface SupplierType {
  id: number;
  supplier_name: string;
}

const AddInventory: React.FC<AddInventoryProps> = ({ onClose, onAdded }) => {
  const [form, setForm] = useState({
    item_id: "",
    supplier_id: "",
    quantity: "",
    price: "",
  });

  const [items, setItems] = useState<ItemType[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemData, supplierData] = await Promise.all([getItems(), getSuppliers()]);
        setItems(itemData);
        setSuppliers(supplierData);
      } catch (err) {
        console.error(err);
        setError("Failed to load items or suppliers");
        toast.error("Failed to load items or suppliers");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.item_id || !form.supplier_id || !form.quantity || !form.price) {
      setError("All fields are required");
      return;
    }

    try {
      await addInventory(
        Number(form.item_id),
        Number(form.supplier_id),
        1,
        Number(form.quantity),
        Number(form.price)
      );
      toast.success("Inventory added successfully!");
      onAdded();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to add inventory item");
      toast.error("Failed to add inventory item");
    }
  };

  if (loading) return <div className="text-center py-3">Loading...</div>;

  return (
    <div className="p-3">
      <h4 className="mb-3">Add Inventory Item</h4>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Item Dropdown */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Select Item</label>
          <select
            name="item_id"
            className="form-select"
            value={form.item_id}
            onChange={handleChange}
          >
            <option value="">-- Choose Item --</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.item_name}
              </option>
            ))}
          </select>
        </div>

        {/* Supplier Dropdown */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Select Supplier</label>
          <select
            name="supplier_id"
            className="form-select"
            value={form.supplier_id}
            onChange={handleChange}
          >
            <option value="">-- Choose Supplier --</option>
            {suppliers.map((sup) => (
              <option key={sup.id} value={sup.id}>
                {sup.supplier_name}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Quantity</label>
          <input
            type="number"
            name="quantity"
            className="form-control"
            placeholder="Enter quantity"
            value={form.quantity}
            onChange={handleChange}
          />
        </div>

        {/* Price */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Price</label>
          <input
            type="number"
            name="price"
            className="form-control"
            placeholder="Enter price"
            value={form.price}
            onChange={handleChange}
          />
        </div>

        <div className="d-flex justify-content-end mt-4">
          <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
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

export default AddInventory;
