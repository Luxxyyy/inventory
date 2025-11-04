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
  FiMapPin,
  FiSquare,
} from "react-icons/fi";
import { BsChatSquareQuote, BsFillEnvelopeFill } from "react-icons/bs";
import { FaFaucet, FaMapMarkerAlt, FaMapPin } from "react-icons/fa";
import { MdOutlineMessage } from "react-icons/md";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import io from "socket.io-client";
import "../../src/design/sidebar.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Avatar,
  IconButton,
} from "@mui/material";

const MOBILE_BREAKPOINT = 768;
const SIDEBAR_WIDTH_COLLAPSED = 80;
const SIDEBAR_WIDTH_EXPANDED = 250;

interface NavItem {
  label: string;
  path: string;
  icon: JSX.Element;
  roles?: string[];
  section?: string;
}

interface SocketNote {
  User?: { username: string };
  title?: string;
  message?: string;
}

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const capitalize = (s: string) => {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

const toTitleCase = (s: string) => {
  return s
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
};

const navItems: NavItem[] = [
  { label: "Map", path: "/", icon: <FiMap />, roles: ["admin", "engr", "user"], section: "Overview" },
  { label: "Summary", path: "/list", icon: <FiList />, roles: ["admin", "engr", "user"], section: "Overview" },
  { label: "Source", path: "/source", icon: <FaFaucet />, roles: ["admin"], section: "Map Manage" },
  { label: "Sheet", path: "/sheet", icon: <FiSquare   />, roles: ["admin"], section: "Map Manage" },
  { label: "Barangay", path: "/balangay", icon: <FaMapMarkerAlt />, roles: ["admin"], section: "Map Manage" },
  { label: "Purok/Balangay", path: "/purok", icon: <FaMapPin />, roles: ["admin", "manager"], section: "Map Manage" },
  { label: "Add Legend", path: "/legend", icon: <FiMapPin  />, roles: ["admin"], section: "Map Manage" },
  { label: "Notes", path: "/notes", icon: <BsFillEnvelopeFill />, roles: ["admin"], section: "Map Manage" },
  { label: "Add User", path: "/add-user", icon: <FiUserPlus />, roles: ["admin"], section: "Admin" },
  { label: "Logs", path: "/logs", icon: <BsChatSquareQuote />, roles: ["admin"], section: "Admin" },
  { label: "Message", path: "/message", icon: <MdOutlineMessage />, roles: ["admin", "engr", "user"], section: "Team Chat" },
  { label: "Inventory", path: "/inventory", icon: <MdOutlineMessage />, roles: ["admin"], section: "Inventory" },
];

const socket = io("http://localhost:8080");

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const { user } = useAuth();
  const [newNotesCount, setNewNotesCount] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE_BREAKPOINT);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    password: "",
    image: user?.image || "",
    full_image: user?.full_image || "",
    preview: user?.image || "",
    role: user?.role || "user",
  });

  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => setOpenDialog(false);

  const createThumbnail = (base64Image: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Image;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const maxWidth = 100;
        const scaleSize = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scaleSize;
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const thumbnailBase64 = canvas.toDataURL("image/jpeg", 0.7);
        resolve(thumbnailBase64);
      };
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files, value } = e.target;
    if (name === "image" && files?.[0]) {
      const file = files[0];
      const readerFull = new FileReader();
      readerFull.onloadend = () => {
        const fullImageBase64 = readerFull.result as string;
        createThumbnail(fullImageBase64).then((thumbnailBase64) => {
          setFormData((prev) => ({
            ...prev,
            image: thumbnailBase64,
            full_image: fullImageBase64,
            preview: fullImageBase64,
          }));
        });
      };
      readerFull.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        image: formData.image,
        full_image: formData.full_image,
      };

      const res = await fetch(`/api/users/${user?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      toast.success("Profile updated!");
      handleDialogClose();
      window.location.reload();
    } catch (err: any) {
      console.error(err);
      toast.error(`Failed to update profile: ${err.message}`);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      setCollapsed(mobile);
      setMobileDropdownOpen(false);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [setCollapsed]);

  useEffect(() => {
    socket.on("connect", () => console.log("Connected to WebSocket server"));
    socket.on("new_note", (note: SocketNote) => {
      toast.info(`📝 New note added by ${note.User?.username || "a user"}!`);
      setNewNotesCount((prev) => prev + 1);
    });
    return () => {
      socket.off("new_note");
      socket.off("connect");
    };
  }, []);

  useEffect(() => {
    if (location.pathname === "/notes") {
      setNewNotesCount(0);
    }
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  const visibleNavItems = navItems.filter((item) =>
    item.roles ? user?.role && item.roles.includes(user.role) : true
  );

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
            <ul className="nav flex-column" style={{ padding: 0, margin: 0, listStyle: "none" }}>
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
                    {item.label === "Notes" && newNotesCount > 0 && (
                      <span className="badge rounded-pill bg-danger ms-auto">{newNotesCount}</span>
                    )}
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
    <>
      <aside
        className={`text-white d-flex flex-column bg-dark ${
          collapsed ? "sidebar-collapsed" : "sidebar-expanded"
        }`}
        style={{
          width: collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED,
          transition: "width 0.3s ease",
          height: "100vh",
          overflowY: "auto",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <header className="d-flex justify-content-between align-items-center border-bottom border-secondary px-3 py-2">
          {!collapsed && user ? (
            <div className="d-flex align-items-center gap-2">
              <IconButton onClick={handleDialogOpen}>
                <Avatar
                  src={
                    user.image?.startsWith("data:") || user.image?.startsWith("http")
                      ? user.image
                      : `data:image/jpeg;base64,${user.image}`
                  }
                  alt={user.username}
                  sx={{ width: 40, height: 40 }}
                >
                  {capitalize(user.username)[0]}
                </Avatar>
              </IconButton>
              <div className="d-flex flex-column">
                <span className="fw-bold fs-6">{capitalize(user.username)}</span>
                <span className="text-secondary small">{capitalize(user.role)}</span>
              </div>
            </div>
          ) : (
            <div style={{ height: "2rem" }} />
          )}
          <button
            className="btn btn-sm btn-outline-light"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
          </button>
        </header>

        <nav className="flex-grow-1 px-2 py-3">
          <ul className="nav flex-column">
            {Object.entries(groupedItems).map(([section, items]) => (
              <React.Fragment key={section}>
                {!collapsed && section !== "default" && (
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
                    >
                      {item.icon}
                      {!collapsed && item.label}
                      {item.label === "Notes" && newNotesCount > 0 && (
                        <span className="badge rounded-pill bg-danger ms-auto">
                          {newNotesCount}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </React.Fragment>
            ))}
          </ul>
        </nav>
      </aside>

      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent dividers>
          <div className="d-flex flex-column align-items-center mb-3">
            <Avatar
              src={formData.preview}
              alt="Profile Preview"
              sx={{ width: 100, height: 100, mb: 1, border: "1px solid #ccc" }}
            />
            <Button variant="outlined" component="label" size="small">
              Upload Image
              <input
                type="file"
                accept="image/*"
                hidden
                name="image"
                onChange={handleInputChange}
                aria-label="Upload profile image"
              />
            </Button>
          </div>
          <TextField
            margin="dense"
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            fullWidth
            autoComplete="username"
            autoFocus
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            autoComplete="email"
          />
          <TextField
            margin="dense"
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            fullWidth
            autoComplete="new-password"
            helperText="Leave blank to keep current password"
          />
          <TextField
            margin="dense"
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            fullWidth
            disabled
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Sidebar;
