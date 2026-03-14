import React, { useState, useMemo, useRef, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import "../../styles/farmer-css/orders.css";
import { useOrders } from "../../Context/Orderscontext";

// ── Static Data ───────────────────────────────────────────────
const ROWS_PER_PAGE = 5;

const STATUS_FILTERS = [
  { key: "all",        label: "All",        dotClass: "svo__status-dot--all"        },
  { key: "pending",    label: "Pending",    dotClass: "svo__status-dot--pending"    },
  { key: "processing", label: "Processing", dotClass: "svo__status-dot--processing" },
  { key: "shipped",    label: "Shipped",    dotClass: "svo__status-dot--shipped"    },
  { key: "cancelled",  label: "Cancelled",  dotClass: "svo__status-dot--cancelled"  },
];

const BOTTOM_STATS = [
  {
    label: "Active Orders",
    value: "24",
    badge: "+12.5%",
    badgeType: "positive",
    iconClass: "svo__stat-icon--green",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
    ),
  },
  {
    label: "In Transit",
    value: "12",
    badge: "+4.2%",
    badgeType: "blue",
    iconClass: "svo__stat-icon--blue",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <path d="M16 8h4l3 3v5h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    label: "Unprocessed",
    value: "18",
    badge: "8 new",
    badgeType: "new",
    iconClass: "svo__stat-icon--orange",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" y1="13" x2="15" y2="13" />
        <line x1="9" y1="17" x2="12" y2="17" />
      </svg>
    ),
  },
];

