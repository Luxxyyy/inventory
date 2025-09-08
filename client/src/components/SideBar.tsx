import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Optional: install react-icons for better toggle arrow/icons (npm i react-icons)
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface SidebarProps {}

const Sidebar: React.FC<SidebarProps> = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  // Helper for active link styling
  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      aria-label="Sidebar navigation"
      className={`text-white d-flex flex-column bg-dark ${
        collapsed ? "sidebar-collapsed" : "sidebar-expanded"
      }`}
      id="sideBar_Body"
      style={{
        width: collapsed ? 60 : 300,
        transition: "width 0.3s ease",
        height: "100vh",
      }}
    >
      <header
        className="d-flex justify-content-between align-items-center border-bottom border-secondary px-3 py-2"
        id="sidebar-top"
      >
        {/* Show user info only when expanded */}
        {!collapsed && user ? (
          <div
            style={{ display: "flex", flexDirection: "column", lineHeight: 1.6 }}
            aria-label="User information"
          >
            <span
              style={{ fontWeight: "bold", fontSize: "1.2rem" }}
              tabIndex={0}
              aria-label={`Username: ${user.username}`}
            >
              {user.username}
            </span>
            <span
              style={{ fontSize: "0.75rem", color: "#ccc", marginTop: 2 }}
              tabIndex={0}
              aria-label={`Role: ${user.role}`}
            >
              {user.role}
            </span>
          </div>
        ) : (
          <h5 className="mb-0" aria-hidden={collapsed}>
            {collapsed ? "" : "Name"}
          </h5>
        )}

        {/* Toggle button with aria-label and keyboard focus */}
        <button
          className="btn btn-sm btn-outline-light"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          style={{ minWidth: 30 }}
        >
          {/* Use icons for better visual cues */}
          {collapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
        </button>
      </header>

      <nav
        className="flex-grow-1 px-2 py-3"
        role="navigation"
        aria-label="Primary"
      >
        <ul className="nav flex-column">
          {/* Main Links */}
          <li className="nav-item">
            <Link
              to="/"
              className={`nav-link modern-link ${isActive("/") ? "active" : ""}`}
              aria-current={isActive("/") ? "page" : undefined}
              title="Map"
            >
              {/* Show icon or initial letter when collapsed */}
              {collapsed ? "M" : "Map"}
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/list"
              className={`nav-link modern-link ${isActive("/list") ? "active" : ""}`}
              aria-current={isActive("/list") ? "page" : undefined}
              title="Lists"
            >
              {collapsed ? "L" : "Lists"}
            </Link>
          </li>

          {/* Section Heading */}
          {!collapsed && <h5 className="mt-3 mb-2 px-2 text-secondary">Manage</h5>}

          <li className="nav-item">
            <Link
              to="/source"
              className={`nav-link modern-link ${isActive("/source") ? "active" : ""}`}
              aria-current={isActive("/source") ? "page" : undefined}
              title="Source"
            >
              {collapsed ? "S" : "Source"}
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/balangay"
              className={`nav-link modern-link ${isActive("/balangay") ? "active" : ""}`}
              aria-current={isActive("/balangay") ? "page" : undefined}
              title="Balangay"
            >
              {collapsed ? "B" : "Balangay"}
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/purok"
              className={`nav-link modern-link ${isActive("/purok") ? "active" : ""}`}
              aria-current={isActive("/purok") ? "page" : undefined}
              title="Purok"
            >
              {collapsed ? "P" : "Purok"}
            </Link>
          </li>

          {/* Admin / Manager Only */}
          {(user?.role === "admin" || user?.role === "manager") && (
            <li className="nav-item mt-auto">
              <Link
                to="/add-user"
                className={`nav-link modern-link ${isActive("/add-user") ? "active" : ""}`}
                aria-current={isActive("/add-user") ? "page" : undefined}
                title="Add User"
              >
                {collapsed ? "+" : "Add User"}
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
