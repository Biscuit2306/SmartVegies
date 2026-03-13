import React, { useState, useMemo, useRef, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import "../../styles/farmer-css/orders.css";

// ── Static Data ───────────────────────────────────────────────
const ALL_ORDERS = [
  { id: "#ORD-94821", customer: "John Doe Market",    initials: "JD", items: "Organic Tomatoes (50kg), Basil (5kg)",          amount: 420.00,  status: "pending",    date: "Oct 24, 2023" },
  { id: "#ORD-94820", customer: "Healthy Foods Co.",  initials: "HF", items: "Sweet Corn (200 Units)",                         amount: 650.50,  status: "processing", date: "Oct 23, 2023" },
  { id: "#ORD-94819", customer: "Green Grocery",      initials: "GG", items: "Spinach (30kg), Carrots (100kg)",                amount: 890.00,  status: "shipped",    date: "Oct 22, 2023" },
  { id: "#ORD-94818", customer: "Veggie Bistro",      initials: "VB", items: "Potatoes (250kg), Onions (100kg)",               amount: 1240.00, status: "shipped",    date: "Oct 20, 2023" },
  { id: "#ORD-94817", customer: "Salad Nation",       initials: "SN", items: "Kale (15kg), Cucumber (40kg)",                   amount: 315.00,  status: "cancelled",  date: "Oct 19, 2023" },
  { id: "#ORD-94816", customer: "Farm Fresh Ltd",     initials: "FF", items: "Broccoli (60kg), Zucchini (20kg)",               amount: 530.00,  status: "pending",    date: "Oct 18, 2023" },
  { id: "#ORD-94815", customer: "Urban Harvest",      initials: "UH", items: "Cherry Tomatoes (80kg)",                         amount: 760.00,  status: "processing", date: "Oct 17, 2023" },
  { id: "#ORD-94814", customer: "Root & Vine",        initials: "RV", items: "Beetroot (45kg), Sweet Potato (90kg)",           amount: 410.00,  status: "shipped",    date: "Oct 16, 2023" },
  { id: "#ORD-94813", customer: "Green Table Co.",    initials: "GT", items: "Lettuce (25kg), Radish (10kg)",                  amount: 185.00,  status: "cancelled",  date: "Oct 15, 2023" },
  { id: "#ORD-94812", customer: "Pepper & Co.",       initials: "PC", items: "Bell Peppers (70kg), Chilli (15kg)",             amount: 620.75,  status: "pending",    date: "Oct 14, 2023" },
  { id: "#ORD-94811", customer: "Sunrise Foods",      initials: "SF", items: "Corn (150 Units), Peas (30kg)",                  amount: 870.00,  status: "shipped",    date: "Oct 13, 2023" },
  { id: "#ORD-94810", customer: "Daily Greens",       initials: "DG", items: "Spinach (50kg), Kale (20kg)",                    amount: 340.50,  status: "processing", date: "Oct 12, 2023" },
];

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
const fmt = (n) => `$${n.toFixed(2)}`;
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// ── Create Order Modal ─────────────────────────────────────────
const CreateOrderModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({
    customer: "", initials: "", items: "",
    amount: "", status: "pending", date: "",
  });

  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = () => {
    if (!form.customer.trim() || !form.items.trim()) return;
    const initials = form.initials.trim() ||
      form.customer.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    const dateStr = form.date
      ? new Date(form.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const nextId = `#ORD-${90000 + Math.floor(Math.random() * 9999)}`;
    onAdd({ id: nextId, customer: form.customer, initials, items: form.items,
            amount: parseFloat(form.amount) || 0, status: form.status, date: dateStr });
    onClose();
  };

  return (
    <div className="svo__modal-overlay" onClick={onClose}>
      <div className="svo__modal" onClick={(e) => e.stopPropagation()}>
        <div className="svo__modal-header">
          <span className="svo__modal-title">Create New Order</span>
          <button className="svo__modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="svo__modal-form">
          <div className="svo__form-row">
            <div className="svo__form-group">
              <label className="svo__form-label">Customer Name *</label>
              <input className="svo__form-input" name="customer" value={form.customer}
                placeholder="e.g. John Doe Market" onChange={handle} />
            </div>
            <div className="svo__form-group">
              <label className="svo__form-label">Initials (auto if blank)</label>
              <input className="svo__form-input" name="initials" value={form.initials}
                placeholder="e.g. JD" maxLength={2} onChange={handle} />
            </div>
          </div>

          <div className="svo__form-group svo__form-group--full">
            <label className="svo__form-label">Items *</label>
            <textarea className="svo__form-textarea" name="items" value={form.items}
              placeholder="e.g. Organic Tomatoes (50kg), Basil (5kg)" onChange={handle} />
          </div>

          <div className="svo__form-row">
            <div className="svo__form-group">
              <label className="svo__form-label">Total Amount ($)</label>
              <input className="svo__form-input" name="amount" type="number" min="0"
                value={form.amount} placeholder="0.00" onChange={handle} />
            </div>
            <div className="svo__form-group">
              <label className="svo__form-label">Status</label>
              <select className="svo__form-select" name="status" value={form.status} onChange={handle}>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="svo__form-group">
            <label className="svo__form-label">Order Date</label>
            <input className="svo__form-input" name="date" type="date"
              value={form.date} onChange={handle} />
          </div>
        </div>

        <div className="svo__modal-footer">
          <button className="svo__btn-outline" onClick={onClose}>Cancel</button>
          <button className="svo__btn-primary" onClick={submit}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Create Order
          </button>
        </div>
      </div>
    </div>
  );
};

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
  const [orders, setOrders]         = useState(ALL_ORDERS);
  const [statusFilter, setStatus]   = useState("all");
  const [sortBy, setSort]           = useState("newest");
  const [searchVal, setSearch]      = useState("");
  const [page, setPage]             = useState(1);
  const [showModal, setModal]       = useState(false);

  // Filter + sort
  const filtered = useMemo(() => {
    let list = [...orders];
    if (statusFilter !== "all") list = list.filter((o) => o.status === statusFilter);
    if (searchVal.trim())
      list = list.filter((o) =>
        o.customer.toLowerCase().includes(searchVal.toLowerCase()) ||
        o.id.toLowerCase().includes(searchVal.toLowerCase()) ||
        o.items.toLowerCase().includes(searchVal.toLowerCase())
      );
    if (sortBy === "newest")  list.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sortBy === "oldest")  list.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sortBy === "highest") list.sort((a, b) => b.amount - a.amount);
    if (sortBy === "lowest")  list.sort((a, b) => a.amount - b.amount);
    return list;
  }, [orders, statusFilter, sortBy, searchVal]);

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const paginated  = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  // Reset page when filter changes
  const handleFilter = (key) => { setStatus(key); setPage(1); };
  const handleSearch = (e)   => { setSearch(e.target.value); setPage(1); };

  const handleAdd = (order) => {
    setOrders((prev) => [order, ...prev]);
    setPage(1);
    setStatus("all");
  };

  const handleDelete = (id) => setOrders((prev) => prev.filter((o) => o.id !== id));

  const handleStatusChange = (id, newStatus) =>
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: newStatus } : o));

  // Page number buttons (max 3 shown)
  const pageNums = [];
  for (let i = 1; i <= Math.min(totalPages, 3); i++) pageNums.push(i);

  return (
    <div className="svo__layout">
      <Sidebar />

      <div className="svo__main">
        {/* Top Bar */}
        <header className="svo__topbar">
          <div className="svo__topbar-left">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <span className="svo__topbar-page-title">Order Management</span>
          </div>

          <div className="svo__topbar-right">
            <div className="svo__search-wrap">
              <svg className="svo__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                className="svo__search-input"
                type="text"
                placeholder="Search orders..."
                value={searchVal}
                onChange={handleSearch}
              />
            </div>

            <button className="svo__topbar-icon-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <span className="svo__notif-dot" />
            </button>

            <button className="svo__topbar-icon-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </button>

            <div className="svo__vendor-info">
              <div className="svo__vendor-text">
                <div className="svo__vendor-name">GreenFarm Organics</div>
                <div className="svo__vendor-tier">Premium Vendor</div>
              </div>
              <div className="svo__vendor-avatar">GO</div>
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
              <button className="svo__btn-outline">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export CSV
              </button>
              <button className="svo__btn-primary" onClick={() => setModal(true)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Create New
              </button>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="svo__controls-bar">
            <div className="svo__controls-left">
              <button className="svo__create-btn" onClick={() => setModal(true)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Create New
              </button>

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
              <select
                className="svo__sort-select"
                value={sortBy}
                onChange={(e) => setSort(e.target.value)}
              >
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
                      <td><span className="svo__items-text">{order.items}</span></td>
                      <td><span className="svo__amount">{fmt(order.amount)}</span></td>
                      <td>
                        <span className={`svo__status-badge svo__status-badge--${order.status}`}>
                          {cap(order.status)}
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
                <button className="svo__page-btn" disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}>Previous</button>

                <button className="svo__pagination-create-btn" onClick={() => setModal(true)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Create New
                </button>

                {pageNums.map((n) => (
                  <button
                    key={n}
                    className={`svo__page-num-btn ${page === n ? "svo__page-num-btn--active" : ""}`}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </button>
                ))}

                <button className="svo__page-btn" disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}>Next</button>
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

      {showModal && <CreateOrderModal onClose={() => setModal(false)} onAdd={handleAdd} />}
    </div>
  );
};

export default Orders;