import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/buyer-css/BuyerCart.css";

/* ── Cart localStorage helpers ───────────────────── */
const readCart = () => {
  try { return JSON.parse(localStorage.getItem("sv_cart") || "[]"); } catch { return []; }
};
const saveCart = (items) => {
  try { localStorage.setItem("sv_cart", JSON.stringify(items)); } catch {}
};

/* ── Order localStorage helpers ─────────────────── */
const readOrders = () => {
  try { return JSON.parse(localStorage.getItem("sv_orders") || "[]"); } catch { return []; }
};
const saveOrders = (orders) => {
  try { localStorage.setItem("sv_orders", JSON.stringify(orders)); } catch {}
};

/* ── unitQty helper (module-level so CheckoutModal can use it) ── */
const getUnitQty = (i) =>
  parseFloat(i.unitQty) || parseFloat((i.unit || "1").replace(/[^0-9.]/g, "")) || 1;

const SHIPPING_THRESHOLD = 50;

/* ── Checkout Modal ────────────────────────────────── */
const PAYMENT_METHODS = [
  { id: "upi",  label: "UPI",                 icon: "📱" },
  { id: "card", label: "Credit / Debit Card", icon: "💳" },
  { id: "cod",  label: "Cash on Delivery",    icon: "💵" },
  { id: "nb",   label: "Net Banking",         icon: "🏦" },
];

