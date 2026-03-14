import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/buyer-css/buyerbulkorder.css";

// ─── Icons ────────────────────────────────────────────────────────────────────
const Svg = ({ children, size = 20, stroke = "currentColor", fill = "none", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
    strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={style}>
    {children}
  </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard",    path: "/buyer/dashboard",   label: "Dashboard" },
  { id: "marketplace",  path: "/buyer/marketplace", label: "Marketplace" },
  { id: "cart",         path: "/buyer/cart",         label: "Cart", badge: 3 },
  { id: "myorders",     path: "/buyer/myorders",     label: "My Orders" },
  { id: "bulk",         path: "/buyer/bulk-order",   label: "Bulk Order" },
  { id: "profile",      path: "/buyer/profile",      label: "Profile" },
];

const NAV_ICONS = {
  dashboard:    <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
  marketplace:  <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
  cart:         <><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></>,
  myorders:     <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
  bulk:         <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></>,
  profile:      <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
};

const CATEGORIES = ["Fresh Vegetables","Fresh Fruits","Leafy Greens","Root Vegetables","Herbs & Spices","Organic Produce","Exotic Vegetables"];

const QUALITY = [
  { id:"premium",    title:"Premium Grade",    desc:"Retail-ready, perfect appearance." },
  { id:"standard",   title:"Standard Grade",   desc:"Good quality, industry standard."  },
  { id:"processing", title:"Processing Grade", desc:"For juicing or manufacturing."     },
];

const VENDORS = [
  { id:1, emoji:"🚜", name:"Valley Fresh Farms",  rating:"4.9", orders:"120 orders" },
  { id:2, emoji:"🌿", name:"Green Root Co-op",     rating:"4.8", orders:"85 orders"  },
  { id:3, emoji:"🥬", name:"Farm2Door Collective", rating:"4.7", orders:"200 orders" },
  { id:4, emoji:"🌽", name:"Sunrise Organics",     rating:"4.6", orders:"64 orders"  },
];

const STEPS = ["Product Details", "Quantity & Timeline", "Review Request"];

// ─── Component ────────────────────────────────────────────────────────────────
export default function BuyerBulkOrder() {
  const navigate = useNavigate();
  const [step,      setStep]      = useState(0);
  const [category,  setCategory]  = useState("");
  const [variety,   setVariety]   = useState("");
  const [quality,   setQuality]   = useState("premium");
  const [notes,     setNotes]     = useState("");
  const [qty,          setQty]          = useState(100);
  const [unit,         setUnit]         = useState("kg");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate,   setEndDate]   = useState("");
  const [frequency, setFrequency] = useState("weekly");
  const [vendor,    setVendor]    = useState(1);
  const [street,    setStreet]    = useState("");
  const [city,      setCity]      = useState("");
  const [pin,       setPin]       = useState("");
  const [search,    setSearch]    = useState("");
  const [toast,     setToast]     = useState(false);

  const canNext = () => {
    if (step === 0) return category !== "";
    if (step === 1) return qty > 0 && startDate !== "";
    return true;
  };

  const handleSubmit = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    const orderId = "#BLK-" + Math.floor(10000 + Math.random() * 90000);

    // Shape for sv_orders (Dashboard + MyOrders)
    const orderEntry = {
      id:           orderId,
      name:         `Bulk: ${variety || category}`,
      emoji:        "📦",
      date:         dateStr,
      deliveryDate: startDate || "—",
      status:       "processing",
      items:        1,
      price:        total,
      address:      street ? `${street}, ${city} ${pin}`.trim() : "—",
      trackStep:    1,
      products: [
        {
          emoji: "📦",
          name:  variety || category,
          qty:   `${qty} ${unit}`,
          price: priceNum,
        },
      ],
    };

    // Shape for sv_bulk_requests (BulkRequests farmer page)
    const bulkEntry = {
      id:            Date.now(),
      requester:     "You (Buyer)",
      type:          "buyer",
      typeLabel:     "Buyer",
      product:       variety || category,
      emoji:         "📦",
      grade:         selQuality?.title || "—",
      quantity:      `${qty} ${unit}`,
      price:         priceNum > 0 ? `₹${priceNum.toFixed(2)}/${unit}` : "—",
      frequency:     frequency.charAt(0).toUpperCase() + frequency.slice(1),
      logistics:     street ? `${street}, ${city}` : "—",
      deadline:      startDate || "—",
      deadlineUrgent: false,
      timeAgo:       "Requested just now",
      tab:           "pending",
      status:        "pending",
      orderId:       orderId,
      vendor:        VENDORS.find(v => v.id === vendor)?.name || "—",
    };

    // Save to sv_orders
    try {
      const existing = JSON.parse(localStorage.getItem("sv_orders") || "[]");
      localStorage.setItem("sv_orders", JSON.stringify([orderEntry, ...existing]));
    } catch {}

    // Save to sv_bulk_requests
    try {
      const existingBulk = JSON.parse(localStorage.getItem("sv_bulk_requests") || "[]");
      localStorage.setItem("sv_bulk_requests", JSON.stringify([bulkEntry, ...existingBulk]));
    } catch {}

    setToast(true);
    setTimeout(() => { setToast(false); navigate("/buyer/myorders"); }, 2500);
  };

  const selVendor  = VENDORS.find(v => v.id === vendor);
  const selQuality = QUALITY.find(q => q.id === quality);

  // ─── Fee calculations — mirrors cart: price(per unit) * qty ─────────────
  const priceNum      = parseFloat(pricePerUnit) || 0;
  const subtotal      = parseFloat((priceNum * qty).toFixed(2));
  const shipping      = subtotal >= 50 ? 0 : 29;
  const fuelSurcharge = parseFloat((subtotal * 0.015).toFixed(2));
  const handling      = 10;
  const commission    = parseFloat((subtotal * 0.02).toFixed(2));
  const tax           = parseFloat((subtotal * 0.05).toFixed(2));
  const total         = parseFloat((subtotal + shipping + fuelSurcharge + handling + commission + tax).toFixed(2));

  return (
    <div className="sv-bo__app">

      {/* Sidebar */}
      <aside className="sv-bo__sidebar">
        <div className="sv-bo__logo" onClick={() => navigate("/buyer/dashboard")}>
          <div className="sv-bo__logo-icon">
            <Svg size={20} stroke="#5bc424"><path d="M17 8C8 10 5.9 16.17 3.82 19.82A2 2 0 0 0 5.8 22.6C8 22 11 20 14 18c0 0 1.5 3.5 5 3.5 0-5-3-7-5-7 2-3 4-5 4-8.5 0-3-2.5-5-2.5-5S19 6 17 8z"/></Svg>
          </div>
          SmartVegies
        </div>
        <nav className="sv-bo__nav">
          {NAV.map(({ id, path, label, badge }) => (
            <button key={id}
              className={"sv-bo__nav-item" + (id === "bulk" ? " sv-bo__nav-item--active" : "")}
              onClick={() => navigate(path)}>
              <Svg size={20}>{NAV_ICONS[id]}</Svg>
              {label}
              {badge && <span className="sv-bo__nav-badge">{badge}</span>}
            </button>
          ))}
        </nav>
        <div className="sv-bo__wallet">
          <div className="sv-bo__wallet-label">Current Balance</div>
          <div className="sv-bo__wallet-amount">$142.50</div>
          <button className="sv-bo__wallet-btn">Top Up Wallet</button>
        </div>
      </aside>

      {/* Topbar */}
      <div className="sv-bo__topbar">
        <div className="sv-bo__topbar-left">
          <Svg size={22}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></Svg>
          Bulk Order Request
        </div>
        <div className="sv-bo__topbar-right">
          <div className="sv-bo__search-bar">
            <Svg size={16}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></Svg>
            <input placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="sv-bo__topbar-icon">
            <Svg size={18}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></Svg>
          </button>
          <div className="sv-bo__avatar" />
        </div>
      </div>

      {/* Main */}
      <main className="sv-bo__main">
        <div className="sv-bo__page-header">
          <h1 className="sv-bo__page-title">Create Bulk Order</h1>
          <p className="sv-bo__page-sub">Request large scale supplies of fresh produce directly from verified local farm networks.</p>
        </div>

        {/* Stepper */}
        <div className="sv-bo__stepper">
          {STEPS.map((label, i) => (
            <button key={label}
              className={"sv-bo__step" + (i === step ? " sv-bo__step--active" : i < step ? " sv-bo__step--done" : "")}
              onClick={() => i < step && setStep(i)}>
              <span className="sv-bo__step-num">
                {i < step ? <Svg size={12}><polyline points="20 6 9 17 4 12"/></Svg> : i + 1}
              </span>
              {label}
            </button>
          ))}
        </div>

        {/* ─── STEP 0: Product Details ─── */}
        {step === 0 && (
          <div className="sv-bo__step-panel">
            <div className="sv-bo__section">
              <div className="sv-bo__section-heading">What are you looking for?</div>
              <div className="sv-bo__form-grid">
                <div className="sv-bo__field">
                  <label className="sv-bo__label">Category</label>
                  <select className="sv-bo__select" value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="">Select produce category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="sv-bo__field">
                  <label className="sv-bo__label">Specific Variety</label>
                  <input className="sv-bo__input" placeholder="e.g. Hass Avocados, Granny Smith Apples"
                    value={variety} onChange={e => setVariety(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="sv-bo__section">
              <div className="sv-bo__section-heading">Quality Specifications</div>
              <div className="sv-bo__quality-grid">
                {QUALITY.map(q => (
                  <div key={q.id}
                    className={"sv-bo__quality-card" + (quality === q.id ? " sv-bo__quality-card--selected" : "")}
                    onClick={() => setQuality(q.id)}>
                    <div className="sv-bo__quality-title">{q.title}</div>
                    <div className="sv-bo__quality-desc">{q.desc}</div>
                    <div className="sv-bo__quality-check">
                      <Svg size={12}><polyline points="20 6 9 17 4 12"/></Svg>
                    </div>
                    {quality !== q.id && <div className="sv-bo__quality-radio" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="sv-bo__section">
              <div className="sv-bo__section-heading">Additional Requirements</div>
              <textarea className="sv-bo__textarea"
                placeholder="Mention specific certifications (Organic, Fair Trade), packaging requirements, or delivery notes..."
                value={notes} onChange={e => setNotes(e.target.value)} />
            </div>

            <div className="sv-bo__section">
              <div className="sv-bo__vendors-card">
                <div className="sv-bo__vendors-header">
                  <div className="sv-bo__vendors-title">
                    <Svg size={18}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></Svg>
                    Top Vendors for {category || "Fresh Greens"}
                  </div>
                  <button className="sv-bo__view-all">View All</button>
                </div>
                <div className="sv-bo__vendors-grid">
                  {VENDORS.map(v => (
                    <div key={v.id}
                      className={"sv-bo__vendor-card" + (vendor === v.id ? " sv-bo__vendor-card--selected" : "")}
                      onClick={() => setVendor(v.id)}>
                      <div className="sv-bo__vendor-avatar">{v.emoji}</div>
                      <div>
                        <div className="sv-bo__vendor-name">{v.name}</div>
                        <div className="sv-bo__vendor-rating">
                          <Svg size={13} fill="#f59e0b" stroke="#f59e0b"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></Svg>
                          {v.rating} ({v.orders})
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="sv-bo__form-footer">
              <span />
              <button className={"sv-bo__btn sv-bo__btn--primary" + (!canNext() ? " sv-bo__btn--disabled" : "")}
                disabled={!canNext()}
                onClick={() => canNext() && setStep(1)}>
                Next: Quantity & Timeline
                <Svg size={16}><polyline points="9 18 15 12 9 6"/></Svg>
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 1: Quantity & Timeline ─── */}
        {step === 1 && (
          <div className="sv-bo__step-panel">
            <div className="sv-bo__section">
              <div className="sv-bo__section-heading">Order Quantity</div>
              <div className="sv-bo__form-grid">

                {/* Quantity + unit stepper */}
                <div className="sv-bo__field">
                  <label className="sv-bo__label">Quantity</label>
                  <div className="sv-bo__qty-row">
                    <div className="sv-bo__qty-wrap">
                      <button className="sv-bo__qty-btn" onClick={() => setQty(q => Math.max(1, q - 10))}>−</button>
                      <div className="sv-bo__qty-val">{qty}</div>
                      <button className="sv-bo__qty-btn" onClick={() => setQty(q => q + 10)}>+</button>
                    </div>
                    <select className="sv-bo__unit-select" value={unit} onChange={e => setUnit(e.target.value)}>
                      <option value="kg">Kilograms (kg)</option>
                      <option value="tonnes">Tonnes</option>
                      <option value="boxes">Boxes</option>
                      <option value="crates">Crates</option>
                      <option value="lbs">Pounds (lbs)</option>
                    </select>
                  </div>
                </div>

                {/* Price per unit — live total updates as qty changes */}
                <div className="sv-bo__field">
                  <label className="sv-bo__label">Price per {unit}</label>
                  <div className="sv-bo__price-wrap">
                    <span className="sv-bo__price-prefix">₹</span>
                    <input
                      className="sv-bo__input sv-bo__input--price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="e.g. 45.00"
                      value={pricePerUnit}
                      onChange={e => setPricePerUnit(e.target.value)}
                    />
                  </div>
                  {/* Live price display — mirrors cart's item price + line total */}
                  {priceNum > 0 && (
                    <div className="sv-bo__price-preview">
                      <span className="sv-bo__price-preview-rate">
                        ₹{priceNum.toFixed(2)} / {unit}
                      </span>
                      <span className="sv-bo__price-preview-total">
                        ₹{(priceNum * qty).toFixed(2)}
                      </span>
                      <span className="sv-bo__price-preview-sub">
                        for {qty} {unit}
                      </span>
                    </div>
                  )}
                </div>

                {/* Delivery Frequency */}
                <div className="sv-bo__field">
                  <label className="sv-bo__label">Delivery Frequency</label>
                  <select className="sv-bo__select" value={frequency} onChange={e => setFrequency(e.target.value)}>
                    <option value="once">One-time delivery</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

              </div>
            </div>

            <div className="sv-bo__section">
              <div className="sv-bo__section-heading">Delivery Timeline</div>
              <div className="sv-bo__date-grid">
                <div className="sv-bo__field">
                  <label className="sv-bo__label">Start Date</label>
                  <input type="date" className="sv-bo__input" value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                <div className="sv-bo__field">
                  <label className="sv-bo__label">End Date (optional)</label>
                  <input type="date" className="sv-bo__input" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="sv-bo__section">
              <div className="sv-bo__section-heading">Delivery Address</div>
              <div className="sv-bo__form-grid">
                <div className="sv-bo__field sv-bo__field--full">
                  <label className="sv-bo__label">Street Address</label>
                  <input className="sv-bo__input" placeholder="Enter delivery address" value={street} onChange={e => setStreet(e.target.value)} />
                </div>
                <div className="sv-bo__field">
                  <label className="sv-bo__label">City</label>
                  <input className="sv-bo__input" placeholder="City" value={city} onChange={e => setCity(e.target.value)} />
                </div>
                <div className="sv-bo__field">
                  <label className="sv-bo__label">PIN Code</label>
                  <input className="sv-bo__input" placeholder="PIN / ZIP" value={pin} onChange={e => setPin(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="sv-bo__form-footer">
              <button className="sv-bo__btn sv-bo__btn--outline" onClick={() => setStep(0)}>
                <Svg size={16}><polyline points="15 18 9 12 15 6"/></Svg>
                Back
              </button>
              <button className={"sv-bo__btn sv-bo__btn--primary" + (!canNext() ? " sv-bo__btn--disabled" : "")}
                disabled={!canNext()}
                onClick={() => canNext() && setStep(2)}>
                Review Request
                <Svg size={16}><polyline points="9 18 15 12 9 6"/></Svg>
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 2: Review ─── */}
        {step === 2 && (
          <div className="sv-bo__step-panel">
            <div className="sv-bo__section">
              <div className="sv-bo__section-heading">Review Your Request</div>
              <div className="sv-bo__review-card">
                {[
                  ["Category",         category || "—"],
                  ["Specific Variety",  variety  || "—"],
                  ["Quality Grade",     selQuality?.title || "—"],
                  ["Frequency",        frequency.charAt(0).toUpperCase() + frequency.slice(1)],
                  ["Start Date",       startDate || "—"],
                  ["End Date",         endDate   || "—"],
                  ["Delivery Address", street ? `${street}, ${city} ${pin}`.trim() : "—"],
                  ["Preferred Vendor", selVendor?.name || "—"],
                  ["Special Notes",    notes || "—"],
                ].map(([k, v]) => (
                  <div key={k} className="sv-bo__review-row">
                    <span className="sv-bo__review-key">{k}</span>
                    <span className="sv-bo__review-val">{v}</span>
                  </div>
                ))}

                {/* Cart-style item price block */}
                <div className="sv-bo__review-item">
                  <div className="sv-bo__review-item-row">
                    <span className="sv-bo__review-key">Quantity</span>
                    <span className="sv-bo__review-val">{qty} {unit}</span>
                  </div>
                  <div className="sv-bo__review-item-row">
                    <span className="sv-bo__review-key">Price per {unit}</span>
                    <span className="sv-bo__review-item-price">
                      {priceNum > 0 ? `₹${priceNum.toFixed(2)} / ${unit}` : "—"}
                    </span>
                  </div>
                  {priceNum > 0 && (
                    <div className="sv-bo__review-item-total">
                      <span className="sv-bo__review-item-total-val">₹{(priceNum * qty).toFixed(2)}</span>
                      <span className="sv-bo__review-item-total-sub">for {qty} {unit}</span>
                    </div>
                  )}
                </div>

                <div className="sv-bo__review-charges">
                  <div className="sv-bo__review-charges-row">
                    <span className="sv-bo__review-charges-label">Subtotal</span>
                    <span className="sv-bo__review-charges-val">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="sv-bo__review-charges-row">
                    <span className="sv-bo__review-charges-label">Delivery Charges</span>
                    <span className={shipping === 0 ? "sv-bo__review-charges-free" : "sv-bo__review-charges-val"}>
                      {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="sv-bo__review-charges-row">
                    <span className="sv-bo__review-charges-label">Fuel Surcharge (1.5%)</span>
                    <span className="sv-bo__review-charges-val">₹{fuelSurcharge.toFixed(2)}</span>
                  </div>
                  <div className="sv-bo__review-charges-row">
                    <span className="sv-bo__review-charges-label">Handling & Packaging</span>
                    <span className="sv-bo__review-charges-val">₹{handling.toFixed(2)}</span>
                  </div>
                  <div className="sv-bo__review-charges-row">
                    <span className="sv-bo__review-charges-label">Platform Fee (2%)</span>
                    <span className="sv-bo__review-charges-val">₹{commission.toFixed(2)}</span>
                  </div>
                  <div className="sv-bo__review-charges-row">
                    <span className="sv-bo__review-charges-label">GST (5%)</span>
                    <span className="sv-bo__review-charges-val">₹{tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="sv-bo__review-total">
                  <span className="sv-bo__review-total-label">Estimated Total</span>
                  <span className="sv-bo__review-total-val">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="sv-bo__form-footer">
              <button className="sv-bo__btn sv-bo__btn--outline" onClick={() => setStep(1)}>
                <Svg size={16}><polyline points="15 18 9 12 15 6"/></Svg>
                Back
              </button>
              <button className="sv-bo__btn sv-bo__btn--submit" onClick={handleSubmit}>
                <Svg size={16}><polyline points="22 2 15 22 11 13 2 9 22 2"/></Svg>
                Submit Bulk Request
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Toast */}
      {toast && (
        <div className="sv-bo__toast">
          <Svg size={20}><polyline points="20 6 9 17 4 12"/></Svg>
          Bulk order submitted! Redirecting to My Orders…
        </div>
      )}
    </div>
  );
}