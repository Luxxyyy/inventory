import React, { useEffect, useState } from "react";
import { getInventory } from "../../api/inventory_api";
import http from "../../api/http"; // we'll call backend directly for addSale
import { toast } from "react-toastify";

interface AddSalesProps {
    onClose: () => void;
    onAdded: () => void;
}

interface InventoryItem {
    id: number;
    item_name: string;
    quantity: number;
    price: number;
}

const AddSales: React.FC<AddSalesProps> = ({ onClose, onAdded }) => {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [inventoryId, setInventoryId] = useState<number | null>(null);
    const [quantitySold, setQuantitySold] = useState<number>(0);
    const [sellingPrice, setSellingPrice] = useState<number>(0);

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const data = await getInventory();
                setInventory(data);
            } catch (error) {
                console.error("Failed to fetch inventory:", error);
                toast.error("Failed to load inventory.");
            }
        };
        fetchInventory();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!inventoryId || quantitySold <= 0 || sellingPrice <= 0) {
            toast.error("Please fill all fields correctly.");
            return;
        }

        const selectedItem = inventory.find((i) => i.id === inventoryId);
        if (!selectedItem) {
            toast.error("Invalid inventory item selected.");
            return;
        }

        if (quantitySold > selectedItem.quantity) {
            toast.error("Not enough stock available!");
            return;
        }

        try {
            // ✅ Corrected payload to match backend
            const payload = {
                inventory_id: inventoryId,
                quantity_sold: quantitySold,
                selling_price: sellingPrice,
            };

            const { data } = await http.post("/sales", payload);

            toast.success("Sale recorded successfully!");
            onAdded();
            onClose();
        } catch (error: any) {
            console.error("Add sale error:", error);
            if (error.response) {
                toast.error(`Error: ${error.response.data.error || "Failed to record sale"}`);
            } else {
                toast.error("Failed to record sale");
            }
        }
    };

    return (
        <div className="p-3">
            <h4 className="mb-3">Add Sale</h4>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label fw-semibold">Select Item</label>
                    <select
                        className="form-select"
                        value={inventoryId ?? ""}
                        onChange={(e) => setInventoryId(Number(e.target.value))}
                    >
                        <option value="">-- Choose Item --</option>
                        {inventory.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.item_name} (Stock: {item.quantity})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label fw-semibold">Quantity Sold</label>
                    <input
                        type="number"
                        className="form-control"
                        value={quantitySold}
                        min={1}
                        max={
                            inventory.find((i) => i.id === inventoryId)?.quantity || undefined
                        }
                        onChange={(e) => setQuantitySold(Number(e.target.value))}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-semibold">Selling Price per Item</label>
                    <input
                        type="number"
                        className="form-control"
                        value={sellingPrice}
                        min={1}
                        onChange={(e) => setSellingPrice(Number(e.target.value))}
                    />
                </div>

                <div className="d-flex justify-content-end mt-3">
                    <button
                        type="button"
                        className="btn btn-secondary me-2"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-success">
                        Save Sale
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddSales;