const CheckoutModal = ({ cart, subtotal, shipping, fuelSurcharge, handling, commission, tax, total, onClose, onConfirm }) => {
  const [step, setStep] = useState(1);
  const [addr, setAddr] = useState({ name: "", phone: "", pincode: "", city: "", state: "", line: "" });
  const [payMethod, setPayMethod] = useState("upi");
  const [upiId,     setUpiId]     = useState("");
  const [cardNum,   setCardNum]   = useState("");
  const [cardName,  setCardName]  = useState("");
  const [cardExp,   setCardExp]   = useState("");
  const [cardCvv,   setCardCvv]   = useState("");
  const [errors,    setErrors]    = useState({});

  const handleAddr = (e) => setAddr(a => ({ ...a, [e.target.name]: e.target.value }));

  const validateAddr = () => {
    const e = {};
    if (!addr.name.trim())    e.name    = "Name is required";
    if (!addr.phone.trim() || !/^\d{10}$/.test(addr.phone)) e.phone = "Enter valid 10-digit phone";
    if (!addr.pincode.trim() || !/^\d{6}$/.test(addr.pincode)) e.pincode = "Enter valid 6-digit pincode";
    if (!addr.city.trim())    e.city    = "City is required";
    if (!addr.state.trim())   e.state   = "State is required";
    if (!addr.line.trim())    e.line    = "Address is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = () => {
    const e = {};
    if (payMethod === "upi" && !/^[\w.\-_]{2,}@[a-z]{2,}$/.test(upiId.trim()))
      e.upi = "Enter a valid UPI ID (e.g. name@upi)";
    if (payMethod === "card") {
      if (!/^\d{16}$/.test(cardNum.replace(/\s/g, ""))) e.cardNum  = "Enter valid 16-digit card number";
      if (!cardName.trim())                              e.cardName = "Name on card is required";
      if (!/^\d{2}\/\d{2}$/.test(cardExp))              e.cardExp  = "Format MM/YY";
      if (!/^\d{3,4}$/.test(cardCvv))                   e.cardCvv  = "Enter valid CVV";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && !validateAddr()) return;
    if (step === 2 && !validatePayment()) return;
    if (step === 3) { onConfirm(addr); return; }
    setStep(s => s + 1);
  };

  const STEPS = ["Delivery Address", "Payment", "Confirm Order"];

  return (
    <div className="svbc__co-overlay" onClick={onClose}>
      <div className="svbc__co-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="svbc__co-header">
          <span className="svbc__co-title">Checkout</span>
          <button className="svbc__co-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Step indicator */}
        <div className="svbc__co-steps">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`svbc__co-step ${step === i+1 ? "svbc__co-step--active" : step > i+1 ? "svbc__co-step--done" : ""}`}>
                <div className="svbc__co-step-dot">
                  {step > i+1
                    ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    : i+1}
                </div>
                <span className="svbc__co-step-label">{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`svbc__co-step-line ${step > i+1 ? "svbc__co-step-line--done" : ""}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1 — Delivery Address */}
        {step === 1 && (
          <div className="svbc__co-body">
            <div className="svbc__co-form-row">
              <div className="svbc__co-field">
                <label className="svbc__co-label">Full Name *</label>
                <input className={`svbc__co-input ${errors.name ? "svbc__co-input--err" : ""}`}
                  name="name" value={addr.name} placeholder="e.g. Rahul Sharma" onChange={handleAddr} />
                {errors.name && <span className="svbc__co-err">{errors.name}</span>}
              </div>
              <div className="svbc__co-field">
                <label className="svbc__co-label">Phone Number *</label>
                <input className={`svbc__co-input ${errors.phone ? "svbc__co-input--err" : ""}`}
                  name="phone" value={addr.phone} placeholder="10-digit number" onChange={handleAddr} maxLength={10} />
                {errors.phone && <span className="svbc__co-err">{errors.phone}</span>}
              </div>
            </div>
            <div className="svbc__co-field">
              <label className="svbc__co-label">Address Line *</label>
              <input className={`svbc__co-input ${errors.line ? "svbc__co-input--err" : ""}`}
                name="line" value={addr.line} placeholder="Flat, House no., Building, Street" onChange={handleAddr} />
              {errors.line && <span className="svbc__co-err">{errors.line}</span>}
            </div>
            <div className="svbc__co-form-row svbc__co-form-row--3">
              <div className="svbc__co-field">
                <label className="svbc__co-label">Pincode *</label>
                <input className={`svbc__co-input ${errors.pincode ? "svbc__co-input--err" : ""}`}
                  name="pincode" value={addr.pincode} placeholder="6-digit pincode" onChange={handleAddr} maxLength={6} />
                {errors.pincode && <span className="svbc__co-err">{errors.pincode}</span>}
              </div>
              <div className="svbc__co-field">
                <label className="svbc__co-label">City *</label>
                <input className={`svbc__co-input ${errors.city ? "svbc__co-input--err" : ""}`}
                  name="city" value={addr.city} placeholder="e.g. Mumbai" onChange={handleAddr} />
                {errors.city && <span className="svbc__co-err">{errors.city}</span>}
              </div>
              <div className="svbc__co-field">
                <label className="svbc__co-label">State *</label>
                <input className={`svbc__co-input ${errors.state ? "svbc__co-input--err" : ""}`}
                  name="state" value={addr.state} placeholder="e.g. Maharashtra" onChange={handleAddr} />
                {errors.state && <span className="svbc__co-err">{errors.state}</span>}
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — Payment */}
        {step === 2 && (
          <div className="svbc__co-body">
            <div className="svbc__co-pay-methods">
              {PAYMENT_METHODS.map(m => (
                <button
                  key={m.id}
                  className={`svbc__co-pay-opt ${payMethod === m.id ? "svbc__co-pay-opt--active" : ""}`}
                  onClick={() => { setPayMethod(m.id); setErrors({}); }}
                >
                  <span className="svbc__co-pay-icon">{m.icon}</span>
                  <span className="svbc__co-pay-label">{m.label}</span>
                </button>
              ))}
            </div>

            {payMethod === "upi" && (
              <div className="svbc__co-field">
                <label className="svbc__co-label">UPI ID *</label>
                <input className={`svbc__co-input ${errors.upi ? "svbc__co-input--err" : ""}`}
                  value={upiId} placeholder="yourname@upi" onChange={e => setUpiId(e.target.value)} />
                {errors.upi && <span className="svbc__co-err">{errors.upi}</span>}
              </div>
            )}

            {payMethod === "card" && (
              <>
                <div className="svbc__co-field">
                  <label className="svbc__co-label">Card Number *</label>
                  <input className={`svbc__co-input ${errors.cardNum ? "svbc__co-input--err" : ""}`}
                    value={cardNum} placeholder="1234 5678 9012 3456" maxLength={19}
                    onChange={e => setCardNum(e.target.value.replace(/[^\d\s]/g,""))} />
                  {errors.cardNum && <span className="svbc__co-err">{errors.cardNum}</span>}
                </div>
                <div className="svbc__co-field">
                  <label className="svbc__co-label">Name on Card *</label>
                  <input className={`svbc__co-input ${errors.cardName ? "svbc__co-input--err" : ""}`}
                    value={cardName} placeholder="As printed on card"
                    onChange={e => setCardName(e.target.value)} />
                  {errors.cardName && <span className="svbc__co-err">{errors.cardName}</span>}
                </div>
                <div className="svbc__co-form-row">
                  <div className="svbc__co-field">
                    <label className="svbc__co-label">Expiry *</label>
                    <input className={`svbc__co-input ${errors.cardExp ? "svbc__co-input--err" : ""}`}
                      value={cardExp} placeholder="MM/YY" maxLength={5}
                      onChange={e => {
                        let v = e.target.value.replace(/[^\d]/g,"");
                        if (v.length > 2) v = v.slice(0,2) + "/" + v.slice(2,4);
                        setCardExp(v);
                      }} />
                    {errors.cardExp && <span className="svbc__co-err">{errors.cardExp}</span>}
                  </div>
                  <div className="svbc__co-field">
                    <label className="svbc__co-label">CVV *</label>
                    <input className={`svbc__co-input ${errors.cardCvv ? "svbc__co-input--err" : ""}`}
                      value={cardCvv} placeholder="3 or 4 digits" maxLength={4} type="password"
                      onChange={e => setCardCvv(e.target.value.replace(/\D/g,""))} />
                    {errors.cardCvv && <span className="svbc__co-err">{errors.cardCvv}</span>}
                  </div>
                </div>
              </>
            )}

            {payMethod === "cod" && (
              <div className="svbc__co-info-box">
                <span>💵</span>
                Pay in cash when your order is delivered. No prepayment needed.
              </div>
            )}

            {payMethod === "nb" && (
              <div className="svbc__co-info-box">
                <span>🏦</span>
                You will be redirected to your bank's portal to complete payment on placing the order.
              </div>
            )}
          </div>
        )}

        {/* Step 3 — Confirm */}
        {step === 3 && (
          <div className="svbc__co-body">
            <div className="svbc__co-confirm-section">
              <div className="svbc__co-confirm-label">Delivering to</div>
              <div className="svbc__co-confirm-value">{addr.name} · {addr.phone}</div>
              <div className="svbc__co-confirm-value svbc__co-confirm-value--sub">
                {addr.line}, {addr.city}, {addr.state} — {addr.pincode}
              </div>
            </div>
            <div className="svbc__co-confirm-section">
              <div className="svbc__co-confirm-label">Payment</div>
              <div className="svbc__co-confirm-value">
                {PAYMENT_METHODS.find(m => m.id === payMethod)?.icon}{" "}
                {PAYMENT_METHODS.find(m => m.id === payMethod)?.label}
                {payMethod === "upi" && upiId && <span className="svbc__co-confirm-value--sub"> · {upiId}</span>}
              </div>
            </div>
            <div className="svbc__co-confirm-section">
              <div className="svbc__co-confirm-label">Order Items ({cart.length})</div>
              {cart.map(i => (
                <div key={i.id} className="svbc__co-confirm-item">
                  <span>{i.emoji} {i.name}</span>
                  <span>×{i.qty} batch{i.qty>1?"es":""} — ₹{((parseFloat(i.price)||0) * getUnitQty(i) * (parseInt(i.qty)||1)).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="svbc__co-confirm-totals">
              <div className="svbc__co-confirm-row"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
              <div className="svbc__co-confirm-row"><span>Delivery Charges</span><span>{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span></div>
              <div className="svbc__co-confirm-row"><span>Fuel Surcharge (1.5%)</span><span>₹{fuelSurcharge.toFixed(2)}</span></div>
              <div className="svbc__co-confirm-row"><span>Handling & Packaging</span><span>₹{handling.toFixed(2)}</span></div>
              <div className="svbc__co-confirm-row svbc__co-confirm-row--platform"><span>Platform Fee (2%)</span><span>₹{commission.toFixed(2)}</span></div>
              <div className="svbc__co-confirm-row"><span>GST (5%)</span><span>₹{tax.toFixed(2)}</span></div>
              <div className="svbc__co-confirm-row svbc__co-confirm-row--total"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="svbc__co-footer">
          {step > 1 && (
            <button className="svbc__co-back-btn" onClick={() => { setErrors({}); setStep(s => s - 1); }}>
              ← Back
            </button>
          )}
          <button className="svbc__co-next-btn" onClick={nextStep}>
            {step === 1 ? "Continue to Payment →"
             : step === 2 ? "Review Order →"
             : "Place Order ₹" + total.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Order Placed Modal ────────────────────────────── */
const OrderPlacedModal = ({ total, onClose }) => (
  <div className="svbc__co-overlay" onClick={onClose}>
    <div className="svbc__co-placed" onClick={e => e.stopPropagation()}>
      <div className="svbc__co-placed-icon">✅</div>
      <div className="svbc__co-placed-title">Order Placed!</div>
      <div className="svbc__co-placed-sub">
        Your order of ₹{total.toFixed(2)} has been placed successfully. You'll receive a confirmation shortly.
      </div>
      <button className="svbc__co-next-btn" onClick={onClose}>Continue Shopping</button>
    </div>
  </div>
);

const NAV_ITEMS = [
  { label: "Dashboard",   path: "/buyer/dashboard" },
  { label: "Marketplace", path: "/buyer/marketplace" },
  { label: "Cart",        path: "/buyer/cart" },
  { label: "My Orders",   path: "/buyer/orders" },
  { label: "Bulk Order",  path: "/buyer/bulk-order" },
  { label: "Profile",     path: "/buyer/profile" },
];

/* ── Nav icon helper ───────────────────────────────── */
const NavIcon = ({ label }) => {
  if (label === "Dashboard")   return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
  if (label === "Marketplace") return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
  if (label === "Cart")        return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>;
  if (label === "My Orders")   return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
  if (label === "Bulk Order")  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>;
  if (label === "Profile")     return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
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

  const [cart,         setCart]         = useState(() => readCart());
  const [toast,        setToast]        = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderPlaced,  setOrderPlaced]  = useState(false);
  const [orderTotal,   setOrderTotal]   = useState(0);

  /* Re-read on every mount */
  useEffect(() => { setCart(readCart()); }, []);

  /* Persist every cart change */
  useEffect(() => { saveCart(cart); }, [cart]);

  const fire = (msg) => setToast(msg);

  /* Computed totals */
  const subtotal      = useMemo(() => cart.reduce((s, i) => s + (parseFloat(i.price) || 0) * getUnitQty(i) * (parseInt(i.qty) || 1), 0), [cart]);
  const shipping      = subtotal >= SHIPPING_THRESHOLD ? 0 : 29;
  const fuelSurcharge = parseFloat((subtotal * 0.015).toFixed(2));
  const handling      = cart.length > 0 ? 10 : 0;
  const commission    = parseFloat((subtotal * 0.02).toFixed(2));
  const tax           = parseFloat((subtotal * 0.05).toFixed(2));
  const total         = parseFloat((subtotal + shipping + fuelSurcharge + handling + commission + tax).toFixed(2));

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

  /* ── Place order: build record → prepend to sv_orders ── */
  const handleConfirmOrder = (addr) => {
    const deliveryDateObj = new Date();
    deliveryDateObj.setDate(deliveryDateObj.getDate() + 3);
    const deliveryDateStr = deliveryDateObj.toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });

    const newOrder = {
      id: "#SV-" + Math.floor(10000 + Math.random() * 90000),
      name: cart.length === 1 ? cart[0].name : "Mixed Order",
      emoji: cart[0]?.emoji || "🛒",
      date: new Date().toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      }),
      deliveryDate: deliveryDateStr,
      status: "processing",
      items: cart.reduce((s, i) => s + i.qty, 0),
      price: total,
      address: addr
        ? `${addr.line}, ${addr.city}, ${addr.state} — ${addr.pincode}`
        : "—",
      products: cart.map(i => ({
        emoji: i.emoji || "🥦",
        name:  i.name,
        qty:   `${getUnitQty(i) * i.qty} ${i.unitLabel || "kg"}`,
        price: parseFloat(((parseFloat(i.price) || 0) * getUnitQty(i) * i.qty).toFixed(2)),
      })),
      trackStep: 1,
    };

    const existing = readOrders();
    saveOrders([newOrder, ...existing]);

    // Save farmer-shaped entry so Dashboard and Orders page can display it
    const farmerOrder = {
      id:       newOrder.id,
      customer: addr.name,
      initials: addr.name.trim().split(" ").filter(Boolean).map(w => w[0]).join("").slice(0, 2).toUpperCase(),
      date:     newOrder.date,
      total:    `₹${total.toFixed(2)}`,
      amount:   total,
      status:   "processing",
      items:    cart.map(i => i.name).join(", "),
    };
    try {
      const existingFarmer = JSON.parse(localStorage.getItem("sv_farmer_orders") || "[]");
      localStorage.setItem("sv_farmer_orders", JSON.stringify([farmerOrder, ...existingFarmer]));
      // Dispatch storage event so same-tab listeners (Dashboard/Orders) pick it up immediately
      window.dispatchEvent(new StorageEvent("storage", { key: "sv_farmer_orders" }));
    } catch {}

    setOrderTotal(total);
    setShowCheckout(false);
    setOrderPlaced(true);
    setCart([]);
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
          <div className="svbc__wallet-amt">₹142.50</div>
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
                      <div className="svbc__item-price">
                        {item.price > 0
                          ? `₹${(parseFloat(item.price)||0).toFixed(2)} / ${item.unitLabel || "unit"}`
                          : "Price on request"}
                      </div>
                      {item.price > 0 && (
                        <div className="svbc__item-line-total">
                          ₹{((parseFloat(item.price)||0) * getUnitQty(item) * (parseInt(item.qty)||1)).toFixed(2)}
                          <span className="svbc__item-line-qty">
                            {" "}for {getUnitQty(item) * (parseInt(item.qty)||1)} {item.unitLabel || "kg"} ({item.qty} {item.qty > 1 ? "batches" : "batch"})
                          </span>
                        </div>
                      )}
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
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
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
                <span className="svbc__summary-val">₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="svbc__summary-row">
                <span className="svbc__summary-label">Delivery Charges</span>
                {shipping === 0
                  ? <span className="svbc__summary-free">Free</span>
                  : <span className="svbc__summary-val">₹{shipping.toFixed(2)}</span>
                }
              </div>

              <div className="svbc__summary-row">
                <span className="svbc__summary-label">Fuel Surcharge <span className="svbc__summary-badge">1.5%</span></span>
                <span className="svbc__summary-val">₹{fuelSurcharge.toFixed(2)}</span>
              </div>

              <div className="svbc__summary-row">
                <span className="svbc__summary-label">Handling & Packaging</span>
                <span className="svbc__summary-val">₹{handling.toFixed(2)}</span>
              </div>

              <div className="svbc__summary-row svbc__summary-row--platform">
                <span className="svbc__summary-label">
                  Platform Fee <span className="svbc__summary-badge svbc__summary-badge--blue">2%</span>
                  <span className="svbc__summary-tooltip">SmartVegies commission on order value</span>
                </span>
                <span className="svbc__summary-val">₹{commission.toFixed(2)}</span>
              </div>

              <div className="svbc__summary-row">
                <span className="svbc__summary-label">GST <span className="svbc__summary-badge">5%</span></span>
                <span className="svbc__summary-val">₹{tax.toFixed(2)}</span>
              </div>

              <div className="svbc__summary-divider" />

              <div className="svbc__summary-total">
                <span className="svbc__total-label">Total</span>
                <span className="svbc__total-val">₹{total.toFixed(2)}</span>
              </div>

              <button
                className="svbc__checkout-btn"
                disabled={cart.length === 0}
                onClick={() => cart.length > 0 && setShowCheckout(true)}
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

        </main>
      </div>

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}

      {showCheckout && (
        <CheckoutModal
          cart={cart}
          subtotal={subtotal}
          shipping={shipping}
          fuelSurcharge={fuelSurcharge}
          handling={handling}
          commission={commission}
          tax={tax}
          total={total}
          onClose={() => setShowCheckout(false)}
          onConfirm={handleConfirmOrder}
        />
      )}

      {orderPlaced && (
        <OrderPlacedModal
          total={orderTotal}
          onClose={() => { setOrderPlaced(false); navigate("/buyer/marketplace"); }}
        />
      )}
    </div>
  );
};

export default BuyerCart;