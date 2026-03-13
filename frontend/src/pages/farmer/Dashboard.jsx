import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import "../../styles/farmer-css/dashboard.css";
import { useOrders } from "../../Context/Orderscontext";

// Inline persisted state — no external file needed
const usePersistedState = (key, initialValue) => {
  const [state, setStateRaw] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : initialValue;
    } catch { return initialValue; }
  });
  const setState = (value) => {
    setStateRaw((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
      return next;
    });
  };
  return [state, setState];
};

// ── Static Data ──────────────────────────────────────────────
const STATS = [
  {
    id: "revenue",
    label: "Total Revenue",
    value: "$45,285.00",
    badge: "+12.4%",
    badgeType: "positive",
    iconType: "revenue",
    accentColor: "#4a8e38",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
  {
    id: "orders",
    label: "Active Orders",
    value: "142",
    badge: "Active",
    badgeType: "active",
    iconType: "orders",
    accentColor: "#3d72d4",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 3h22l-2 13H3z" />
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
      </svg>
    ),
  },
  {
    id: "alerts",
    label: "Inventory Alerts",
    value: "08",
    badge: "Low Stock",
    badgeType: "warning",
    iconType: "alerts",
    accentColor: "#e08a2a",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    id: "rating",
    label: "Store Rating",
    value: "4.92",
    badge: "Excellent",
    badgeType: "success",
    iconType: "rating",
    accentColor: "#7b4fc9",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
];

const INITIAL_STOCK_ITEMS = [
  { name: "Organic Carrots", remaining: "12kg remaining", pct: 18, level: "critical", emoji: "🥕" },
  { name: "Baby Spinach",    remaining: "5kg remaining",  pct: 10, level: "critical", emoji: "🥬" },
  { name: "Green Broccoli",  remaining: "18kg remaining", pct: 35, level: "low",      emoji: "🥦" },
];

const WEEK_CURRENT = [22, 38, 30, 45, 35, 68, 58];
const WEEK_LAST    = [18, 28, 22, 40, 28, 52, 48];
const DAYS         = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ── SVG Chart Helper ─────────────────────────────────────────
function buildPath(points, W, H, minV, maxV) {
  const pad = 10;
  const xs = points.map((_, i) => pad + (i / (points.length - 1)) * (W - pad * 2));
  const ys = points.map((v) => H - pad - ((v - minV) / (maxV - minV)) * (H - pad * 2));

  let d = `M ${xs[0]} ${ys[0]}`;
  for (let i = 1; i < xs.length; i++) {
    const cpx = (xs[i - 1] + xs[i]) / 2;
    d += ` C ${cpx} ${ys[i - 1]}, ${cpx} ${ys[i]}, ${xs[i]} ${ys[i]}`;
  }
  return { d, xs, ys };
}

function SalesChart() {
  const [tooltip, setTooltip] = useState(null);
  const svgRef = useRef(null);
  const W = 600, H = 180;
  const allVals = [...WEEK_CURRENT, ...WEEK_LAST];
  const minV = Math.min(...allVals) - 5;
  const maxV = Math.max(...allVals) + 5;

  const cur = buildPath(WEEK_CURRENT, W, H, minV, maxV);
  const last = buildPath(WEEK_LAST, W, H, minV, maxV);

  const areaD = `${cur.d} L ${cur.xs[cur.xs.length - 1]} ${H} L ${cur.xs[0]} ${H} Z`;

  return (
    <div className="svd__chart-area">
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="svd-area-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#4a8e38" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#4a8e38" stopOpacity="0.01" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#svd-area-gradient)" />
        <path d={last.d} fill="none" stroke="#c8d8c4" strokeWidth="2" strokeDasharray="5 4" />
        <path d={cur.d}  fill="none" stroke="#4a8e38" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {cur.xs.map((x, i) => (
          <g key={i}>
            <circle cx={x} cy={cur.ys[i]} r="4" fill="#4a8e38" stroke="white" strokeWidth="2" />
            <rect x={x - 20} y={0} width={40} height={H} fill="transparent" className="svd__chart-hover-area"
              onMouseEnter={() => setTooltip({ i, x, y: cur.ys[i] })}
              onMouseLeave={() => setTooltip(null)} />
          </g>
        ))}
        {tooltip !== null && (
          <g>
            <line x1={tooltip.x} y1={0} x2={tooltip.x} y2={H} stroke="#4a8e38" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
            <rect x={tooltip.x - 36} y={tooltip.y - 34} width={72} height={26} rx={6} fill="#1a3a1a" />
            <text x={tooltip.x} y={tooltip.y - 16} textAnchor="middle" fill="white" fontSize="12" fontFamily="Sora, sans-serif" fontWeight="600">
              ${WEEK_CURRENT[tooltip.i]}k
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

// ── Main Dashboard Component ─────────────────────────────────
const Dashboard = () => {
  // Shared orders from context — synced with Orders page
  const { orders, setOrders } = useOrders();

  const [farmerName, setFarmerName] = useState(() => {
    try { const p = JSON.parse(localStorage.getItem("sv_profile")); return p?.name || p?.farmerName || "GreenFarm Organics"; } catch { return "GreenFarm Organics"; }
  });
  useEffect(() => {
    const sync = () => { try { const p = JSON.parse(localStorage.getItem("sv_profile")); setFarmerName(p?.name || p?.farmerName || "GreenFarm Organics"); } catch {} };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  const farmerInitials = farmerName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const [searchVal, setSearchVal]               = useState("");
  const [restockClicked, setRestockClicked]     = useState(false);
  const [periodFilter, setPeriodFilter]         = useState("Last 30 Days");
  const [showPeriodMenu, setShowPeriodMenu]     = useState(false);
  const [showAllStock, setShowAllStock]         = useState(false);
  const [showAllOrders, setShowAllOrders]       = useState(false);
  const [orderActionMenu, setOrderActionMenu]   = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedOrderAction, setSelectedOrderAction] = useState(null);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [restockOrders, setRestockOrders]       = useState([]);
  const [stockItems, setStockItems]             = usePersistedState("sv_stock_items", INITIAL_STOCK_ITEMS);
  const [editStatus, setEditStatus]             = useState("");

  // Period-based slicing of the shared orders
  const getOrdersForPeriod = () => {
    const extra30 = [
      { id: "#SV-9028", customer: "Liam Chen",     initials: "LC", date: "Nov 10, 2023", total: "$74.50",  status: "processing" },
      { id: "#SV-9029", customer: "Priya Nair",    initials: "PN", date: "Nov 08, 2023", total: "$128.00", status: "completed"  },
      { id: "#SV-9030", customer: "Tom Nguyen",    initials: "TN", date: "Nov 06, 2023", total: "$52.20",  status: "pending"    },
      { id: "#SV-9031", customer: "Sara Mitchell", initials: "SM", date: "Nov 04, 2023", total: "$210.75", status: "completed"  },
    ];
    const extra90 = [
      ...extra30,
      { id: "#SV-9026", customer: "James Wilson", initials: "JW", date: "Oct 21, 2023", total: "$95.30",  status: "completed" },
      { id: "#SV-9032", customer: "Rachel Kim",   initials: "RK", date: "Oct 15, 2023", total: "$183.40", status: "processing" },
    ];
    const extraYear = [
      ...extra90,
      { id: "#SV-9027", customer: "Emma Davis",   initials: "ED", date: "Oct 20, 2023", total: "$156.80", status: "processing" },
      { id: "#SV-9033", customer: "David Park",   initials: "DP", date: "Sep 30, 2023", total: "$99.10",  status: "completed"  },
    ];
    const periodData = {
      "Last 7 Days":  orders.slice(0, 2),
      "Last 30 Days": [...orders, ...extra30],
      "Last 90 Days": [...orders, ...extra90],
      "This Year":    [...orders, ...extraYear],
    };
    return periodData[periodFilter] || orders;
  };

  // Build restock list and open modal
  const handleRestock = () => {
    const items = stockItems
      .filter((item) => item.level === "critical" || item.level === "low")
      .map((item) => ({
        name: item.name,
        emoji: item.emoji,
        level: item.level,
        suggestedQty: item.level === "critical" ? 50 : 30,
        unit: "kg",
        supplier: "",
      }));
    setRestockOrders(items);
    setShowRestockModal(true);
    setRestockClicked(true);
    setTimeout(() => setRestockClicked(false), 2000);
  };

  // Update a single restock row field
  const handleRestockFieldChange = (idx, field, value) => {
    setRestockOrders((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    );
  };

  // Order actions
  const handleOrderAction = (order, action) => {
    setOrderActionMenu(null);
    if (action === "Cancel Order") {
      // Remove the order from shared state
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
    } else if (action === "Edit") {
      setEditStatus(order.status);
      setSelectedOrderAction({ order, action: "edit" });
    } else if (action === "View Details") {
      setSelectedOrderAction({ order, action: "view" });
    }
  };

  const handleSaveOrderEdit = () => {
    setOrders((prev) =>
      prev.map((o) => (o.id === selectedOrderAction.order.id ? { ...o, status: editStatus } : o))
    );
    setSelectedOrderAction(null);
  };

  const displayStockItems = showAllStock ? stockItems : stockItems.slice(0, 3);
  const displayOrders     = showAllOrders ? getOrdersForPeriod() : getOrdersForPeriod().slice(0, 5);

  return (
    <div className="svd__layout">
      <Sidebar activePage="Dashboard" />

      <div className="svd__main">
        {/* Top Bar */}
        <header className="svd__topbar">
          <div className="svd__search-wrap">
            <svg className="svd__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="svd__search-input"
              type="text"
              placeholder="Search orders, inventory, or reports..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
            />
          </div>

          <div className="svd__topbar-right">
            <div className="svd__notif-wrapper">
              <button className="svd__notif-btn" title="Notifications" onClick={() => setShowNotifications(!showNotifications)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 01-3.46 0" />
                </svg>
                <span className="svd__notif-dot" />
              </button>
              {showNotifications && (
                <div className="svd__notif-panel">
                  <div className="svd__notif-panel-header">Notifications</div>
                  <div className="svd__notif-panel-body">
                    <div className="svd__notif-item">✓ Low stock alert for Organic Carrots</div>
                    <div className="svd__notif-item">💬 New order from Sarah Jenkins</div>
                    <div className="svd__notif-item">⚠️ Inventory review needed</div>
                    <div className="svd__notif-item">✅ Order #SV-9021 completed</div>
                  </div>
                  <div className="svd__notif-panel-footer">
                    <button onClick={() => setShowNotifications(false)} className="svd__notif-mark-read">Mark all as read</button>
                  </div>
                </div>
              )}
            </div>

            <div className="svd__vendor-info">
              <div className="svd__vendor-text">
                <div className="svd__vendor-name">{farmerName}</div>
                <div className="svd__vendor-tier">Premium Vendor</div>
              </div>
              <div className="svd__vendor-avatar">{farmerInitials}</div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="svd__content">

          {/* Header — New Product button removed */}
          <div className="svd__header">
            <div className="svd__header-text">
              <h1>Dashboard Overview</h1>
              <p>Monitor your farm's performance and manage daily operations.</p>
            </div>
            <div className="svd__header-actions">
              <div className="svd__dropdown-wrapper">
                <button className="svd__btn-outline" onClick={() => setShowPeriodMenu(!showPeriodMenu)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  {periodFilter}
                </button>
                {showPeriodMenu && (
                  <div className="svd__period-dropdown">
                    {["Last 7 Days", "Last 30 Days", "Last 90 Days", "This Year"].map((period) => (
                      <button key={period} onClick={() => { setPeriodFilter(period); setShowPeriodMenu(false); }} className="svd__period-item">
                        {period}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="svd__stats-grid">
            {STATS.map((stat) => (
              <div key={stat.id} className="svd__stat-card" style={{ "--accent-color": stat.accentColor }}>
                <div className="svd__stat-card-top">
                  <div className={`svd__stat-icon svd__stat-icon--${stat.iconType}`}>{stat.icon}</div>
                  <span className={`svd__stat-badge svd__stat-badge--${stat.badgeType}`}>{stat.badge}</span>
                </div>
                <div className="svd__stat-label">{stat.label}</div>
                <div className="svd__stat-value">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Sales Chart + Inventory */}
          <div className="svd__mid-row">
            <div className="svd__chart-card">
              <div className="svd__chart-header">
                <div>
                  <div className="svd__chart-title">Sales Performance</div>
                  <div className="svd__chart-subtitle">Weekly revenue trends</div>
                </div>
              </div>
              <div className="svd__chart-legend">
                <div className="svd__legend-item">
                  <span className="svd__legend-dot svd__legend-dot--last" />
                  Last Week
                </div>
              </div>
              <SalesChart />
              <div className="svd__chart-days">
                {DAYS.map((d) => <span key={d} className="svd__chart-day">{d}</span>)}
              </div>
            </div>

            <div className="svd__stock-card">
              <div className="svd__stock-header">
                <span className="svd__stock-title">Inventory ({stockItems.length})</span>
                <button className="svd__stock-view-all" onClick={() => setShowAllStock(!showAllStock)}>
                  {showAllStock ? "Show Less" : "View All"}
                </button>
              </div>
              <div className="svd__stock-items">
                {displayStockItems.map((item, idx) => (
                  <div key={`${item.name}-${idx}`} className="svd__stock-item">
                    <div className="svd__stock-img">{item.emoji}</div>
                    <div className="svd__stock-info">
                      <div className="svd__stock-name">{item.name}</div>
                      <div className="svd__stock-remaining">{item.remaining}</div>
                    </div>
                    <div className="svd__stock-bar-wrap">
                      <div className="svd__stock-bar-track">
                        <div className={`svd__stock-bar-fill svd__stock-bar-fill--${item.level}`} style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="svd__stock-restock-btn" onClick={handleRestock}>
                {restockClicked ? "✓ Order Placed!" : "Generate Restock Order"}
              </button>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="svd__orders-card">
            <div className="svd__orders-header">
              <span className="svd__orders-title">
                Recent Orders ({displayOrders.length} of {getOrdersForPeriod().length})
              </span>
              <button className="svd__orders-toggle" onClick={() => setShowAllOrders(!showAllOrders)}>
                {showAllOrders ? "Show Less" : "View All Orders"}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>

            <table className="svd__orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {displayOrders.map((order) => (
                  <tr key={order.id}>
                    <td><span className="svd__order-id">{order.id}</span></td>
                    <td>
                      <div className="svd__order-customer">
                        <div className="svd__order-avatar">{order.initials}</div>
                        <span className="svd__order-name">{order.customer}</span>
                      </div>
                    </td>
                    <td>{order.date}</td>
                    <td><strong>{order.total}</strong></td>
                    <td>
                      <span className={`svd__status-pill svd__status-pill--${order.status}`}>
                        <span className="svd__status-dot" />
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="svd__action-cell">
                      <button
                        className="svd__order-action-btn"
                        title="More options"
                        onClick={() => setOrderActionMenu(orderActionMenu === order.id ? null : order.id)}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <circle cx="12" cy="5" r="1.5" />
                          <circle cx="12" cy="12" r="1.5" />
                          <circle cx="12" cy="19" r="1.5" />
                        </svg>
                      </button>
                      {orderActionMenu === order.id && (
                        <div className="svd__action-menu">
                          <button onClick={() => handleOrderAction(order, "View Details")} className="svd__action-item">View Details</button>
                          <button onClick={() => handleOrderAction(order, "Cancel Order")}  className="svd__action-item">Cancel Order</button>
                          <button onClick={() => handleOrderAction(order, "Edit")}          className="svd__action-item">Edit</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </main>

        {/* ── Order Detail Modal ── */}
        {selectedOrderAction && selectedOrderAction.action === "view" && (
          <div className="svd__modal-overlay" onClick={() => setSelectedOrderAction(null)}>
            <div className="svd__modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="svd__modal-header">
                <h3>Order Details</h3>
                <button onClick={() => setSelectedOrderAction(null)} className="svd__modal-close">&times;</button>
              </div>
              <div className="svd__modal-body">
                <div className="svd__detail-row"><strong>Order ID:</strong> {selectedOrderAction.order.id}</div>
                <div className="svd__detail-row"><strong>Customer:</strong> {selectedOrderAction.order.customer}</div>
                <div className="svd__detail-row"><strong>Date:</strong>     {selectedOrderAction.order.date}</div>
                <div className="svd__detail-row"><strong>Total:</strong>    {selectedOrderAction.order.total}</div>
                <div className="svd__detail-row">
                  <strong>Status:</strong>
                  <span className={`svd__status-pill svd__status-pill--${selectedOrderAction.order.status}`}>
                    <span className="svd__status-dot" />
                    {selectedOrderAction.order.status.charAt(0).toUpperCase() + selectedOrderAction.order.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="svd__modal-actions">
                <button onClick={() => setSelectedOrderAction(null)} className="svd__btn-cancel">Close</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Order Edit Modal ── */}
        {selectedOrderAction && selectedOrderAction.action === "edit" && (
          <div className="svd__modal-overlay" onClick={() => setSelectedOrderAction(null)}>
            <div className="svd__modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="svd__modal-header">
                <h3>Edit Order Status</h3>
                <button onClick={() => setSelectedOrderAction(null)} className="svd__modal-close">&times;</button>
              </div>
              <div className="svd__modal-body">
                <div className="svd__form-group">
                  <label className="svd__form-label">Order ID</label>
                  <input type="text" value={selectedOrderAction.order.id} disabled className="svd__form-input" />
                </div>
                <div className="svd__form-group">
                  <label className="svd__form-label">Customer</label>
                  <input type="text" value={selectedOrderAction.order.customer} disabled className="svd__form-input" />
                </div>
                <div className="svd__form-group">
                  <label className="svd__form-label">Status</label>
                  {/* "cancelled" removed as requested */}
                  <select className="svd__form-input" value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="svd__modal-actions">
                <button onClick={() => setSelectedOrderAction(null)} className="svd__btn-cancel">Cancel</button>
                <button onClick={handleSaveOrderEdit} className="svd__btn-submit">Save Changes</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Restock Order Modal (editable) ── */}
        {showRestockModal && (
          <div className="svd__modal-overlay" onClick={() => setShowRestockModal(false)}>
            <div className="svd__modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="svd__modal-header">
                <h3>Generate Restock Order</h3>
                <button onClick={() => setShowRestockModal(false)} className="svd__modal-close">&times;</button>
              </div>
              <div className="svd__modal-body">
                {restockOrders.length === 0 ? (
                  <p style={{ fontSize: "13px", color: "#7a9270" }}>All stock levels are healthy. No restock needed.</p>
                ) : (
                  restockOrders.map((item, idx) => (
                    <div key={idx} className="svd__detail-row" style={{ flexDirection: "column", alignItems: "flex-start", gap: "10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%" }}>
                        <span style={{ fontSize: "18px" }}>{item.emoji}</span>
                        <strong style={{ fontSize: "13px", color: "#1a2e18" }}>{item.name}</strong>
                        <span style={{ fontSize: "11px", color: item.level === "critical" ? "#c04040" : "#c07a20", fontWeight: 600, textTransform: "uppercase", marginLeft: "4px" }}>
                          {item.level}
                        </span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 1fr", gap: "8px", width: "100%" }}>
                        <div className="svd__form-group" style={{ margin: 0 }}>
                          <label className="svd__form-label">Qty to Order</label>
                          <input
                            type="number"
                            min="1"
                            className="svd__form-input"
                            value={item.suggestedQty}
                            onChange={(e) => handleRestockFieldChange(idx, "suggestedQty", e.target.value)}
                          />
                        </div>
                        <div className="svd__form-group" style={{ margin: 0 }}>
                          <label className="svd__form-label">Unit</label>
                          <select
                            className="svd__form-input"
                            value={item.unit}
                            onChange={(e) => handleRestockFieldChange(idx, "unit", e.target.value)}
                          >
                            <option value="kg">kg</option>
                            <option value="ton">ton</option>
                            <option value="liter">liter</option>
                            <option value="box">box</option>
                          </select>
                        </div>
                        <div className="svd__form-group" style={{ margin: 0 }}>
                          <label className="svd__form-label">Supplier (optional)</label>
                          <input
                            type="text"
                            className="svd__form-input"
                            placeholder="e.g. AgriSupply Co."
                            value={item.supplier}
                            onChange={(e) => handleRestockFieldChange(idx, "supplier", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="svd__modal-actions">
                <button onClick={() => setShowRestockModal(false)} className="svd__btn-cancel">Close</button>
                {restockOrders.length > 0 && (
                  <button
                    onClick={() => {
                      setShowRestockModal(false);
                      alert(`Restock order submitted for ${restockOrders.length} item(s)!`);
                    }}
                    className="svd__btn-submit"
                  >
                    Confirm & Submit Order
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;