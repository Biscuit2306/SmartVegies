import React, { useState, useMemo, useRef, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import "../../styles/farmer-css/earnings.css";

// ── Chart Data ────────────────────────────────────────────────
const CHART_DATA = {
  "Last 6 Months": {
    labels: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN"],
    values: [3200, 4100, 5800, 4600, 6900, 8400],
  },
  "Last 3 Months": {
    labels: ["APR", "MAY", "JUN"],
    values: [4600, 6900, 8400],
  },
  "This Year": {
    labels: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
    values: [3200, 4100, 5800, 4600, 6900, 8400, 7200, 8800, 9400, 10200, 11000, 12450],
  },
};

// ── Transaction Data ──────────────────────────────────────────
const ALL_TRANSACTIONS = [
  { id: "#ORD-90214", date: "Jul 02, 2024", crop: "Organic Tomatoes",  qty: "500 kg",  amount: 1250.00, status: "completed" },
  { id: "#ORD-88721", date: "Jun 28, 2024", crop: "Sweet Corn",        qty: "1,200 kg",amount: 3480.00, status: "completed" },
  { id: "#ORD-87540", date: "Jun 21, 2024", crop: "Baby Spinach",      qty: "80 kg",   amount: 440.00,  status: "completed" },
  { id: "#ORD-86330", date: "Jun 15, 2024", crop: "Green Broccoli",    qty: "200 kg",  amount: 680.00,  status: "completed" },
  { id: "#ORD-85210", date: "Jun 10, 2024", crop: "Red Onions",        qty: "350 kg",  amount: 525.00,  status: "pending"   },
  { id: "#ORD-84190", date: "Jun 04, 2024", crop: "Nantes Carrots",    qty: "600 kg",  amount: 1110.00, status: "completed" },
  { id: "#ORD-83072", date: "May 28, 2024", crop: "Cherry Tomatoes",   qty: "120 kg",  amount: 840.00,  status: "completed" },
  { id: "#ORD-82010", date: "May 20, 2024", crop: "Organic Potatoes",  qty: "800 kg",  amount: 960.00,  status: "failed"    },
  { id: "#ORD-80900", date: "May 14, 2024", crop: "Mixed Greens",      qty: "150 kg",  amount: 825.00,  status: "completed" },
  { id: "#ORD-79811", date: "May 07, 2024", crop: "Zucchini",          qty: "90 kg",   amount: 315.00,  status: "pending"   },
  { id: "#ORD-78700", date: "Apr 30, 2024", crop: "Organic Tomatoes",  qty: "400 kg",  amount: 1000.00, status: "completed" },
  { id: "#ORD-77650", date: "Apr 22, 2024", crop: "Sweet Corn",        qty: "700 kg",  amount: 2030.00, status: "completed" },
];

const ROWS_PER_PAGE = 6;

const CATEGORIES = [
  { name: "Vegetables", pct: 50, fillClass: ""    },
  { name: "Fruits",     pct: 30, fillClass: "--2" },
  { name: "Grains",     pct: 20, fillClass: "--3" },
];

const FILTER_OPTIONS = ["All", "Completed", "Pending", "Failed"];
const PERIODS = ["Last 3 Months", "Last 6 Months", "This Year"];

// ── SVG Chart ─────────────────────────────────────────────────
function EarningsChart({ period }) {
  const { labels, values } = CHART_DATA[period];
  const [tooltip, setTooltip] = useState(null);

  const W = 600, H = 200, PAD = 16;
  const minV = Math.min(...values) * 0.85;
  const maxV = Math.max(...values) * 1.05;

  const xs = values.map((_, i) => PAD + (i / (values.length - 1)) * (W - PAD * 2));
  const ys = values.map((v) => H - PAD - ((v - minV) / (maxV - minV)) * (H - PAD * 2));

  let linePath = `M ${xs[0]} ${ys[0]}`;
  for (let i = 1; i < xs.length; i++) {
    const cpx = (xs[i - 1] + xs[i]) / 2;
    linePath += ` C ${cpx} ${ys[i - 1]}, ${cpx} ${ys[i]}, ${xs[i]} ${ys[i]}`;
  }
  const areaPath = `${linePath} L ${xs[xs.length - 1]} ${H} L ${xs[0]} ${H} Z`;

  return (
    <div className="sve__chart-area">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="sve-area-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#4a8e38" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#4a8e38" stopOpacity="0.01" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#sve-area-grad)" />
        <path d={linePath} fill="none" stroke="#4a8e38" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {xs.map((x, i) => (
          <g key={i}>
            <circle cx={x} cy={ys[i]} r="4.5" fill="#4a8e38" stroke="white" strokeWidth="2" />
            <rect
              x={x - 22} y={0} width={44} height={H}
              fill="transparent" style={{ cursor: "crosshair" }}
              onMouseEnter={() => setTooltip({ i, x, y: ys[i] })}
              onMouseLeave={() => setTooltip(null)}
            />
          </g>
        ))}
        {tooltip !== null && (
          <g>
            <line x1={tooltip.x} y1={0} x2={tooltip.x} y2={H}
              stroke="#4a8e38" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
            <rect x={tooltip.x - 40} y={tooltip.y - 34} width={80} height={26} rx={7} fill="#1a3a1a" />
            <text x={tooltip.x} y={tooltip.y - 16} textAnchor="middle"
              fill="white" fontSize="12" fontFamily="Sora, sans-serif" fontWeight="700">
              ${values[tooltip.i].toLocaleString()}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

// ── Main Earnings Page ────────────────────────────────────────
const Earnings = () => {
  const [period, setPeriod]         = useState("Last 6 Months");
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setFilter]   = useState("All");
  const [page, setPage]             = useState(1);
  const [exportDone, setExport]     = useState(false);
  const filterRef = useRef(null);

  // Close filter dropdown on outside click
  useEffect(() => {
    const h = (e) => { if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = useMemo(() => {
    if (activeFilter === "All") return ALL_TRANSACTIONS;
    return ALL_TRANSACTIONS.filter((t) => t.status === activeFilter.toLowerCase());
  }, [activeFilter]);

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const paginated  = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const handleFilter = (f) => { setFilter(f); setPage(1); setFilterOpen(false); };

  const handleExport = () => {
    setExport(true);
    setTimeout(() => setExport(false), 2200);
  };

  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className="sve__layout">
      <Sidebar />

      <div className="sve__main">
        {/* Top Bar */}
        <header className="sve__topbar">
          <div className="sve__topbar-left">
            <button className="sve__topbar-search-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>

          <div className="sve__topbar-right">
            <button className="sve__topbar-icon-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <span className="sve__notif-dot" />
            </button>

            <div className="sve__vendor-info">
              <div className="sve__vendor-text">
                <div className="sve__vendor-name">GreenFarm Organics</div>
                <div className="sve__vendor-tier">Premium Vendor</div>
              </div>
              <div className="sve__vendor-avatar">GO</div>
            </div>
          </div>
        </header>

        <main className="sve__content">

          {/* Page Header */}
          <div className="sve__page-header">
            <div className="sve__page-header-text">
              <h1>Earnings Overview</h1>
              <p>Track your revenue, payouts, and detailed transaction history.</p>
            </div>
            <button className="sve__export-btn" onClick={handleExport}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {exportDone ? "✓ Exported!" : "Export Reports"}
            </button>
          </div>

          {/* Summary Cards */}
          <div className="sve__summary-grid">
            {/* Total Earnings */}
            <div className="sve__summary-card">
              <div className="sve__summary-card-left">
                <div className="sve__summary-card-label">Total Earnings</div>
                <div className="sve__summary-card-value">$12,450.00</div>
                <div className="sve__summary-card-meta">
                  <svg className="sve__meta-icon" viewBox="0 0 24 24" fill="none" stroke="#3d7a2e" strokeWidth="2.5">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                  <span className="sve__meta-positive">15.2%</span>
                  <span>vs. previous month</span>
                </div>
              </div>
              <div className="sve__summary-card-icon sve__summary-card-icon--green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </div>
            </div>

            {/* Pending Payouts */}
            <div className="sve__summary-card">
              <div className="sve__summary-card-left">
                <div className="sve__summary-card-label">Pending Payouts</div>
                <div className="sve__summary-card-value">$1,280.50</div>
                <div className="sve__summary-card-meta">
                  <svg className="sve__meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span>Next payout: July 15, 2024</span>
                </div>
              </div>
              <div className="sve__summary-card-icon sve__summary-card-icon--orange">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
            </div>

            {/* Last Payout */}
            <div className="sve__summary-card">
              <div className="sve__summary-card-left">
                <div className="sve__summary-card-label">Last Payout</div>
                <div className="sve__summary-card-value">$2,100.00</div>
                <div className="sve__summary-card-meta">
                  <svg className="sve__meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span>Processed on June 30, 2024</span>
                </div>
              </div>
              <div className="sve__summary-card-icon sve__summary-card-icon--blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
            </div>
          </div>

          {/* Chart + Categories */}
          <div className="sve__mid-row">
            {/* Earnings Trends Chart */}
            <div className="sve__chart-card">
              <div className="sve__chart-header">
                <div>
                  <div className="sve__chart-title">Earnings Trends</div>
                  <div className="sve__chart-subtitle">Revenue performance over time</div>
                </div>
                <div className="sve__period-selector">
                  {PERIODS.map((p) => (
                    <button
                      key={p}
                      className={`sve__period-btn ${period === p ? "sve__period-btn--active" : ""}`}
                      onClick={() => setPeriod(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <EarningsChart period={period} />

              <div className="sve__chart-months">
                {CHART_DATA[period].labels.map((m) => (
                  <span key={m} className="sve__chart-month">{m}</span>
                ))}
              </div>
            </div>

            {/* Top Categories */}
            <div className="sve__categories-card">
              <div className="sve__categories-title">Top Categories</div>
              <div className="sve__categories-list">
                {CATEGORIES.map((cat, idx) => (
                  <div key={cat.name} className="sve__category-item">
                    <div className="sve__category-header">
                      <span className="sve__category-name">{cat.name}</span>
                      <span className="sve__category-pct">{cat.pct}%</span>
                    </div>
                    <div className="sve__category-bar-track">
                      <div
                        className={`sve__category-bar-fill sve__category-bar-fill${cat.fillClass}`}
                        style={{ width: `${cat.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button className="sve__view-breakdown-btn">View Detailed Breakdown</button>
            </div>
          </div>

          {/* Transaction History */}
          <div className="sve__transactions-card">
            <div className="sve__transactions-header">
              <span className="sve__transactions-title">Transaction History</span>
              <div className="sve__filter-wrap" ref={filterRef}>
                <button className="sve__filter-btn" onClick={() => setFilterOpen((o) => !o)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                    <line x1="11" y1="18" x2="13" y2="18" />
                  </svg>
                  Filter {activeFilter !== "All" ? `· ${activeFilter}` : ""}
                </button>
                {filterOpen && (
                  <div className="sve__filter-dropdown">
                    {FILTER_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        className={`sve__filter-option ${activeFilter === opt ? "sve__filter-option--active" : ""}`}
                        onClick={() => handleFilter(opt)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <table className="sve__table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Date</th>
                  <th>Crop Type</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((txn) => (
                  <tr key={txn.id}>
                    <td><span className="sve__txn-id">{txn.id}</span></td>
                    <td><span className="sve__txn-date">{txn.date}</span></td>
                    <td><span className="sve__txn-crop">{txn.crop}</span></td>
                    <td><span className="sve__txn-qty">{txn.qty}</span></td>
                    <td><span className="sve__txn-amount">${txn.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span></td>
                    <td>
                      <span className={`sve__txn-status sve__txn-status--${txn.status}`}>
                        <span className="sve__txn-status-dot" />
                        {cap(txn.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="sve__pagination">
              <span className="sve__pagination-info">
                Showing {filtered.length === 0 ? 0 : (page - 1) * ROWS_PER_PAGE + 1} to{" "}
                {Math.min(page * ROWS_PER_PAGE, filtered.length)} of {filtered.length} transactions
              </span>
              <div className="sve__pagination-btns">
                <button className="sve__page-btn" disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}>Previous</button>
                {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    className={`sve__page-num ${page === n ? "sve__page-num--active" : ""}`}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </button>
                ))}
                <button className="sve__page-btn" disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}>Next</button>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default Earnings;