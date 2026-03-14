import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/buyer-css/buyermyorders.css";

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, stroke = "currentColor", fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const icons = {
  leaf:    "M17 8C8 10 5.9 16.17 3.82 19.82A2 2 0 0 0 5.8 22.6C8 22 11 20 14 18c0 0 1.5 3.5 5 3.5 0-5-3-7-5-7 2-3 4-5 4-8.5 0-3-2.5-5-2.5-5S19 6 17 8z",
  grid:    ["M3 3h7v7H3z","M14 3h7v7h-7z","M14 14h7v7h-7z","M3 14h7v7H3z"],
  store:   "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0",
  cart:    "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M9 22v-4h6v4",
  orders:  ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z","M14 2v6h6","M16 13H8","M16 17H8","M10 9H8"],
  bulk:    "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
  user:    ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2","M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  search:  ["M21 21l-4.35-4.35","M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0"],
  filter:  ["M22 3H2l8 9.46V19l4 2v-8.54L22 3"],
  chevron: "M6 9l6 6 6-6",
  truck:   ["M1 3h15v13H1z","M16 8h4l3 3v5h-7V8z","M5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z","M18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"],
  rotate:  "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  check:   "M20 6L9 17l-5-5",
  pkg:     "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
  star:    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  trash:   ["M3 6h18","M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6","M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"],
};

// ─── localStorage helpers ─────────────────────────────────────────────────────
const readLiveOrders = () => {
  try {
    const raw = JSON.parse(localStorage.getItem("sv_orders") || "[]");
    if (!Array.isArray(raw)) return [];
    return raw.map((o) => ({
      id:           String(o.id           || ""),
      name:         String(o.name         || "Order"),
      emoji:        String(o.emoji        || "🛒"),
      date:         String(o.date         || ""),
      deliveryDate: String(o.deliveryDate || "—"),
      status:       String(o.status       || "processing"),
      items:        Number(o.items        || 0),
      price:        parseFloat(o.price    || 0),
      address:      String(o.address      || "—"),
      trackStep:    Number(o.trackStep    || 1),
      products: Array.isArray(o.products)
        ? o.products.map((p) => ({
            emoji: String(p.emoji || "🥦"),
            name:  String(p.name  || ""),
            qty:   String(p.qty   || ""),
            price: parseFloat(p.price || 0),
          }))
        : [],
    }));
  } catch { return []; }
};

const saveLiveOrders = (orders) => {
  try { localStorage.setItem("sv_orders", JSON.stringify(orders)); } catch {}
};

const readCart  = () => { try { return JSON.parse(localStorage.getItem("sv_cart") || "[]"); } catch { return []; } };
const saveCart  = (items) => { try { localStorage.setItem("sv_cart", JSON.stringify(items)); } catch {} };

// ─── Demo orders ──────────────────────────────────────────────────────────────
const DEMO_ORDERS = [
  {
    id: "#SV-20481", name: "Essential Box", emoji: "🥦",
    date: "Oct 12, 2024", deliveryDate: "Oct 15, 2024", status: "delivered",
    items: 6, price: 25.00, address: "42 Green Lane, Pune, MH 411001",
    products: [
      { emoji:"🥦", name:"Broccoli", qty:"500g", price:3.50 },
      { emoji:"🥕", name:"Carrots",  qty:"1kg",  price:2.80 },
      { emoji:"🧅", name:"Onions",   qty:"750g", price:1.90 },
      { emoji:"🥬", name:"Spinach",  qty:"300g", price:2.20 },
      { emoji:"🍅", name:"Tomatoes", qty:"600g", price:3.10 },
      { emoji:"🌽", name:"Corn",     qty:"4 pcs",price:4.00 },
    ], trackStep: 4,
  },
  {
    id: "#SV-20350", name: "Family Bundle", emoji: "🛒",
    date: "Oct 5, 2024", deliveryDate: "Oct 8, 2024", status: "delivered",
    items: 11, price: 45.00, address: "42 Green Lane, Pune, MH 411001",
    products: [
      { emoji:"🥬", name:"Kale",        qty:"400g",  price:4.20 },
      { emoji:"🫑", name:"Bell Pepper",  qty:"3 pcs", price:3.60 },
      { emoji:"🥒", name:"Cucumber",    qty:"2 pcs", price:2.40 },
      { emoji:"🧄", name:"Garlic",      qty:"200g",  price:1.80 },
    ], trackStep: 4,
  },
  {
    id: "#SV-20512", name: "Essential Box", emoji: "🥦",
    date: "Oct 19, 2024", deliveryDate: "Oct 22, 2024", status: "shipped",
    items: 6, price: 25.00, address: "42 Green Lane, Pune, MH 411001",
    products: [
      { emoji:"🥦", name:"Broccoli", qty:"500g", price:3.50 },
      { emoji:"🥕", name:"Carrots",  qty:"1kg",  price:2.80 },
      { emoji:"🧅", name:"Onions",   qty:"750g", price:1.90 },
    ], trackStep: 3,
  },
  {
    id: "#SV-20489", name: "Chef's Choice", emoji: "👨‍🍳",
    date: "Oct 14, 2024", deliveryDate: "Oct 17, 2024", status: "processing",
    items: 15, price: 60.00, address: "42 Green Lane, Pune, MH 411001",
    products: [
      { emoji:"🌿", name:"Fresh Basil", qty:"100g",  price:5.00 },
      { emoji:"🫛", name:"Edamame",     qty:"300g",  price:4.50 },
      { emoji:"🥑", name:"Avocado",     qty:"2 pcs", price:6.00 },
      { emoji:"🍆", name:"Eggplant",    qty:"500g",  price:3.20 },
    ], trackStep: 2,
  },
  {
    id: "#SV-20290", name: "Essential Box", emoji: "🥦",
    date: "Sep 28, 2024", deliveryDate: "—", status: "cancelled",
    items: 6, price: 25.00, address: "42 Green Lane, Pune, MH 411001",
    products: [
      { emoji:"🥦", name:"Broccoli", qty:"500g", price:3.50 },
      { emoji:"🥕", name:"Carrots",  qty:"1kg",  price:2.80 },
    ], trackStep: 0,
  },
];

