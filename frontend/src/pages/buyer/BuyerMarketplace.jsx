import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/buyer-css/buyermarketplace.css";

/* ── Data ─────────────────────────────────────────── */
const ALL_PRODUCTS = [
  { id:1,  name:"Organic Roma Tomatoes", rating:4.8, reviews:124, price:4.50, unit:"kg",     emoji:"🍅", badge:"organic",  sale:null,          category:"Vegetables" },
  { id:2,  name:"Fresh Baby Spinach",    rating:4.9, reviews:89,  price:3.20, unit:"bunch",  emoji:"🥬", badge:null,       sale:null,          category:"Vegetables" },
  { id:3,  name:"Honeycrisp Apples",     rating:4.7, reviews:210, price:2.80, unit:"kg",     emoji:"🍎", badge:null,       sale:null,          category:"Fruits"     },
  { id:4,  name:"Heritage Carrots",      rating:4.5, reviews:56,  price:1.75, unit:"kg",     emoji:"🥕", badge:null,       sale:{ old:2.20 },  category:"Vegetables" },
  { id:5,  name:"White Cauliflower",     rating:4.6, reviews:32,  price:3.50, unit:"head",   emoji:"🥦", badge:null,       sale:null,          category:"Vegetables" },
  { id:6,  name:"Rainbow Bell Peppers",  rating:4.8, reviews:156, price:5.00, unit:"3-pack", emoji:"🫑", badge:"organic",  sale:null,          category:"Organic"    },
  { id:7,  name:"Golden Pineapples",     rating:4.4, reviews:42,  price:4.20, unit:"unit",   emoji:"🍍", badge:"imported", sale:null,          category:"Fruits"     },
  { id:8,  name:"Organic Curly Kale",    rating:4.8, reviews:77,  price:2.50, unit:"bunch",  emoji:"🥗", badge:null,       sale:null,          category:"Organic"    },
  { id:9,  name:"Sweet Corn Cobs",       rating:4.6, reviews:98,  price:1.80, unit:"pair",   emoji:"🌽", badge:null,       sale:null,          category:"Vegetables" },
  { id:10, name:"Organic Blueberries",   rating:4.9, reviews:203, price:6.50, unit:"punnet", emoji:"🫐", badge:"organic",  sale:null,          category:"Organic"    },
  { id:11, name:"Red Onions",            rating:4.3, reviews:145, price:1.20, unit:"kg",     emoji:"🧅", badge:null,       sale:{ old:1.80 },  category:"Vegetables" },
  { id:12, name:"Fuji Mangoes",          rating:4.7, reviews:88,  price:3.90, unit:"kg",     emoji:"🥭", badge:"imported", sale:null,          category:"Fruits"     },
  { id:13, name:"Baby Cucumbers",        rating:4.5, reviews:61,  price:2.40, unit:"pack",   emoji:"🥒", badge:null,       sale:null,          category:"Vegetables" },
  { id:14, name:"Cherry Tomatoes",       rating:4.8, reviews:178, price:4.00, unit:"punnet", emoji:"🍒", badge:"organic",  sale:null,          category:"Organic"    },
  { id:15, name:"Butternut Squash",      rating:4.4, reviews:39,  price:2.90, unit:"unit",   emoji:"🎃", badge:null,       sale:null,          category:"Vegetables" },
  { id:16, name:"Dragon Fruit",          rating:4.6, reviews:55,  price:5.50, unit:"unit",   emoji:"🍓", badge:"imported", sale:{ old:7.00 },  category:"Fruits"     },
];

const CATEGORIES   = ["All Produce", "Vegetables", "Fruits", "Organic", "Bulk Deals"];
const SORT_OPTIONS = ["Newest First", "Price: Low to High", "Price: High to Low", "Top Rated", "Most Reviewed"];
const PER_PAGE     = 8;
const TOTAL_PAGES  = 12;

const NAV_ITEMS = [
  { label: "Dashboard",    path: "/buyer/dashboard" },
  { label: "Marketplace",  path: "/buyer/marketplace" },
  { label: "Cart",         path: "/buyer/cart", badge: 3 },
  { label: "My Orders",    path: "/buyer/orders" },
  { label: "Bulk Order",   path: "/buyer/bulk-order" },
  { label: "Profile",      path: "/buyer/profile" },
];

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

