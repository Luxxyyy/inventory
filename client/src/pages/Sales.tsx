import React, { useEffect, useState } from "react";
import { getSales, deleteSale } from "../api/sales_api";
import AddSales from "../components/sales/AddSales";
import EditSales from "../components/sales/EditSales";
import Modal from "../components/Modal";
import { toast } from "react-toastify";

const Sales: React.FC = () => {
    const [sales, setSales] = useState<any[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editSale, setEditSale] = useState<any>(null);

    const fetchSales = async () => {
        const data = await getSales();
        setSales(data);
    };

    useEffect(() => {
        fetchSales();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this sale?")) return;
        try {
            await deleteSale(id);
            toast.success("Sale deleted!");
            fetchSales();
        } catch {
            toast.error("Failed to delete sale");
        }
    };

    return (
        <div className="container my-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Sales Records</h2>
                <button className="btn btn-success" onClick={() => setShowAddModal(true)}>
                    + Add Sale
                </button>
            </div>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Quantity Sold</th>
                        <th>Selling Price</th>
                        <th>Profit</th>
                        <th>Date Sold</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.map((sale) => (
                        <tr key={sale.id}>
                            <td>{sale.item_name}</td>
                            <td>{sale.quantity_sold}</td>
                            <td>{sale.selling_price}</td>
                            <td>{sale.profit}</td>
                            <td>{new Date(sale.date_sold).toLocaleString()}</td>
                            <td>
                                <button className="btn btn-primary btn-sm me-2" onClick={() => setEditSale(sale)}>
                                    Edit
                                </button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(sale.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showAddModal && (
                <Modal onClose={() => setShowAddModal(false)} title="Add Sale">
                    <AddSales
                        onClose={() => setShowAddModal(false)}
                        onAdded={() => {
                            setShowAddModal(false);
                            fetchSales();
                        }}
                    />
                </Modal>
            )}

            {editSale && (
                <Modal onClose={() => setEditSale(null)} title="Edit Sale">
                    <EditSales
                        sale={editSale}
                        onClose={() => setEditSale(null)}
                        onUpdated={() => {
                            setEditSale(null);
                            fetchSales();
                        }}
                    />
                </Modal>
            )}
        </div>
    );
};

export default Sales;
