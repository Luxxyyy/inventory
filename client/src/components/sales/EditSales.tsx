import React, { useEffect, useState } from "react";
import { getInventory } from "../../api/inventory_api";
import { updateSale } from "../../api/sales_api";
import { toast } from "react-toastify";

interface EditSalesProps {
    sale: any;
    onClose: () => void;
    onUpdated: () => void;
}

const EditSales: React.FC<EditSalesProps> = ({ sale, onClose, onUpdated }) => {
    const [quantitySold, setQuantitySold] = useState<number>(sale.quantity_sold);
    const [sellingPrice, setSellingPrice] = useState<number>(sale.selling_price);
    const [inventory, setInventory] = useState<any>(null);

    useEffect(() => {
        const fetchInventory = async () => {
            const data = await getInventory();
            const item = data.find((i) => i.id === sale.item_id);
            setInventory(item);
        };
        fetchInventory();
    }, [sale]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inventory) return;

        const stockChange = quantitySold - sale.quantity_sold;
        if (stockChange > inventory.quantity) {
            toast.error("Not enough stock to increase sold quantity!");
            return;
        }

        try {
            await updateSale(sale.id, sale.item_id, quantitySold, sellingPrice);
            // Update inventory
            await fetch(`/inventory/${sale.item_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...inventory, quantity: inventory.quantity - stockChange }),
            });

            toast.success("Sale updated successfully!");
            onUpdated();
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("Failed to update sale");
        }
    };

    return (
        <div className="p-3">
            <h4 className="mb-3">Edit Sale</h4>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Quantity Sold</label>
                    <input
                        type="number"
                        className="form-control"
                        value={quantitySold}
                        onChange={(e) => setQuantitySold(Number(e.target.value))}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Selling Price per Item</label>
                    <input
                        type="number"
                        className="form-control"
                        value={sellingPrice}
                        onChange={(e) => setSellingPrice(Number(e.target.value))}
                    />
                </div>

                <div className="d-flex justify-content-end mt-3">
                    <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-success">
                        Update Sale
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditSales;
