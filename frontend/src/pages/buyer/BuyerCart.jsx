import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/buyer-css/BuyerCart.css";

/* ── Data ─────────────────────────────────────────── */
const INIT_CART = [
  { id: 1, name: "Organic Persian Limes", desc: "Fresh from Florida groves",      price: 12.00, unit: "bag",  emoji: "🍋", qty: 5 },
  { id: 2, name: "Fresh Key Limes",       desc: "Perfect for baking and cocktails",price:  8.50, unit: "bag",  emoji: "🫒", qty: 2 },
  { id: 3, name: "Lime Juice - 1L",       desc: "100% Cold-pressed juice",         price: 15.00, unit: "unit", emoji: "🧃", qty: 1 },
];

const FBT_ITEMS = [
  { id: 10, name: "Eureka Lemons",    price: "$9.00 / bag",    emoji: "🍋" },
  { id: 11, name: "Woven Lime Basket",price: "$18.50 / unit",  emoji: "🧺" },
  { id: 12, name: "Fresh Mint Leaves",price: "$4.25 / bunch",  emoji: "🌿" },
];

const SHIPPING_THRESHOLD = 50;

const NAV_ITEMS = [
  { label: "Dashboard",    path: "/buyer/dashboard" },
  { label: "Marketplace",  path: "/buyer/marketplace" },
  { label: "Cart",         path: "/buyer/cart" },
  { label: "My Orders",    path: "/buyer/orders" },
  { label: "Bulk Order",   path: "/buyer/bulk-order" },
  { label: "Subscription", path: "/buyer/subscription" },
  { label: "Profile",      path: "/buyer/profile" },
];

/* ── Nav icon helper ───────────────────────────────── */
const NavIcon = ({ label }) => {
  if (label === "Dashboard")    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
  if (label === "Marketplace")  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
  if (label === "Cart")         return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>;
  if (label === "My Orders")    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
  if (label === "Bulk Order")   return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>;
  if (label === "Subscription") return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
  if (label === "Profile")      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
  return null;
};

/* ── Toast ─────────────────────────────────────────── */
const Toast = ({ msg, onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="svbc__toast">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      {msg}
    </div>
  );
};

