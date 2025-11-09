import React from "react";
import { Routes, Route } from "react-router-dom";
import ListGroup from "../components/ListGroup";
import Login from "../pages/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import User from "../pages/User";
import Layout from "../components/Layout";
import Logs from "../pages/Logs";
import Inventory from "../pages/Inventory";
import Item from "../pages/Item";
import Category from "../pages/Category";
import Supplier from "../pages/Supplier";
import Sales from "../pages/Sales";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route path="list" element={<ListGroup />} />
        <Route path="add-user" element={<ProtectedRoute requiredRole="admin"> <User /> </ProtectedRoute>} />
        <Route path="logs" element={<ProtectedRoute requiredRole="admin"> <Logs /> </ProtectedRoute>} />
        <Route path="inventory" element={<ProtectedRoute requiredRole="admin"> <Inventory /> </ProtectedRoute>} />
        <Route path="items" element={<ProtectedRoute requiredRole="admin"> <Item /> </ProtectedRoute>} />
        <Route path="categories" element={<ProtectedRoute requiredRole="admin"> <Category /> </ProtectedRoute>} />
        <Route path="suppliers" element={<ProtectedRoute requiredRole="admin"> <Supplier /> </ProtectedRoute>} />
        <Route path="sales" element={<ProtectedRoute requiredRole="admin"> <Sales /> </ProtectedRoute>} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
