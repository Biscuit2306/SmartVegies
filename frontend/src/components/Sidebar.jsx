import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/farmer-css/Sidebar.css";

const navItems = [
  {
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    path: "/farmer/dashboard",
  },
  {
    label: "My Crops",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2a10 10 0 0 1 0 20" />
        <path d="M12 2C6.48 2 2 6.48 2 12" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    ),
    path: "/farmer/crops",
  },
  {
    label: "Orders",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
    ),
    path: "/farmer/orders",
  },
  {
    label: "Bulk Requests",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="10" y1="14" x2="14" y2="14" />
      </svg>
    ),
    path: "/farmer/bulk-requests",
  },
  {
    label: "Earnings",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
    path: "/farmer/earnings",
  },
  {
    label: "Policies & Aid",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    path: "/farmer/policies",
  },
  {
    label: "Profile",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    path: "/farmer/profile",
  },
];

const bottomItems = [
  {
    label: "Logout",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    ),
    path: "/login",
    danger: true,
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path) => {
    return location.pathname === path || location.pathname.includes(path.split('/').pop());
  };

  return (
    <aside className={`sv-sidebar${collapsed ? " sv-sidebar--collapsed" : ""}`}>
      {/* Brand */}
      <div className="sv-sidebar__brand" onClick={() => navigate("/farmer/dashboard")} style={{ cursor: "pointer" }}>
        <div className="sv-sidebar__logo">
          <svg viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="white" fillOpacity="0.15" />
            <path d="M16 6C16 6 8 12 8 18a8 8 0 0016 0c0-6-8-12-8-12z" fill="white" fillOpacity="0.9" />
            <path d="M16 10C16 10 20 14 20 18a4 4 0 01-8 0c0-4 4-8 4-8z" fill="#2d5a27" />
          </svg>
        </div>
        {!collapsed && (
          <>
            <span className="sv-sidebar__brand-name">SmartVegies</span>
            <button
              className="sv-sidebar__collapse-btn"
              onClick={(e) => { e.stopPropagation(); setCollapsed(true); }}
              title="Close sidebar"
            >
              {/* X Close icon — explicit width/height px, strokeWidth=3, strokeLinecap=round */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ display: "block" }}
              >
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* When collapsed — show expand button below logo */}
      {collapsed && (
        <button
          className="sv-sidebar__expand-btn"
          onClick={() => setCollapsed(false)}
          title="Expand sidebar"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      {/* Vendor Label */}
      {!collapsed && <div className="sv-sidebar__section-label">Vendor Portal</div>}

      {/* Main Nav */}
      <nav className="sv-sidebar__nav">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`sv-sidebar__nav-item ${isActive(item.path) ? "sv-sidebar__nav-item--active" : ""}`}
            onClick={() => navigate(item.path)}
            title={collapsed ? item.label : undefined}
          >
            <span className="sv-sidebar__nav-icon">{item.icon}</span>
            {!collapsed && <span className="sv-sidebar__nav-label">{item.label}</span>}
            {!collapsed && item.badge && (
              <span className="sv-sidebar__nav-badge">{item.badge}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Spacer */}
      <div className="sv-sidebar__spacer" />

      {/* Bottom Items */}
      <div className="sv-sidebar__bottom">
        {bottomItems.map((item) => (
          <button
            key={item.label}
            className={`sv-sidebar__nav-item ${item.danger ? "sv-sidebar__nav-item--danger" : ""} ${isActive(item.path) ? "sv-sidebar__nav-item--active" : ""}`}
            onClick={() => navigate(item.path)}
            title={collapsed ? item.label : undefined}
          >
            <span className="sv-sidebar__nav-icon">{item.icon}</span>
            {!collapsed && <span className="sv-sidebar__nav-label">{item.label}</span>}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;