/* ── Main Component ────────────────────────────────── */
const BuyerCart = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [cart,     setCart]     = useState(INIT_CART);
  const [fbtAdded, setFbtAdded] = useState({});
  const [toast,    setToast]    = useState(null);

  const fire = (msg) => setToast(msg);

  /* Computed totals */
  const subtotal = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart]);
  const shipping  = subtotal >= SHIPPING_THRESHOLD ? 0 : 5.99;
  const tax       = parseFloat((subtotal * 0.05).toFixed(2));
  const total     = parseFloat((subtotal + shipping + tax).toFixed(2));

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);

  /* Qty handlers */
  const increment = (id) =>
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i));

  const decrement = (id) =>
    setCart(prev => prev.map(i => i.id === id && i.qty > 1 ? { ...i, qty: i.qty - 1 } : i));

  const removeItem = (id) => {
    setCart(prev => prev.filter(i => i.id !== id));
    fire("Item removed from cart.");
  };

  /* FBT add */
  const addFbt = (item) => {
    if (fbtAdded[item.id]) return;
    setFbtAdded(prev => ({ ...prev, [item.id]: true }));
    fire(`${item.name} added to cart!`);
    setTimeout(() => setFbtAdded(prev => ({ ...prev, [item.id]: false })), 2000);
  };

  return (
    <div className="svbc__layout">

      {/* ════ SIDEBAR ════ */}
      <aside className="svbc__sidebar">
        <div className="svbc__brand" onClick={() => navigate("/buyer/dashboard")}>
          <div className="svbc__brand-logo">🌿</div>
          <span className="svbc__brand-name">SmartVegies</span>
        </div>

        <nav className="svbc__nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.label}
              className={`svbc__nav-btn ${location.pathname === item.path ? "svbc__active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span className="svbc__nav-icon"><NavIcon label={item.label} /></span>
              <span className="svbc__nav-label">{item.label}</span>
              {item.label === "Cart" && totalItems > 0 && (
                <span className="svbc__nav-badge">{totalItems}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="svbc__spacer" />

        <div className="svbc__wallet">
          <div className="svbc__wallet-lbl">Current Balance</div>
          <div className="svbc__wallet-amt">$142.50</div>
          <button className="svbc__wallet-btn" onClick={() => fire("Top Up opened!")}>
            Top Up Wallet
          </button>
        </div>
      </aside>

      {/* ════ MAIN ════ */}
      <div className="svbc__main">
        <main className="svbc__content">

          {/* Page Header */}
          <div className="svbc__page-header">
            <h1 className="svbc__page-title">Your Cart</h1>
            <p className="svbc__page-sub">
              Review items before checkout.{" "}
              {cart.length > 0
                ? `You have ${totalItems} item${totalItems !== 1 ? "s" : ""} in your cart.`
                : "Your cart is empty."}
            </p>
          </div>

          {/* Main row */}
          <div className="svbc__main-row">

            {/* Cart Items */}
            <div className="svbc__cart-items">
              {cart.length === 0 ? (
                <div className="svbc__empty">
                  <div className="svbc__empty-icon">🛒</div>
                  <div className="svbc__empty-title">Your cart is empty</div>
                  <p className="svbc__empty-sub">Add some fresh produce to get started!</p>
                  <button className="svbc__go-shop-btn" onClick={() => navigate("/buyer/marketplace")}>
                    Shop Now
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="svbc__item-card">
                    <div className="svbc__item-img">{item.emoji}</div>

                    <div className="svbc__item-info">
                      <div className="svbc__item-name">{item.name}</div>
                      <div className="svbc__item-desc">{item.desc}</div>
                      <div className="svbc__item-price">${item.price.toFixed(2)} / {item.unit}</div>
                    </div>

                    <div className="svbc__item-controls">
                      <div className="svbc__qty-wrap">
                        <button
                          className="svbc__qty-btn"
                          onClick={() => decrement(item.id)}
                          disabled={item.qty <= 1}
                        >−</button>
                        <span className="svbc__qty-val">{item.qty}</span>
                        <button
                          className="svbc__qty-btn"
                          onClick={() => increment(item.id)}
                        >+</button>
                      </div>

                      <button
                        className="svbc__delete-btn"
                        onClick={() => removeItem(item.id)}
                        title="Remove item"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Order Summary */}
            <div className="svbc__summary-card">
              <div className="svbc__summary-title">Order Summary</div>

              <div className="svbc__summary-row">
                <span className="svbc__summary-label">Subtotal</span>
                <span className="svbc__summary-val">${subtotal.toFixed(2)}</span>
              </div>

              <div className="svbc__summary-row">
                <span className="svbc__summary-label">Shipping</span>
                {shipping === 0
                  ? <span className="svbc__summary-free">Free</span>
                  : <span className="svbc__summary-val">${shipping.toFixed(2)}</span>
                }
              </div>

              <div className="svbc__summary-row">
                <span className="svbc__summary-label">Estimated Tax</span>
                <span className="svbc__summary-val">${tax.toFixed(2)}</span>
              </div>

              <div className="svbc__summary-divider" />

              <div className="svbc__summary-total">
                <span className="svbc__total-label">Total</span>
                <span className="svbc__total-val">${total.toFixed(2)}</span>
              </div>

              <button
                className="svbc__checkout-btn"
                onClick={() => fire("Redirecting to checkout...")}
              >
                Proceed to Checkout
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>

              {/* Trust badges */}
              <div className="svbc__trust-list">
                <div className="svbc__trust-item">
                  <div className="svbc__trust-icon svbc__trust-icon--green">🔒</div>
                  Secure SSL encrypted payment
                </div>
                <div className="svbc__trust-item">
                  <div className="svbc__trust-icon svbc__trust-icon--blue">🚚</div>
                  Delivery expected within 2-3 business days
                </div>
              </div>

              {/* Payment methods */}
              <div className="svbc__pay-label">We accept</div>
              <div className="svbc__pay-methods">
                {["VISA", "MC", "AMEX", "GPay"].map(m => (
                  <div key={m} className="svbc__pay-chip">{m}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Frequently Bought Together */}
          <div className="svbc__fbt-section">
            <div className="svbc__fbt-title">Frequently bought together</div>
            <div className="svbc__fbt-grid">
              {FBT_ITEMS.map(item => (
                <div key={item.id} className="svbc__fbt-card">
                  <div className="svbc__fbt-img">{item.emoji}</div>
                  <div className="svbc__fbt-body">
                    <div className="svbc__fbt-name">{item.name}</div>
                    <div className="svbc__fbt-price">{item.price}</div>
                    <button
                      className={`svbc__fbt-add-btn ${fbtAdded[item.id] ? "svbc__fbt-added" : ""}`}
                      onClick={() => addFbt(item)}
                    >
                      {fbtAdded[item.id] ? "✓ Added!" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  );
};

export default BuyerCart;