import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/buyer-css/buyermarketplace.css";

const CATEGORIES   = ["All Produce", "Vegetables", "Fruits", "Organic", "Bulk Deals"];
const SORT_OPTIONS = ["Newest First", "Price: Low to High", "Price: High to Low", "Top Rated", "Most Reviewed"];
const PER_PAGE     = 8;

const NAV_ITEMS = [
  { label: "Dashboard",   path: "/buyer/dashboard" },
  { label: "Marketplace", path: "/buyer/marketplace" },
  { label: "Cart",        path: "/buyer/cart" },
  { label: "My Orders",   path: "/buyer/orders" },
  { label: "Bulk Order",  path: "/buyer/bulk-order" },
  { label: "Profile",     path: "/buyer/profile" },
];

/* ── Map crop category ────────────────────────────── */
const mapCropCategory = (cropCategory) => {
  if (!cropCategory) return "Vegetables";
  const c = cropCategory.toLowerCase();
  if (c.includes("fruit")) return "Fruits";
  if (c.includes("organic")) return "Organic";
  return "Vegetables";
};

/* ── Convert a farmer crop to a product shape ─────── */
const cropToProduct = (crop) => ({
  id:         `crop_${crop.id}`,
  name:       crop.name,
  rating:     4.5,
  reviews:    0,
  price:      parseFloat(crop.price) || 0,
  unit:       crop.quantity || "unit",
  emoji:      crop.emoji || "🌿",
  badge:      "farmer",
  sale:       null,
  category:   mapCropCategory(crop.category),
  fromFarmer: true,
  cropDetail: {
    variety:  crop.variety  || "—",
    field:    crop.field    || "—",
    planted:  crop.planted  || "—",
    harvest:  crop.harvest  || "—",
    progress: crop.progress ?? 0,
    status:   crop.status   || "—",
    quantity: crop.quantity || "—",
  },
});

/* ── Read crops from localStorage ────────────────── */
const readFarmerCrops = () => {
  try {
    const saved = localStorage.getItem("sv_crops");
    if (!saved) return [];
    return JSON.parse(saved).map(cropToProduct);
  } catch { return []; }
};

/* ── Cart localStorage helpers ───────────────────── */
const readCart = () => {
  try { return JSON.parse(localStorage.getItem("sv_cart") || "[]"); } catch { return []; }
};
const saveCart = (items) => {
  try { localStorage.setItem("sv_cart", JSON.stringify(items)); } catch {}
};
const pushToCart = (p) => {
  const cart = readCart();
  const existing = cart.find(i => i.id === p.id);
  // Extract numeric value from quantity string e.g. "120 kg" → 120, "45 kg" → 45
  const numericQty = parseFloat((p.cropDetail.quantity || "1").replace(/[^0-9.]/g, "")) || 1;
  const unitLabel  = (p.cropDetail.quantity || "unit").replace(/[0-9.]+\s*/g, "").trim() || "kg";
  if (existing) {
    // Always refresh unitQty/unitLabel in case stale cart item is missing them
    existing.qty      += 1;
    existing.unitQty   = numericQty;
    existing.unitLabel = unitLabel;
    existing.price     = p.price;
  } else {
    cart.push({
      id:        p.id,
      name:      p.name,
      desc:      `Fresh from farm · ${p.cropDetail.quantity}`,
      price:     p.price,       // price per kg
      unitQty:   numericQty,    // numeric qty e.g. 80
      unitLabel: unitLabel,     // unit label e.g. "kg"
      unit:      p.cropDetail.quantity,
      emoji:     p.emoji,
      qty:       1,
    });
  }
  saveCart(cart);
};

/* ── Toast ─────────────────────────────────────────── */
const Toast = ({ msg, onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 2000); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="svbm__toast">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      {msg}
    </div>
  );
};

