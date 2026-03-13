import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/Sidebar";
import "../../styles/farmer-css/dashboard.css";

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

const STOCK_ITEMS = [
  { name: "Organic Carrots", remaining: "12kg remaining", pct: 18, level: "critical", emoji: "🥕" },
  { name: "Baby Spinach",   remaining: "5kg remaining",  pct: 10, level: "critical", emoji: "🥬" },
  { name: "Green Broccoli", remaining: "18kg remaining", pct: 35, level: "low",      emoji: "🥦" },
];

const ORDERS = [
  { id: "#SV-9021", customer: "Sarah Jenkins",  initials: "SJ", date: "Oct 24, 2023", total: "$124.50", status: "completed" },
  { id: "#SV-9022", customer: "Marco Rivera",   initials: "MR", date: "Oct 24, 2023", total: "$87.00",  status: "processing" },
  { id: "#SV-9023", customer: "Aisha Patel",    initials: "AP", date: "Oct 23, 2023", total: "$203.75", status: "pending" },
  { id: "#SV-9024", customer: "Tom Nguyen",     initials: "TN", date: "Oct 23, 2023", total: "$55.20",  status: "completed" },
  { id: "#SV-9025", customer: "Linda Osei",     initials: "LO", date: "Oct 22, 2023", total: "$310.00", status: "cancelled" },
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
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="svd-area-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#4a8e38" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#4a8e38" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <path d={areaD} fill="url(#svd-area-gradient)" />

        {/* Last week line */}
        <path d={last.d} fill="none" stroke="#c8d8c4" strokeWidth="2" strokeDasharray="5 4" />

        {/* Current week line */}
        <path d={cur.d} fill="none" stroke="#4a8e38" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Data points + hover targets */}
        {cur.xs.map((x, i) => (
          <g key={i}>
            <circle cx={x} cy={cur.ys[i]} r="4" fill="#4a8e38" stroke="white" strokeWidth="2" />
            <rect
              x={x - 20}
              y={0}
              width={40}
              height={H}
              fill="transparent"
              style={{ cursor: "crosshair" }}
              onMouseEnter={() => setTooltip({ i, x, y: cur.ys[i] })}
              onMouseLeave={() => setTooltip(null)}
            />
          </g>
        ))}

        {/* Tooltip */}
        {tooltip !== null && (
          <g>
            <line
              x1={tooltip.x} y1={0}
              x2={tooltip.x} y2={H}
              stroke="#4a8e38" strokeWidth="1" strokeDasharray="4 3"
              opacity="0.5"
            />
            <rect
              x={tooltip.x - 36}
              y={tooltip.y - 34}
              width={72}
              height={26}
              rx={6}
              fill="#1a3a1a"
            />
            <text
              x={tooltip.x}
              y={tooltip.y - 16}
              textAnchor="middle"
              fill="white"
              fontSize="12"
              fontFamily="Sora, sans-serif"
              fontWeight="600"
            >
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
  const [searchVal, setSearchVal] = useState("");
  const [restockClicked, setRestockClicked] = useState(false);

  const handleRestock = () => {
    setRestockClicked(true);
    setTimeout(() => setRestockClicked(false), 2000);
  };

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
            <button className="svd__notif-btn" title="Notifications">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <span className="svd__notif-dot" />
            </button>

            <div className="svd__vendor-info">
              <div className="svd__vendor-text">
                <div className="svd__vendor-name">GreenFarm Organics</div>
                <div className="svd__vendor-tier">Premium Vendor</div>
              </div>
              <div className="svd__vendor-avatar">GO</div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="svd__content">

          {/* Header */}
          <div className="svd__header">
            <div className="svd__header-text">
              <h1>Dashboard Overview</h1>
              <p>Monitor your farm's performance and manage daily operations.</p>
            </div>
            <div className="svd__header-actions">
              <button className="svd__btn-outline">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Last 30 Days
              </button>
              <button className="svd__btn-primary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                New Product
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="svd__stats-grid">
            {STATS.map((stat) => (
              <div
                key={stat.id}
                className="svd__stat-card"
                style={{ "--accent-color": stat.accentColor }}
              >
                <div className="svd__stat-card-top">
                  <div className={`svd__stat-icon svd__stat-icon--${stat.iconType}`}>
                    {stat.icon}
                  </div>
                  <span className={`svd__stat-badge svd__stat-badge--${stat.badgeType}`}>
                    {stat.badge}
                  </span>
                </div>
                <div className="svd__stat-label">{stat.label}</div>
                <div className="svd__stat-value">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Sales Chart + Low Stock */}
          <div className="svd__mid-row">
            {/* Chart */}
            <div className="svd__chart-card">
              <div className="svd__chart-header">
                <div>
                  <div className="svd__chart-title">Sales Performance</div>
                  <div className="svd__chart-subtitle">Weekly revenue trends</div>
                </div>
                <div className="svd__chart-legend">
                  <div className="svd__legend-item">
                    <span className="svd__legend-dot svd__legend-dot--current" />
                    Current Week
                  </div>
                  <div className="svd__legend-item">
                    <span className="svd__legend-dot svd__legend-dot--last" />
                    Last Week
                  </div>
                </div>
              </div>

              <SalesChart />

              <div className="svd__chart-days">
                {DAYS.map((d) => (
                  <span key={d} className="svd__chart-day">{d}</span>
                ))}
              </div>
            </div>

            {/* Low Stock */}
            <div className="svd__stock-card">
              <div className="svd__stock-header">
                <span className="svd__stock-title">Low Stock</span>
                <button className="svd__stock-view-all">View All</button>
              </div>

              <div className="svd__stock-items">
                {STOCK_ITEMS.map((item) => (
                  <div key={item.name} className="svd__stock-item">
                    <div className="svd__stock-img">{item.emoji}</div>
                    <div className="svd__stock-info">
                      <div className="svd__stock-name">{item.name}</div>
                      <div className="svd__stock-remaining">{item.remaining}</div>
                    </div>
                    <div className="svd__stock-bar-wrap">
                      <div className="svd__stock-bar-track">
                        <div
                          className={`svd__stock-bar-fill svd__stock-bar-fill--${item.level}`}
                          style={{ width: `${item.pct}%` }}
                        />
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
              <span className="svd__orders-title">Recent Orders</span>
              <button className="svd__orders-view-all">
                View All Orders
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
                {ORDERS.map((order) => (
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
                    <td>
                      <button className="svd__order-action-btn" title="More options">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <circle cx="12" cy="5" r="1.5" />
                          <circle cx="12" cy="12" r="1.5" />
                          <circle cx="12" cy="19" r="1.5" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </main>
      </div>
    </div>
  );
};

export default Dashboard;