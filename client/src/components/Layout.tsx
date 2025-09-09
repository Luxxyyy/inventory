import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "./SideBar";
import PageHeader from "./PageHeader";
import PageFooter from "./PageFooter";
import { useAuth } from "../contexts/AuthContext";

const Layout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <PageHeader />
        <main
          className="bg-white text-dark main"
          style={{ flex: 1, overflowY: "auto", padding: "1rem" }}
        >
          <Outlet />
        </main>
        <PageFooter />
      </div>
    </div>
  );
};

export default Layout;
