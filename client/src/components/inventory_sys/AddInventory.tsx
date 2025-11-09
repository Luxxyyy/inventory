import React, { useEffect, useState } from "react";
import { addInventory } from "../../api/inventory_api";
import { getSuppliers } from "../../api/supplier_api";
import http from "../../api/http";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TextField, Autocomplete } from "@mui/material";

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

interface CategoryType {
  id: number;
  category_name: string;
}

interface ExistingInventory {
  id: number;
  item_id: number;
  supplier_id: number;
  category_id: number;
  price: number;
  quantity: number;
  amount: number;
  updated_at?: string;
}

const AddInventory: React.FC<AddInventoryProps> = ({ onClose, onAdded }) => {
  const [form, setForm] = useState({
    item_id: "",
    supplier_id: "",
    category_id: "",
    quantity: "",
    price: "",
  });

  const [items, setItems] = useState<ItemType[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [existing, setExisting] = useState<ExistingInventory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemData, supplierData, categoryData] = await Promise.all([
          http.get("/items"), // assuming getItems was just a wrapper
          getSuppliers(),
          http.get("/categories"),
        ]);
        setItems(itemData.data || []);
        setSuppliers(supplierData);
        setCategories(categoryData.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load items, suppliers, or categories");
        toast.error("Failed to load items, suppliers, or categories");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleItemSelect = async (item: ItemType | null) => {
    if (!item) {
      setForm((prev) => ({ ...prev, item_id: "" }));
      setExisting(null);
      return;
    }

    setForm((prev) => ({ ...prev, item_id: String(item.id) }));

    try {
      const { data } = await http.get(`/inventory`);
      if (Array.isArray(data)) {
        const existingItem = data.find(
          (inv: ExistingInventory) => inv.item_id === item.id
        );

        if (existingItem) {
          setExisting(existingItem);
          setForm({
            item_id: String(existingItem.item_id),
            supplier_id: String(existingItem.supplier_id),
            category_id: String(existingItem.category_id),
            quantity: "",
            price: String(existingItem.price),
          });
          toast.info("Existing item found — previous data loaded.");
        } else {
          setExisting(null);
          setForm((prev) => ({
            ...prev,
            supplier_id: "",
            category_id: "",
            quantity: "",
            price: "",
          }));
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to check existing inventory");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.item_id || !form.supplier_id || !form.category_id || !form.quantity || !form.price) {
      setError("All fields are required");
      return;
    }

    try {
      const payload = {
        item_id: Number(form.item_id),
        supplier_id: Number(form.supplier_id),
        category_id: Number(form.category_id),
        quantity: Number(form.quantity),
        price: Number(form.price),
      };

      if (existing) {
        // Update existing inventory record
        const updatedData = { ...payload, quantity: existing.quantity + Number(form.quantity) };
        await http.put(`/inventory/${existing.id}`, updatedData);
        toast.success("Inventory updated successfully!");
      } else {
        // Add new inventory record
        await addInventory(
          payload.item_id,
          payload.supplier_id,
          payload.category_id,
          payload.quantity,
          payload.price
        );
        toast.success("New inventory item added successfully!");
      }

      onAdded();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to save inventory item");
      toast.error("Failed to save inventory item");
    }
  };

  if (loading) return <div className="text-center py-3">Loading...</div>;

  return (
    <div className="p-3">
      <h4 className="mb-3">Add Inventory Item</h4>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Searchable Item Field */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Select Item</label>
          <Autocomplete
            options={items}
            getOptionLabel={(option) => option.item_name}
            value={items.find(i => i.id === Number(form.item_id)) || null}
            onChange={(_, value) => handleItemSelect(value)}
            renderInput={(params) => (
              <TextField {...params} placeholder="Type or select an item" />
            )}
          />
        </div>

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

        <div className="mb-3">
          <label className="form-label fw-semibold">Select Category</label>
          <select
            name="category_id"
            className="form-select"
            value={form.category_id}
            onChange={handleChange}
          >
            <option value="">-- Choose Category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.category_name}
              </option>
            ))}
          </select>
        </div>

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
            {existing ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddInventory;
