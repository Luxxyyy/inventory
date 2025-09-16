import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMap,
  FiList,
  FiUserPlus,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { FaFaucet, FaMapMarkerAlt, FaMapPin } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import "../../src/design/sidebar.css";

interface NavItem {
  label: string;
  path: string;
  icon: JSX.Element;
  roles?: string[];
  section?: string;
}

const navItems: NavItem[] = [
  { label: "Map", path: "/", icon: <FiMap />, roles: ["admin", "user"] },
  { label: "Lists", path: "/list", icon: <FiList />, roles: ["admin", "user"] },
  { label: "Source", path: "/source", icon: <FaFaucet />, roles: ["admin", "manager"], section: "Manage" },
  { label: "Balangay", path: "/balangay", icon: <FaMapMarkerAlt />, roles: ["admin", "manager"], section: "Manage" },
  { label: "Purok", path: "/purok", icon: <FaMapPin />, roles: ["admin", "manager"], section: "Manage" },
  { label: "Add User", path: "/add-user", icon: <FiUserPlus />, roles: ["admin", "manager"], section: "Admin" },
  { label: "Logs", path: "/logs", icon: <FiUserPlus />, roles: ["admin", "manager"], section: "Admin" },
];

const MOBILE_BREAKPOINT = 768;
const SIDEBAR_WIDTH_COLLAPSED = 80;
const SIDEBAR_WIDTH_EXPANDED = 250;

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const { user } = useAuth();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE_BREAKPOINT);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

  useEffect(() => {
    function handleResize() {
      const mobile = window.innerWidth <= MOBILE_BREAKPOINT;
      setIsMobile(mobile);

      if (mobile) {
        setCollapsed(true);
        setMobileDropdownOpen(false);
      } else {
        setCollapsed(false);
        setMobileDropdownOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [setCollapsed]);

  const isActive = (path: string) => location.pathname === path;

  // Filter nav items by user roles
  const visibleNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return user?.role && item.roles.includes(user.role);
  });

  // Group nav items by section
  const groupedItems = visibleNavItems.reduce((acc, item) => {
    const group = item.section || "default";
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {} as Record<string, NavItem[]>);

  if (isMobile) {
    return (
      <div className="mobile-sidebar-dropdown" style={{ position: "relative", zIndex: 2100 }}>
        <button
          className="btn btn-primary"
          aria-label={mobileDropdownOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileDropdownOpen}
          aria-controls="mobile-sidebar-menu"
          onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
          style={{ margin: 10 }}
        >
          {mobileDropdownOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {mobileDropdownOpen && (
          <nav
            id="mobile-sidebar-menu"
            className="mobile-dropdown-menu bg-dark text-white shadow rounded d-flex flex-column"
            style={{
              position: "absolute",
              top: 50,
              left: 10,
              width: SIDEBAR_WIDTH_EXPANDED,
              maxHeight: "80vh",
              overflowY: "auto",
              zIndex: 2000,
              borderRadius: 6,
            }}
            aria-label="Mobile sidebar navigation dropdown"
          >
            <ul
              className="nav flex-column"
              style={{ padding: 0, margin: 0, listStyle: "none" }}
            >
              {visibleNavItems.map((item) => (
                <li className="nav-item text-center" key={item.path}>
                  <Link
                    to={item.path}
                    className={`nav-link modern-link d-flex justify-content-center align-items-center p-3 ${
                      isActive(item.path) ? "active" : ""
                    }`}
                    title={item.label}
                    aria-current={isActive(item.path) ? "page" : undefined}
                    onClick={() => setMobileDropdownOpen(false)}
                    style={{ fontSize: "1.4rem" }}
                  >
                    {item.icon}
                    <span className="ms-2">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    );
  }

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
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
      aria-label="Sidebar navigation"
    >
      <header
        className="d-flex justify-content-between align-items-center border-bottom border-secondary px-3 py-2"
        aria-label="User Info and Collapse toggle"
      >
        {!collapsed && user ? (
          <div className="d-flex flex-column" style={{ lineHeight: 1.6 }}>
            <span className="fw-bold fs-6">{user.username}</span>
            <span className="text-secondary small">{user.role}</span>
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

      <nav
        className="flex-grow-1 px-2 py-3"
        role="navigation"
        aria-label="Primary navigation"
      >
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
            .filter(([section]) => section !== "default")
            .map(([section, items]) => (
              <React.Fragment key={section}>
                {!collapsed && (
                  <h6 className="mt-3 mb-2 px-2 text-secondary text-uppercase">
                    {section}
                  </h6>
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
