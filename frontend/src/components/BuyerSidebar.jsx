import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/buyer-css/BuyerSidebar.css";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    path: "/buyer/dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "Marketplace",
    path: "/buyer/marketplace",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    label: "Cart",
    path: "/buyer/cart",
    badge: 3,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
      </svg>
    ),
  },
  {
    label: "My Orders",
    path: "/buyer/orders",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    label: "Bulk Order",
    path: "/buyer/bulk-order",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
      </svg>
    ),
  },
  {
    label: "Profile",
    path: "/buyer/profile",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

const BuyerSidebar = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const isActive  = (path) => {
    // Exact path match for buyer pages
    return location.pathname === path;
  };

  return (
    <aside className="svbs__sidebar">
      {/* Brand */}
      <div className="svbs__brand" onClick={() => navigate("/buyer/dashboard")}>
        <div className="svbs__logo">
          <svg viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="white" fillOpacity="0.2" />
            <path d="M16 6C16 6 8 12 8 18a8 8 0 0016 0c0-6-8-12-8-12z" fill="white" fillOpacity="0.95" />
            <path d="M16 10c0 0 4 4 4 8a4 4 0 01-8 0c0-4 4-8 4-8z" fill="#4CAF50" />
          </svg>
        </div>
        <span className="svbs__brand-name">SmartVegies</span>
      </div>

      {/* Nav */}
      <nav className="svbs__nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            className={`svbs__nav-item ${isActive(item.path) ? "svbs__nav-item--active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            <span className="svbs__nav-icon">{item.icon}</span>
            <span className="svbs__nav-label">{item.label}</span>
            {item.badge && <span className="svbs__nav-badge">{item.badge}</span>}
          </button>
        ))}
      </nav>

      <div className="svbs__spacer" />

      {/* Spacer */}
      <div className="svbs__spacer-bottom" />
    </aside>
  );
};

export default BuyerSidebar;