const TRACK_LABELS = ["Ordered", "Processing", "Packed", "Shipped", "Delivered"];

const STATUS_FILTER_MAP = {
  "All Orders": null,
  "Delivered":  "delivered",
  "Shipped":    "shipped",
  "Processing": "processing",
  "Cancelled":  "cancelled",
};

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ msg, onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 2400); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{
      position:"fixed",bottom:28,right:28,background:"#2a6a14",color:"white",
      padding:"12px 18px",borderRadius:12,fontSize:13,fontWeight:700,
      boxShadow:"0 8px 24px rgba(0,0,0,0.18)",display:"flex",alignItems:"center",
      gap:8,zIndex:9999,fontFamily:"Nunito,sans-serif",
    }}>
      ✅ {msg}
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function MyOrders() {
  const [activeTab, setActiveTab] = useState("All Orders");
  const [expanded,  setExpanded]  = useState(null);
  const [search,    setSearch]    = useState("");
  const [sortBy,    setSortBy]    = useState("newest");
  const [toast,     setToast]     = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const fire = (msg) => setToast(msg);

  const buildOrders = () => {
    const live = readLiveOrders();
    return live.length ? [...live, ...DEMO_ORDERS] : DEMO_ORDERS;
  };
  const [orders, setOrders] = useState(buildOrders);

  useEffect(() => {
    setOrders(buildOrders());
    const onFocus = () => setOrders(buildOrders());
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const toggle = (id) => setExpanded((prev) => (prev === id ? null : id));

  /* ── Reorder: push all products back into cart ── */
  const handleReorder = (order) => {
    const cart = readCart();
    (order.products || []).forEach(p => {
      const existing = cart.find(c => c.name === p.name);
      if (existing) {
        existing.qty = (existing.qty || 1) + 1;
      } else {
        cart.push({ id: Date.now() + Math.random(), name: p.name, emoji: p.emoji, price: p.price, qty: 1, unitLabel: "kg" });
      }
    });
    saveCart(cart);
    fire(`Items from "${order.name}" added to cart!`);
  };

  /* ── Cancel: update status only for live orders ── */
  const handleCancel = (orderId) => {
    const live = readLiveOrders();
    const updated = live.map(o => o.id === orderId ? { ...o, status: "cancelled", trackStep: 0 } : o);
    saveLiveOrders(updated);
    setOrders([...updated, ...DEMO_ORDERS]);
    setExpanded(null);
    fire("Order cancelled successfully.");
  };

  const liveIds = new Set(readLiveOrders().map(o => o.id));

  const filtered = orders
    .filter((o) => {
      const matchTab    = STATUS_FILTER_MAP[activeTab] == null || o.status === STATUS_FILTER_MAP[activeTab];
      const name        = (o.name || "").toLowerCase();
      const id          = (o.id   || "").toLowerCase();
      const matchSearch = name.includes(search.toLowerCase()) || id.includes(search.toLowerCase());
      return matchTab && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "newest")  return orders.indexOf(a) - orders.indexOf(b);
      if (sortBy === "oldest")  return orders.indexOf(b) - orders.indexOf(a);
      if (sortBy === "highest") return b.price - a.price;
      if (sortBy === "lowest")  return a.price - b.price;
      return 0;
    });

  const stats = {
    total:     orders.length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    pending:   orders.filter((o) => ["processing","shipped"].includes(o.status)).length,
    spent:     orders.reduce((s, o) => s + (parseFloat(o.price) || 0), 0),
  };

  const badgeClass = (status) => `sv-mo__badge sv-mo__badge--${status}`;
  const badgeLabel = { delivered:"Delivered", processing:"Processing", shipped:"Shipped", cancelled:"Cancelled" };

  const NAV_LINKS = [
    { id:"dashboard",   path:"/buyer/dashboard",   label:"Dashboard",  iconKeys:["grid"]   },
    { id:"marketplace", path:"/buyer/marketplace", label:"Marketplace",iconKeys:["store"]  },
    { id:"cart",        path:"/buyer/cart",        label:"Cart",       iconKeys:["cart"]   },
    { id:"myorders",    path:"/buyer/orders",      label:"My Orders",  iconKeys:["orders"] },
    { id:"bulk",        path:"/buyer/bulk-order",  label:"Bulk Order", iconKeys:["bulk"]   },
    { id:"profile",     path:"/buyer/profile",     label:"Profile",    iconKeys:["user"]   },
  ];

  return (
    <div className="sv-mo__app">
      {/* Sidebar */}
      <aside className="sv-mo__sidebar">
        <div className="sv-mo__logo">
          <div className="sv-mo__logo-icon">
            <Icon d={icons.leaf} size={20} stroke="#5bc424" />
          </div>
          SmartVegies
        </div>
        <nav className="sv-mo__nav">
          {NAV_LINKS.map(({ id, path, label, iconKeys }) => (
            <button
              key={id}
              className={`sv-mo__nav-item${location.pathname === path ? " sv-mo__nav-item--active" : ""}`}
              onClick={() => navigate(path)}
            >
              {iconKeys.map((k, i) => <Icon key={i} d={icons[k]} size={20} />)}
              {label}
            </button>
          ))}
        </nav>
        <div className="sv-mo__wallet">
          <div className="sv-mo__wallet-label">Current Balance</div>
          <div className="sv-mo__wallet-amount">₹142.50</div>
          <button className="sv-mo__wallet-btn">Top Up Wallet</button>
        </div>
      </aside>

      {/* Main */}
      <main className="sv-mo__main">
        {/* Header — Reorder Last Box button removed */}
        <div className="sv-mo__header">
          <div>
            <h1 className="sv-mo__title">My Orders</h1>
            <p className="sv-mo__subtitle">
              Track your fresh veggie deliveries, reorder favourites, and manage everything in one place.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="sv-mo__stats">
          {[
            { label:"Total Orders", value:stats.total,                 icon:"pkg",  color:"green" },
            { label:"Delivered",    value:stats.delivered,             icon:"check",color:"blue"  },
            { label:"In Progress",  value:stats.pending,               icon:"truck",color:"amber" },
            { label:"Total Spent",  value:`₹${stats.spent.toFixed(2)}`,icon:"star", color:"red"   },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className="sv-mo__stat-card">
              <div className={`sv-mo__stat-icon sv-mo__stat-icon--${color}`}>
                <Icon d={icons[icon]} size={22} />
              </div>
              <div className="sv-mo__stat-info">
                <div className="sv-mo__stat-value">{value}</div>
                <div className="sv-mo__stat-label">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="sv-mo__tabs">
          {Object.keys(STATUS_FILTER_MAP).map((tab) => (
            <button
              key={tab}
              className={`sv-mo__tab${activeTab === tab ? " sv-mo__tab--active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="sv-mo__controls">
          <div className="sv-mo__search-wrap">
            <Icon d={icons.search} size={18} stroke="#9ca3af" fill="none" />
            <input
              className="sv-mo__search"
              placeholder="Search by name or order ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="sv-mo__filter-btn">
            <Icon d={icons.filter} size={16} />
            Filter
          </button>
          <select className="sv-mo__sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Price</option>
            <option value="lowest">Lowest Price</option>
          </select>
        </div>

        {/* Orders list */}
        <div className="sv-mo__orders-list">
          {filtered.length === 0 ? (
            <div className="sv-mo__empty">
              <div className="sv-mo__empty-icon">📦</div>
              <h3>No orders found</h3>
              <p>Try adjusting your filters or search query.</p>
            </div>
          ) : (
            filtered.map((order) => {
              const isOpen  = expanded === order.id;
              const fillPct = order.trackStep > 0
                ? `${(order.trackStep / (TRACK_LABELS.length - 1)) * 100}%`
                : "0%";
              const canCancel = order.status !== "cancelled" && order.status !== "delivered" && liveIds.has(order.id);

              return (
                <div key={order.id} className={`sv-mo__order-card${isOpen ? " sv-mo__order-card--expanded" : ""}`}>

                  {/* Card Header */}
                  <div className="sv-mo__order-header" onClick={() => toggle(order.id)}>
                    <div className="sv-mo__order-left">
                      <div className="sv-mo__order-icon">{order.emoji || "🛒"}</div>
                      <div className="sv-mo__order-meta">
                        <div className="sv-mo__order-id">{order.id}</div>
                        <div className="sv-mo__order-name">{order.name || "Order"}</div>
                        <div className="sv-mo__order-date">Ordered {order.date}</div>
                      </div>
                    </div>
                    <div className="sv-mo__order-right">
                      <div className="sv-mo__order-items"><span>{order.items}</span> items</div>
                      <div className="sv-mo__order-price">
                        ₹{parseFloat(order.price || 0).toFixed(2)}<small>total</small>
                      </div>
                      <span className={badgeClass(order.status)}>{badgeLabel[order.status] || order.status}</span>
                      <button
                        className={`sv-mo__expand-btn${isOpen ? " sv-mo__expand-btn--open" : ""}`}
                        onClick={(e) => { e.stopPropagation(); toggle(order.id); }}
                        title={isOpen ? "Hide details" : "View details"}
                      >
                        {isOpen ? (
                          <Icon d={icons.chevron} size={16} />
                        ) : (
                          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isOpen && (
                    <div className="sv-mo__order-details">
                      {/* Track Progress */}
                      {order.status !== "cancelled" && (
                        <div className="sv-mo__track">
                          <div className="sv-mo__track-title">Order Progress</div>
                          <div className="sv-mo__track-steps">
                            <div className="sv-mo__track-line">
                              <div className="sv-mo__track-fill" style={{ width: fillPct }} />
                            </div>
                            {TRACK_LABELS.map((label, idx) => {
                              const done   = idx < order.trackStep;
                              const active = idx === order.trackStep;
                              return (
                                <div key={label} className="sv-mo__track-step">
                                  <div className={`sv-mo__track-circle${done ? " sv-mo__track-circle--done" : active ? " sv-mo__track-circle--active" : ""}`}>
                                    {done ? <Icon d={icons.check} size={12} /> : idx + 1}
                                  </div>
                                  <div className={`sv-mo__track-label${active ? " sv-mo__track-label--active" : ""}`}>{label}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div className="sv-mo__details-grid">
                        {/* Items */}
                        <div className="sv-mo__items-section">
                          <div className="sv-mo__section-title">Items in This Order</div>
                          {(order.products || []).map((p, idx) => (
                            <div key={idx} className="sv-mo__item-row">
                              <div className="sv-mo__item-emoji">{p.emoji}</div>
                              <div className="sv-mo__item-info">
                                <div className="sv-mo__item-name">{p.name}</div>
                                <div className="sv-mo__item-qty">{p.qty}</div>
                              </div>
                              <div className="sv-mo__item-price">₹{parseFloat(p.price || 0).toFixed(2)}</div>
                            </div>
                          ))}
                        </div>

                        {/* Delivery Info + Actions */}
                        <div className="sv-mo__delivery-section">
                          <div className="sv-mo__section-title">Delivery Details</div>
                          <div className="sv-mo__delivery-info">
                            {[
                              ["Order ID",      order.id],
                              ["Order Date",    order.date],
                              ["Delivery Date", order.deliveryDate || "—"],
                              ["Address",       order.address || "—"],
                              ["Status",        badgeLabel[order.status] || order.status],
                            ].map(([key, val]) => (
                              <div key={key} className="sv-mo__delivery-row">
                                <div className="sv-mo__delivery-dot" />
                                <div>
                                  <div className="sv-mo__delivery-key">{key}</div>
                                  <div className="sv-mo__delivery-val">{val}</div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Actions — Track Order removed, icons added, both working */}
                          <div className="sv-mo__details-actions">
                            <button
                              className="sv-mo__detail-btn sv-mo__detail-btn--outline"
                              onClick={() => handleReorder(order)}
                            >
                              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/>
                                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                              </svg>
                              Reorder
                            </button>

                            {canCancel && (
                              <button
                                className="sv-mo__detail-btn sv-mo__detail-btn--danger"
                                onClick={() => handleCancel(order.id)}
                              >
                                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6"/>
                                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                  <path d="M10 11v6M14 11v6"/>
                                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                                </svg>
                                Cancel Order
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  );
} 