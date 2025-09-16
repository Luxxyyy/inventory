// Layout.tsx

import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../components/SideBar";
import PageHeader from "./PageHeader";
import PageFooter from "./PageFooter";
import { useAuth } from "../contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MOBILE_BREAKPOINT = 768;

const Layout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE_BREAKPOINT);
  const { user } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      setCollapsed(mobile);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="layout-root" style={{ position: "relative", minHeight: "100vh" }}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastClassName="custom-toast"
        className="custom-toast-container"
      />

      <div className="d-flex flex-column flex-md-row" style={{ height: "100vh", overflow: "hidden" }}>
        {!isMobile && <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />}

        <div className="d-flex flex-column flex-grow-1" style={{ overflow: "hidden" }}>
          <PageHeader collapsed={collapsed} isMobile={isMobile} setCollapsed={setCollapsed} />

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
    </div>
  );
};

export default Layout;