// ── Helpers ───────────────────────────────────────────────────
const fmt = (n) => `₹${n.toFixed(2)}`;
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// ── Action Dropdown ────────────────────────────────────────────
const ActionMenu = ({ orderId, onDelete, onStatusChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="svo__action-menu-wrap" ref={ref}>
      <button className="svo__action-btn" onClick={() => setOpen((o) => !o)}>
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
          <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
        </svg>
      </button>
      {open && (
        <div className="svo__action-dropdown">
          <button className="svo__action-dropdown-item" onClick={() => { onStatusChange(orderId, "processing"); setOpen(false); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Mark Processing
          </button>
          <button className="svo__action-dropdown-item" onClick={() => { onStatusChange(orderId, "shipped"); setOpen(false); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 3v5h-7V8z" />
              <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            Mark Shipped
          </button>
          <button className="svo__action-dropdown-item" onClick={() => { onStatusChange(orderId, "cancelled"); setOpen(false); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
            </svg>
            Cancel Order
          </button>
          <button className="svo__action-dropdown-item svo__action-dropdown-item--danger"
            onClick={() => { onDelete(orderId); setOpen(false); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
            </svg>
            Delete Order
          </button>
        </div>
      )}
    </div>
  );
};

// ── Main Orders Page ───────────────────────────────────────────
const Orders = () => {
  // Shared orders from context — synced with Dashboard
  const { orders, setOrders } = useOrders();

  // Merge buyer cart orders from localStorage into context on mount, focus, and storage events
  useEffect(() => {
    const mergeFromStorage = () => {
      try {
        const fromCart = JSON.parse(localStorage.getItem("sv_farmer_orders") || "[]");
        if (!fromCart.length) return;
        setOrders(prev => {
          const existingIds = new Set(prev.map(o => o.id));
          const newEntries = fromCart.filter(o => !existingIds.has(o.id));
          return newEntries.length ? [...newEntries, ...prev] : prev;
        });
      } catch {}
    };
    mergeFromStorage();
    window.addEventListener("focus", mergeFromStorage);
    window.addEventListener("storage", mergeFromStorage);
    return () => {
      window.removeEventListener("focus", mergeFromStorage);
      window.removeEventListener("storage", mergeFromStorage);
    };
  }, [setOrders]);

  const [farmerName, setFarmerName] = useState(() => {
    try { const p = JSON.parse(localStorage.getItem("sv_profile")); return p?.name || p?.farmerName || "GreenFarm Organics"; } catch { return "GreenFarm Organics"; }
  });
  useEffect(() => {
    const sync = () => { try { const p = JSON.parse(localStorage.getItem("sv_profile")); setFarmerName(p?.name || p?.farmerName || "GreenFarm Organics"); } catch {} };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  const farmerInitials = farmerName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const [statusFilter, setStatus]         = useState("all");
  const [sortBy, setSort]                 = useState("newest");
  const [searchVal, setSearch]            = useState("");
  const [page, setPage]                   = useState(1);
  const [showNotifications, setShowNotifications] = useState(false);

  // Filter + sort
  const filtered = useMemo(() => {
    let list = [...orders];
    if (statusFilter !== "all") list = list.filter((o) => o.status === statusFilter);
    if (searchVal.trim())
      list = list.filter((o) =>
        o.customer.toLowerCase().includes(searchVal.toLowerCase()) ||
        o.id.toLowerCase().includes(searchVal.toLowerCase()) ||
        (o.items || "").toLowerCase().includes(searchVal.toLowerCase())
      );
    if (sortBy === "newest")  list.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sortBy === "oldest")  list.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sortBy === "highest") list.sort((a, b) => (b.amount || 0) - (a.amount || 0));
    if (sortBy === "lowest")  list.sort((a, b) => (a.amount || 0) - (b.amount || 0));
    return list;
  }, [orders, statusFilter, sortBy, searchVal]);

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const paginated  = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const handleFilter = (key) => { setStatus(key); setPage(1); };
  const handleSearch = (e)   => { setSearch(e.target.value); setPage(1); };

  const handleDelete = (id) => setOrders((prev) => prev.filter((o) => o.id !== id));

  const handleStatusChange = (id, newStatus) =>
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: newStatus } : o));

  const handleExportCSV = () => {
    const headers = ["Order ID", "Customer", "Items", "Total Amount", "Status", "Date"];
    const rows = orders.map((o) => [
      o.id,
      o.customer,
      o.items || "",
      o.amount != null ? `₹${o.amount.toFixed(2)}` : (o.total || ""),
      o.status,
      o.date,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${(v || "").toString().replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const pageNums = [];
  for (let i = 1; i <= Math.min(totalPages, 3); i++) pageNums.push(i);

  return (
    <div className="svo__layout">
      <Sidebar activePage="Orders" />

      <div className="svo__main">
        {/* Top Bar */}
        <header className="svo__topbar">
          <div className="svo__search-wrap">
            <svg className="svo__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="svo__search-input"
              type="text"
              placeholder="Search orders, inventory, or reports..."
              value={searchVal}
              onChange={handleSearch}
            />
          </div>

          <div className="svo__topbar-right">
            <div className="svo__notif-wrapper">
              <button className="svo__notif-btn" title="Notifications" onClick={() => setShowNotifications(!showNotifications)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 01-3.46 0" />
                </svg>
                <span className="svo__notif-dot" />
              </button>
              {showNotifications && (
                <div className="svo__notif-panel">
                  <div className="svo__notif-panel-header">Notifications</div>
                  <div className="svo__notif-panel-body">
                    <div className="svo__notif-item">✓ Low stock alert for Organic Carrots</div>
                    <div className="svo__notif-item">💬 New order from Sarah Jenkins</div>
                    <div className="svo__notif-item">⚠️ Inventory review needed</div>
                    <div className="svo__notif-item">✅ Order #SV-9021 completed</div>
                  </div>
                  <div className="svo__notif-panel-footer">
                    <button onClick={() => setShowNotifications(false)} className="svo__notif-mark-read">Mark all as read</button>
                  </div>
                </div>
              )}
            </div>

            <div className="svo__vendor-info">
              <div className="svo__vendor-text">
                <div className="svo__vendor-name">{farmerName}</div>
                <div className="svo__vendor-tier">Premium Vendor</div>
              </div>
              <div className="svo__vendor-avatar">{farmerInitials}</div>
            </div>
          </div>
        </header>

        <main className="svo__content">
          {/* Page Header */}
          <div className="svo__header">
            <div className="svo__header-text">
              <h1>Customer Orders</h1>
              <p>Manage and track your agricultural produce sales.</p>
            </div>
            <div className="svo__header-actions">
              <button className="svo__btn-outline" onClick={handleExportCSV}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export CSV
              </button>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="svo__controls-bar">
            <div className="svo__controls-left">
              <div className="svo__status-filters">
                {STATUS_FILTERS.map((f) => (
                  <button
                    key={f.key}
                    className={`svo__status-filter-btn ${statusFilter === f.key ? "svo__status-filter-btn--active" : ""}`}
                    onClick={() => handleFilter(f.key)}
                  >
                    <span className={`svo__status-dot ${f.dotClass}`} />
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="svo__controls-right">
              <span className="svo__sort-label">Sort by:</span>
              <select className="svo__sort-select" value={sortBy} onChange={(e) => setSort(e.target.value)}>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Amount</option>
                <option value="lowest">Lowest Amount</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="svo__table-card">
            <table className="svo__table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="svo__empty">
                        <div className="svo__empty-icon">📦</div>
                        <div className="svo__empty-title">No orders found</div>
                        <div className="svo__empty-sub">Try a different filter or create a new order.</div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((order) => (
                    <tr key={order.id}>
                      <td><span className="svo__order-id">{order.id}</span></td>
                      <td>
                        <div className="svo__customer-cell">
                          <div className="svo__customer-avatar">{order.initials}</div>
                          <span className="svo__customer-name">{order.customer}</span>
                        </div>
                      </td>
                      <td><span className="svo__items-text">{order.items || "—"}</span></td>
                      <td><span className="svo__amount">{order.amount != null ? fmt(order.amount) : (order.total || "—")}</span></td>
                      <td>
                        <span className={`svo__status-badge svo__status-badge--${order.status || "processing"}`}>
                          {cap(order.status || "processing")}
                        </span>
                      </td>
                      <td><span className="svo__date-text">{order.date}</span></td>
                      <td>
                        <ActionMenu
                          orderId={order.id}
                          onDelete={handleDelete}
                          onStatusChange={handleStatusChange}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="svo__pagination">
              <span className="svo__pagination-info">
                Showing {filtered.length === 0 ? 0 : (page - 1) * ROWS_PER_PAGE + 1} to{" "}
                {Math.min(page * ROWS_PER_PAGE, filtered.length)} of {filtered.length} orders
              </span>
              <div className="svo__pagination-right">
                <button className="svo__page-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</button>

                {pageNums.map((n) => (
                  <button
                    key={n}
                    className={`svo__page-num-btn ${page === n ? "svo__page-num-btn--active" : ""}`}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </button>
                ))}

                <button className="svo__page-btn" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
              </div>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="svo__stats-row">
            {BOTTOM_STATS.map((s) => (
              <div key={s.label} className="svo__stat-card">
                <div className="svo__stat-card-top">
                  <div className={`svo__stat-icon ${s.iconClass}`}>{s.icon}</div>
                  <span className={`svo__stat-badge svo__stat-badge--${s.badgeType}`}>{s.badge}</span>
                </div>
                <div className="svo__stat-label">{s.label}</div>
                <div className="svo__stat-value">{s.value}</div>
              </div>
            ))}
          </div>
        </main>
      </div>

    </div>
  );
};

export default Orders;