/* ── Nav icon helper ───────────────────────────────── */
const NavIcon = ({ label }) => {
  if (label === "Dashboard")    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
  if (label === "Marketplace")  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
  if (label === "Cart")         return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>;
  if (label === "My Orders")    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
  if (label === "Bulk Order")   return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>;
  if (label === "Profile")      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
  return null;
};

/* ── Main Component ────────────────────────────────── */
const BuyerMarketplace = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab,  setActiveTab]  = useState("All Produce");
  const [sort,       setSort]       = useState("Newest First");
  const [search,     setSearch]     = useState("");
  const [page,       setPage]       = useState(1);
  const [liked,      setLiked]      = useState({ 2: true });
  const [added,      setAdded]      = useState({});
  const [toast,      setToast]      = useState(null);
  const [cartCount,  setCartCount]  = useState(3);

  const fire = (msg) => setToast(msg);

  /* Filter + sort + search */
  const filtered = useMemo(() => {
    let list = ALL_PRODUCTS;
    if (activeTab !== "All Produce" && activeTab !== "Bulk Deals")
      list = list.filter(p => p.category === activeTab);
    if (search.trim())
      list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (sort === "Price: Low to High")  list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "Price: High to Low")  list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "Top Rated")           list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "Most Reviewed")       list = [...list].sort((a, b) => b.reviews - a.reviews);
    return list;
  }, [activeTab, sort, search]);

  const pageData  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalP    = Math.max(1, Math.ceil(filtered.length / PER_PAGE));

  const toggleLike = (id) => setLiked(prev => ({ ...prev, [id]: !prev[id] }));

  const addToCart = (p) => {
    if (added[p.id]) return;
    setAdded(prev => ({ ...prev, [p.id]: true }));
    setCartCount(c => c + 1);
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
              {item.badge && <span className="svbm__nav-badge">{item.badge}</span>}
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

          {/* Product grid */}
          <div className="svbm__grid">
            {pageData.map(p => (
              <div key={p.id} className="svbm__card">
                <div className="svbm__card-img">
                  {p.emoji}
                  {p.sale && (
                    <span className="svbm__sale-tag">
                      SALE -{Math.round((1 - p.price / p.sale.old) * 100)}%
                    </span>
                  )}
                  <button className="svbm__wish-btn" onClick={() => toggleLike(p.id)}>
                    {liked[p.id] ? "❤️" : "🤍"}
                  </button>
                  {p.badge && (
                    <span className={`svbm__badge svbm__badge--${p.badge}`}>{p.badge}</span>
                  )}
                </div>

                <div className="svbm__card-body">
                  <div className="svbm__card-name">{p.name}</div>
                  <div className="svbm__card-rating">
                    <span className="svbm__star">★</span>
                    {p.rating} ({p.reviews} reviews)
                  </div>
                  <div className="svbm__card-footer">
                    <div className="svbm__price-block">
                      {p.sale && <div className="svbm__price-old">${p.sale.old.toFixed(2)}</div>}
                      <div className="svbm__price-main">
                        <span className="svbm__price-val">${p.price.toFixed(2)}</span>
                        <span className="svbm__price-unit">/ {p.unit}</span>
                      </div>
                    </div>
                    <button
                      className={`svbm__add-btn ${added[p.id] ? "svbm__added" : ""}`}
                      onClick={() => addToCart(p)}
                    >
                      {added[p.id]
                        ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
                      }
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
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

            {[1, 2, 3].map(n => (
              <button
                key={n}
                className={`svbm__page-num ${page === n ? "svbm__page-active" : ""}`}
                onClick={() => setPage(n)}
              >{n}</button>
            ))}

            <span className="svbm__page-dots">...</span>

            <button
              className={`svbm__page-num ${page === TOTAL_PAGES ? "svbm__page-active" : ""}`}
              onClick={() => setPage(TOTAL_PAGES)}
            >{TOTAL_PAGES}</button>

            <button
              className="svbm__page-arrow"
              disabled={page >= TOTAL_PAGES}
              onClick={() => setPage(p => Math.min(TOTAL_PAGES, p + 1))}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

        </main>
      </div>

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  );
};

export default BuyerMarketplace;