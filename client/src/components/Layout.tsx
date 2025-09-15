import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import PageHeader from "./PageHeader";
import PageFooter from "./PageFooter";
import { useAuth } from "../contexts/AuthContext";

const MOBILE_BREAKPOINT = 768;

const Layout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE_BREAKPOINT);
  const { user } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      setCollapsed(mobile); // collapse on mobile
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // initial call

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div
      className="d-flex flex-column flex-md-row"
      style={{ height: "100vh", overflow: "hidden" }}
    >
      {/* Sidebar (only show on desktop) */}
      {!isMobile && (
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      )}

      {/* Main content */}
      <div className="d-flex flex-column flex-grow-1" style={{ overflow: "hidden" }}>
        <PageHeader collapsed={collapsed} setCollapsed={setCollapsed} isMobile={isMobile} />

        <main
          className="bg-white text-dark main"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "1rem",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <Outlet />
        </main>

        <PageFooter />
      </div>
    </div>
  );
};

export default Layout;

// Import Sidebar at top
import Sidebar from "../components/SideBar";