/* ── Crop Detail Modal ─────────────────────────────── */
const CropDetailModal = ({ crop, onClose }) => {
  const d = crop.cropDetail;
  return (
    <div className="svbm__modal-overlay" onClick={onClose}>
      <div className="svbm__modal" onClick={e => e.stopPropagation()}>

        <div className="svbm__modal-header">
          <div className="svbm__modal-hero">
            <span className="svbm__modal-emoji">{crop.emoji}</span>
            <div>
              <div className="svbm__modal-name">{crop.name}</div>
              <div className="svbm__modal-variety">{d.variety}</div>
            </div>
          </div>
          <button className="svbm__modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="svbm__modal-grid">
          <div className="svbm__modal-cell">
            <div className="svbm__modal-cell-label">Field</div>
            <div className="svbm__modal-cell-value">{d.field}</div>
          </div>
          <div className="svbm__modal-cell">
            <div className="svbm__modal-cell-label">Quantity</div>
            <div className="svbm__modal-cell-value">{d.quantity}</div>
          </div>
          <div className="svbm__modal-cell">
            <div className="svbm__modal-cell-label">Price per unit</div>
            <div className="svbm__modal-cell-value">
              {crop.price > 0 ? `₹${crop.price.toFixed(2)}` : "—"}
            </div>
          </div>
          <div className="svbm__modal-cell">
            <div className="svbm__modal-cell-label">Planted</div>
            <div className="svbm__modal-cell-value">{d.planted}</div>
          </div>
          <div className="svbm__modal-cell">
            <div className="svbm__modal-cell-label">Harvest</div>
            <div className="svbm__modal-cell-value">{d.harvest}</div>
          </div>
          <div className="svbm__modal-cell svbm__modal-cell--full">
            <div className="svbm__modal-cell-label">Status</div>
            <span className={`svbm__crop-status-pill svbm__crop-status-pill--${d.status}`}>
              {d.status.charAt(0).toUpperCase() + d.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="svbm__modal-progress">
          <div className="svbm__modal-progress-header">
            <span className="svbm__modal-cell-label">Growth Progress</span>
            <span className="svbm__modal-progress-pct">{d.progress}%</span>
          </div>
          <div className="svbm__crop-detail-track">
            <div className="svbm__crop-detail-fill" style={{ width: `${d.progress}%` }} />
          </div>
        </div>

        <button className="svbm__modal-close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

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

/* ── Main Component ────────────────────────────────── */
const BuyerMarketplace = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab,   setActiveTab]   = useState("All Produce");
  const [sort,        setSort]        = useState("Newest First");
  const [search,      setSearch]      = useState("");
  const [page,        setPage]        = useState(1);
  const [liked,       setLiked]       = useState({});
  const [added,       setAdded]       = useState({});
  const [toast,       setToast]       = useState(null);
  const [cartCount,   setCartCount]   = useState(() => readCart().reduce((s, i) => s + i.qty, 0));
  const [farmerCrops, setFarmerCrops] = useState(readFarmerCrops);
  const [detailCrop,  setDetailCrop]  = useState(null);

  /* Sync when MyCrops page saves */
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "sv_crops") setFarmerCrops(readFarmerCrops());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const fire = (msg) => setToast(msg);

  /* Filter + sort + search — farmer crops only */
  const filtered = useMemo(() => {
    let list = [...farmerCrops];
    if (activeTab !== "All Produce" && activeTab !== "Bulk Deals")
      list = list.filter(p => p.category === activeTab);
    if (search.trim())
      list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (sort === "Price: Low to High")  list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "Price: High to Low")  list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "Top Rated")           list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "Most Reviewed")       list = [...list].sort((a, b) => b.reviews - a.reviews);
    return list;
  }, [farmerCrops, activeTab, sort, search]);

  const totalP   = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageData = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleLike = (id) => setLiked(prev => ({ ...prev, [id]: !prev[id] }));

  const addToCart = (p) => {
    if (added[p.id]) return;
    pushToCart(p);
    setAdded(prev => ({ ...prev, [p.id]: true }));
    setCartCount(readCart().reduce((s, i) => s + i.qty, 0));
    fire(`${p.name} added to cart!`);
    setTimeout(() => setAdded(prev => ({ ...prev, [p.id]: false })), 2000);
  };

  return (
    <div className="svbm__layout">

      {/* ════ SIDEBAR ════ */}
      <aside className="svbm__sidebar">
        <div className="svbm__brand" onClick={() => navigate("/buyer/dashboard")}>
          <div className="svbm__brand-logo">🌿</div>
          <span className="svbm__brand-name">SmartVegies</span>
        </div>

        <nav className="svbm__nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.label}
              className={`svbm__nav-btn ${location.pathname === item.path ? "svbm__active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span className="svbm__nav-icon"><NavIcon label={item.label} /></span>
              <span className="svbm__nav-label">{item.label}</span>
              {item.label === "Cart" && cartCount > 0
                ? <span className="svbm__nav-badge">{cartCount}</span>
                : item.badge && <span className="svbm__nav-badge">{item.badge}</span>
              }
            </button>
          ))}
        </nav>

        <div className="svbm__spacer" />

        <div className="svbm__wallet">
          <div className="svbm__wallet-lbl">Current Balance</div>
          <div className="svbm__wallet-amt">$142.50</div>
          <button className="svbm__wallet-btn" onClick={() => fire("Top Up opened!")}>
            Top Up Wallet
          </button>
        </div>
      </aside>

      {/* ════ MAIN ════ */}
      <div className="svbm__main">

        {/* Topbar */}
        <header className="svbm__topbar">
          <div className="svbm__topbar-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Marketplace
          </div>

          <div className="svbm__search-wrap">
            <span className="svbm__search-ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              className="svbm__search"
              placeholder="Search fresh produce..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          <div className="svbm__topbar-right">
            <button className="svbm__cart-btn-top" onClick={() => navigate("/buyer/cart")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="19" height="19">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
              </svg>
              <span className="svbm__cart-badge">{cartCount}</span>
            </button>

            <button className="svbm__notif-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="19" height="19">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
            </button>
          </div>
        </header>

        <main className="svbm__content">

          {/* Filter bar */}
          <div className="svbm__filter-bar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`svbm__filter-tab ${activeTab === cat ? "svbm__tab-active" : ""}`}
                onClick={() => { setActiveTab(cat); setPage(1); }}
              >
                {cat === "Vegetables" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
                {cat === "Fruits"     && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="14" r="8"/><path d="M12 6V2M9 2h6"/></svg>}
                {cat === "Organic"    && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
                {cat === "Bulk Deals" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>}
                {cat}
              </button>
            ))}

            <div className="svbm__sort-wrap">
              <span className="svbm__sort-label">Sort by:</span>
              <select
                className="svbm__sort-select"
                value={sort}
                onChange={e => setSort(e.target.value)}
              >
                {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>

          {/* Empty state */}
          {pageData.length === 0 && (
            <div className="svbm__empty">
              <div className="svbm__empty-icon">🌾</div>
              <div className="svbm__empty-title">No crops found</div>
              <div className="svbm__empty-sub">Add crops from the My Crops page to see them here.</div>
            </div>
          )}

          {/* Product grid */}
          {pageData.length > 0 && (
            <div className="svbm__grid">
              {pageData.map(p => (
                <div key={p.id} className="svbm__card">
                  <div className="svbm__card-img">
                    {p.emoji}
                    <button className="svbm__wish-btn" onClick={() => toggleLike(p.id)}>
                      {liked[p.id] ? "❤️" : "🤍"}
                    </button>
                    <span className="svbm__badge svbm__badge--farmer">farmer</span>
                  </div>

                  <div className="svbm__card-body">
                    <div className="svbm__card-name">{p.name}</div>

                    <div className="svbm__card-rating">
                      <span className="svbm__star">★</span>
                      <span className="svbm__farmer-tag">Fresh from farm</span>
                    </div>

                    <div className="svbm__card-footer">
                      <div className="svbm__price-block">
                        <div className="svbm__price-main">
                          <span className="svbm__price-val">
                            {p.price > 0 ? `₹${p.price.toFixed(2)}` : "—"}
                          </span>
                          <span className="svbm__price-unit">/ kg · {p.cropDetail.quantity}</span>
                        </div>
                      </div>
                    </div>

                    <div className="svbm__crop-detail-wrap">
                      <button
                        className={`svbm__add-btn svbm__add-btn--full ${added[p.id] ? "svbm__added" : ""}`}
                        onClick={() => addToCart(p)}
                      >
                        {added[p.id] ? (
                          <>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg>
                            Added to Cart
                          </>
                        ) : (
                          <>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
                            Add to Cart
                          </>
                        )}
                      </button>
                      <button
                        className="svbm__crop-detail-toggle"
                        onClick={() => setDetailCrop(p)}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalP > 1 && (
            <div className="svbm__pagination">
              <button
                className="svbm__page-arrow"
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              {Array.from({ length: Math.min(totalP, 3) }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  className={`svbm__page-num ${page === n ? "svbm__page-active" : ""}`}
                  onClick={() => setPage(n)}
                >{n}</button>
              ))}

              {totalP > 4 && <span className="svbm__page-dots">...</span>}

              {totalP > 3 && (
                <button
                  className={`svbm__page-num ${page === totalP ? "svbm__page-active" : ""}`}
                  onClick={() => setPage(totalP)}
                >{totalP}</button>
              )}

              <button
                className="svbm__page-arrow"
                disabled={page >= totalP}
                onClick={() => setPage(p => Math.min(totalP, p + 1))}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          )}

        </main>
      </div>

      {/* Crop Detail Modal */}
      {detailCrop && (
        <CropDetailModal crop={detailCrop} onClose={() => setDetailCrop(null)} />
      )}

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  );
};

export default BuyerMarketplace;