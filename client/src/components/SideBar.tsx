import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMap,
  FiList,
  FiUserPlus
} from "react-icons/fi";
import { FaFaucet, FaMapMarkerAlt, FaMapPin  } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import "../../src/design/sidebar.css";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: JSX.Element;
  roles?: string[];
  section?: string;
}

const navItems: NavItem[] = [
  { label: "Map", path: "/", icon: <FiMap /> },
  { label: "Lists", path: "/list", icon: <FiList /> },
  { label: "Source", path: "/source", icon: <FaFaucet />, section: "Manage" },
  { label: "Balangay", path: "/balangay", icon: <FaMapMarkerAlt />, section: "Manage" },
  { label: "Purok", path: "/purok", icon: <FaMapPin />, section: "Manage" },
  { label: "Add User", path: "/add-user", icon: <FiUserPlus />, roles: ["admin", "manager"], section: "Admin" },
];

const SIDEBAR_WIDTH_COLLAPSED = 80;
const SIDEBAR_WIDTH_EXPANDED = 250;

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  // Filter nav items by user role
  const visibleNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role);
  });

  // Group items by section
  const groupedItems = visibleNavItems.reduce(
    (acc, item) => {
      const group = item.section || "default";
      if (!acc[group]) acc[group] = [];
      acc[group].push(item);
      return acc;
    },
    {} as Record<string, NavItem[]>
  );

  return (
    <aside
      className={`text-white d-flex flex-column bg-dark ${
        collapsed ? "sidebar-collapsed" : "sidebar-expanded"
      }`}
      style={{
        width: collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED,
        transition: "width 0.3s ease",
        willChange: "width",
        height: "100vh",
        overflowY: "auto",
      }}
      aria-label="Sidebar navigation"
    >
      <header
        className="d-flex justify-content-between align-items-center border-bottom border-secondary px-3 py-2"
        aria-label="User Info and Collapse toggle"
      >
        {!collapsed && user ? (
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.6 }}>
            <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>{user.username}</span>
            <span style={{ fontSize: "0.75rem", color: "#ccc" }}>{user.role}</span>
          </div>
        ) : (
          <div style={{ height: "2rem" }} />
        )}

        <button
          className="btn btn-sm btn-outline-light"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          style={{ minWidth: 30 }}
        >
          {collapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
        </button>
      </header>

      <nav className="flex-grow-1 px-2 py-3" role="navigation" aria-label="Primary navigation">
        <ul className="nav flex-column">
          {groupedItems["default"]?.map((item) => (
            <li className="nav-item" key={item.path}>
              <Link
                to={item.path}
                className={`nav-link modern-link d-flex align-items-center gap-2 ${
                  isActive(item.path) ? "active" : ""
                }`}
                title={item.label}
                aria-current={isActive(item.path) ? "page" : undefined}
              >
                {item.icon}
                {!collapsed && item.label}
              </Link>
            </li>
          ))}

          {Object.entries(groupedItems)
            .filter(([group]) => group !== "default")
            .map(([section, items]) => (
              <React.Fragment key={section}>
                {!collapsed && (
                  <h6 className="mt-3 mb-2 px-2 text-secondary text-uppercase">{section}</h6>
                )}
                {items.map((item) => (
                  <li className="nav-item" key={item.path}>
                    <Link
                      to={item.path}
                      className={`nav-link modern-link d-flex align-items-center gap-2 ${
                        isActive(item.path) ? "active" : ""
                      }`}
                      title={item.label}
                      aria-current={isActive(item.path) ? "page" : undefined}
                    >
                      {item.icon}
                      {!collapsed && item.label}
                    </Link>
                  </li>
                ))}
              </React.Fragment>
            ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
