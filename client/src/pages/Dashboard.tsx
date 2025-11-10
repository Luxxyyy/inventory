import React, { useEffect, useState } from "react";
import http from "../api/http";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaBoxes, FaTags, FaTruck, FaShoppingCart, FaPlus } from "react-icons/fa";

import AddInventory from "../components/inventory_sys/AddInventory";
import AddItem from "../components/item/AddItem";
import AddSales from "../components/sales/AddSales";
import AddCategory from "../components/category/AddCategory";
import AddSupplier from "../components/supplier/AddSupplier";
import SalesChart from "../components/sales/SalesChart"; // <- import your chart component

const Dashboard: React.FC = () => {
    const [inventory, setInventory] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [sales, setSales] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modalType, setModalType] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError("");

        try {
            const [invRes, catRes, supRes, saleRes] = await Promise.all([
                http.get("/inventory"),
                http.get("/categories"),
                http.get("/suppliers"),
                http.get("/sales"),
            ]);

            setInventory(Array.isArray(invRes.data) ? invRes.data : []);
            setCategories(Array.isArray(catRes.data) ? catRes.data : []);
            setSuppliers(Array.isArray(supRes.data) ? supRes.data : []);
            setSales(Array.isArray(saleRes.data) ? saleRes.data : []);
        } catch (err) {
            console.error("Dashboard fetch error:", err);
            setError("Failed to fetch dashboard data");
            toast.error("⚠️ Failed to fetch dashboard data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const closeModal = () => setModalType(null);
    const handleAdded = () => {
        closeModal();
        fetchData();
    };

    if (loading)
        return (
            <div className="text-center my-5">
                <div className="spinner-border text-primary" role="status" />
                <p className="mt-3">Loading dashboard summary...</p>
            </div>
        );

    if (error)
        return (
            <div className="alert alert-danger text-center my-4">
                {error}
            </div>
        );

    const cardsData = [
        { count: inventory.length, icon: <FaBoxes />, label: "Inventory Items", color: "primary", addType: "inventory" },
        { count: categories.length, icon: <FaTags />, label: "Categories", color: "info", addType: "category" },
        { count: suppliers.length, icon: <FaTruck />, label: "Suppliers", color: "warning", addType: "supplier" },
        { count: sales.length, icon: <FaShoppingCart />, label: "Sales", color: "success", addType: "sales" },
    ];

    return (
        <>
            <style>{`
                .card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .add-btn {
                    font-size: 0.9rem;
                    padding: 4px 8px;
                }
            `}</style>

            <div className="container my-4">
                {/* Summary Cards with Add Buttons */}
                <div className="row g-4 justify-content-center">
                    {cardsData.map(({ count, icon, label, color, addType }) => (
                        <div key={label} className="col-6 col-md-3">
                            <div className={`card text-center border-${color} shadow-sm h-100`}>
                                <div className={`card-body text-${color}`}>
                                    <div className="mb-2" style={{ fontSize: "2.5rem" }}>
                                        {icon}
                                    </div>
                                    <h2 className="card-title fw-bold">{count}</h2>
                                    <p className="card-text">{label}</p>
                                    <button
                                        className={`btn btn-outline-${color} add-btn mt-2`}
                                        onClick={() => setModalType(addType)}
                                    >
                                        <FaPlus className="me-1" /> Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sales Chart Section */}
                <div className="row mt-5">
                    <div className="col-12">
                        <SalesChart sales={sales} />
                    </div>
                </div>
            </div>

            {/* Add Modals */}
            {modalType && (
                <div
                    className="modal fade show"
                    style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-body">
                                {modalType === "inventory" && <AddInventory onClose={closeModal} onAdded={handleAdded} />}
                                {modalType === "item" && <AddItem />}
                                {modalType === "sales" && <AddSales onClose={closeModal} onAdded={handleAdded} />}
                                {modalType === "supplier" && <AddSupplier onClose={closeModal} onAdded={handleAdded} />}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
};

export default Dashboard;
