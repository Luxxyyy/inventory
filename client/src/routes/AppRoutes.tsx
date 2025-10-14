import React from "react";
import { Routes, Route } from "react-router-dom";
import ListGroup from "../components/ListGroup";
import Dashboard from "../pages/Dashboard";
import Source from "../pages/Source";
import Sheet from "../pages/Sheet";
import Balangay from "../pages/Balangay";
import Purok from "../pages/Purok";
import Login from "../pages/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import User from "../pages/User";
import Layout from "../components/Layout";
import Logs from  "../pages/Logs";
import Notes from "../pages/Notes";
import Legend from "../pages/Legend"
import Message from "../pages/Message"

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="message" element={<Message />} />
        <Route path="list" element={<ListGroup />} />
        <Route path="source" element={ <ProtectedRoute requiredRole="admin"> <Source /> </ProtectedRoute> }/>
        <Route path="sheet" element={ <ProtectedRoute requiredRole="admin"> <Sheet /> </ProtectedRoute> }/>
        <Route path="balangay" element={ <ProtectedRoute requiredRole="admin"> <Balangay /> </ProtectedRoute> }/>
        <Route path="purok" element={ <ProtectedRoute requiredRole="admin"> <Purok /> </ProtectedRoute> }/>
        <Route path="add-user" element={ <ProtectedRoute requiredRole="admin"> <User /> </ProtectedRoute> }/>
        <Route path="legend" element={ <ProtectedRoute requiredRole="admin"> <Legend /> </ProtectedRoute> }/>
        <Route path="logs" element={ <ProtectedRoute requiredRole="admin"> <Logs /> </ProtectedRoute> }/>
        <Route path="notes" element={ <ProtectedRoute requiredRole="admin"> <Notes /> </ProtectedRoute> }/>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
