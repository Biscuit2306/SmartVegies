import React, { useState, useMemo, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import "../../styles/farmer-css/BulkRequests.css";

// ── Static Data ───────────────────────────────────────────────
const INITIAL_REQUESTS = [
  {
    id: 1,
    requester: "The Green Bistro",
    type: "wholesaler",
    typeLabel: "Wholesaler",
    product: "Organic Roma Tomatoes",
    emoji: "🍅",
    grade: "Premium Grade",
    quantity: "500 kg",
    price: "$2.40/kg",
    frequency: "One-time",
    logistics: "Pickup Required",
    deadline: "Oct 25, 2023",
    deadlineUrgent: true,
    timeAgo: "Requested 2 hours ago",
    tab: "pending",
    status: "pending",
  },
  {
    id: 2,
    requester: "Urban Fresh Markets",
    type: "chain",
    typeLabel: "Chain Restaurant",
    product: "Nantes Coreless Carrots",
    emoji: "🥕",
    grade: "Grade A",
    quantity: "1,200 kg",
    price: "$1.85/kg",
    frequency: "Weekly",
    logistics: "Delivery Preferred",
    deadline: "Nov 02, 2023",
    deadlineUrgent: false,
    timeAgo: "Requested 5 hours ago",
    tab: "pending",
    status: "pending",
  },
  {
    id: 3,
    requester: "Harvest Moon Catering",
    type: "caterer",
    typeLabel: "Caterer",
    product: "Mixed Leafy Greens (Bulk)",
    emoji: "🥬",
    grade: "Organic",
    quantity: "250 kg",
    price: "$5.50/kg",
    frequency: "Bi-weekly",
    logistics: "Vendor Delivery",
    deadline: "Oct 30, 2023",
    deadlineUrgent: false,
    timeAgo: "Requested 1 day ago",
    tab: "pending",
    status: "pending",
  },
  {
    id: 4,
    requester: "Metro Retail Group",
    type: "retailer",
    typeLabel: "Retailer",
    product: "Sweet Corn (Bulk Units)",
    emoji: "🌽",
    grade: "Standard",
    quantity: "800 kg",
    price: "$1.20/kg",
    frequency: "Monthly",
    logistics: "Pickup Required",
    deadline: "Nov 10, 2023",
    deadlineUrgent: false,
    timeAgo: "Requested 2 days ago",
    tab: "pending",
    status: "pending",
  },
  {
    id: 5,
    requester: "FreshRoute Distributors",
    type: "distributor",
    typeLabel: "Distributor",
    product: "Baby Spinach (Packaged)",
    emoji: "🫛",
    grade: "Export Quality",
    quantity: "600 kg",
    price: "$4.80/kg",
    frequency: "Weekly",
    logistics: "Cold Chain Delivery",
    deadline: "Oct 28, 2023",
    deadlineUrgent: true,
    timeAgo: "Requested 3 hours ago",
    tab: "negotiating",
    status: "negotiating",
  },
  {
    id: 6,
    requester: "The Salad Bar Co.",
    type: "chain",
    typeLabel: "Chain Restaurant",
    product: "Romaine Lettuce Heads",
    emoji: "🥗",
    grade: "Premium Grade",
    quantity: "300 kg",
    price: "$3.10/kg",
    frequency: "Bi-weekly",
    logistics: "Delivery Preferred",
    deadline: "Nov 05, 2023",
    deadlineUrgent: false,
    timeAgo: "Negotiating since yesterday",
    tab: "negotiating",
    status: "negotiating",
  },
  {
    id: 7,
    requester: "GreenBox Wholesale",
    type: "wholesaler",
    typeLabel: "Wholesaler",
    product: "Organic Broccoli Crowns",
    emoji: "🥦",
    grade: "Certified Organic",
    quantity: "950 kg",
    price: "$2.90/kg",
    frequency: "Weekly",
    logistics: "Pickup Required",
    deadline: "Oct 20, 2023",
    deadlineUrgent: false,
    timeAgo: "Accepted 3 days ago",
    tab: "accepted",
    status: "accepted",
  },
  {
    id: 8,
    requester: "Sunrise Hotels Group",
    type: "caterer",
    typeLabel: "Caterer",
    product: "Assorted Root Vegetables",
    emoji: "🧅",
    grade: "Premium Grade",
    quantity: "400 kg",
    price: "$3.50/kg",
    frequency: "Weekly",
    logistics: "Vendor Delivery",
    deadline: "Oct 15, 2023",
    deadlineUrgent: false,
    timeAgo: "Completed Oct 15, 2023",
    tab: "completed",
    status: "completed",
  },
];

const TABS = [
  { key: "pending",     label: "Pending",     count: 4    },
  { key: "negotiating", label: "Negotiating", count: 2    },
  { key: "accepted",    label: "Accepted",    count: 12   },
  { key: "completed",   label: "Completed",   count: null },
];

// ── Toast Component ───────────────────────────────────────────
const Toast = ({ message, type, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className={`svbr__toast svbr__toast--${type}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        {type === "success"
          ? <polyline points="20 6 9 17 4 12" />
          : <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>
        }
      </svg>
      {message}
    </div>
  );
};

// ── Negotiate Modal ───────────────────────────────────────────
const NegotiateModal = ({ request, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    counterPrice: "",
    counterQty: "",
    preferredDate: "",
    logistics: request.logistics,
    notes: "",
  });

  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = () => {
    onSubmit(request.id, form);
    onClose();
  };

  return (
    <div className="svbr__modal-overlay" onClick={onClose}>
      <div className="svbr__modal" onClick={(e) => e.stopPropagation()}>
        <div className="svbr__modal-header">
          <span className="svbr__modal-title">Negotiate Terms</span>
          <button className="svbr__modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <p className="svbr__modal-sub">
          Counter-offer to <strong>{request.requester}</strong> for {request.product}
        </p>

        <div className="svbr__modal-info-row">
          <div className="svbr__modal-info-item">
            <div className="svbr__modal-info-label">Their Quantity</div>
            <div className="svbr__modal-info-value">{request.quantity}</div>
          </div>
          <div className="svbr__modal-info-item">
            <div className="svbr__modal-info-label">Their Target Price</div>
            <div className="svbr__modal-info-value">{request.price}</div>
          </div>
          <div className="svbr__modal-info-item">
            <div className="svbr__modal-info-label">Frequency</div>
            <div className="svbr__modal-info-value">{request.frequency}</div>
          </div>
          <div className="svbr__modal-info-item">
            <div className="svbr__modal-info-label">Deadline</div>
            <div className="svbr__modal-info-value">{request.deadline}</div>
          </div>
        </div>

        <div className="svbr__modal-form">
          <div className="svbr__form-row">
            <div className="svbr__form-group">
              <label className="svbr__form-label">Counter Price (per kg)</label>
              <input className="svbr__form-input" name="counterPrice" value={form.counterPrice}
                placeholder={request.price} onChange={handle} />
            </div>
            <div className="svbr__form-group">
              <label className="svbr__form-label">Counter Quantity</label>
              <input className="svbr__form-input" name="counterQty" value={form.counterQty}
                placeholder={request.quantity} onChange={handle} />
            </div>
          </div>

          <div className="svbr__form-row">
            <div className="svbr__form-group">
              <label className="svbr__form-label">Preferred Delivery Date</label>
              <input className="svbr__form-input" name="preferredDate" type="date"
                value={form.preferredDate} onChange={handle} />
            </div>
            <div className="svbr__form-group">
              <label className="svbr__form-label">Logistics Preference</label>
              <select className="svbr__form-select" name="logistics" value={form.logistics} onChange={handle}>
                <option>Pickup Required</option>
                <option>Delivery Preferred</option>
                <option>Vendor Delivery</option>
                <option>Cold Chain Delivery</option>
                <option>Third-party Courier</option>
              </select>
            </div>
          </div>

          <div className="svbr__form-group">
            <label className="svbr__form-label">Additional Notes</label>
            <textarea className="svbr__form-textarea" name="notes" value={form.notes}
              placeholder="Any special conditions, payment terms, or notes..." onChange={handle} />
          </div>
        </div>

        <div className="svbr__modal-footer">
          <button className="svbr__btn-outline" onClick={onClose}>Cancel</button>
          <button className="svbr__btn-primary" onClick={submit}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            Send Counter-Offer
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Request Card ──────────────────────────────────────────────
const RequestCard = ({ request, onNegotiate, onAccept }) => {
  const isAccepted  = request.status === "accepted";
  const isCompleted = request.status === "completed";
  const isLocked    = isAccepted || isCompleted;

  return (
    <div className={`svbr__request-card ${isAccepted ? "svbr__request-card--accepted" : ""} ${isCompleted ? "svbr__request-card--completed" : ""}`}>
      {isAccepted && <div className="svbr__accepted-ribbon">Accepted</div>}

      <div className="svbr__card-img-wrap">
        <div className="svbr__card-img-emoji">{request.emoji}</div>
        {request.grade && (
          <div className="svbr__grade-badge">{request.grade}</div>
        )}
      </div>

      <div className="svbr__card-body">
        <div className="svbr__card-top">
          <div className="svbr__card-top-left">
            <span className="svbr__requester-name">{request.requester}</span>
            <span className={`svbr__requester-type svbr__requester-type--${request.type}`}>
              {request.typeLabel}
            </span>
          </div>
          <div className="svbr__card-top-right">
            <div className="svbr__deadline-label">Deadline</div>
            <div className={`svbr__deadline-date ${request.deadlineUrgent ? "svbr__deadline-date--urgent" : ""}`}>
              {request.deadline}
            </div>
          </div>
        </div>

        <div className="svbr__product-name">{request.product}</div>

        <div className="svbr__card-stats">
          <div className="svbr__stat-item">
            <div className="svbr__stat-item-label">Quantity</div>
            <div className="svbr__stat-item-value">{request.quantity}</div>
          </div>
          <div className="svbr__stat-item">
            <div className="svbr__stat-item-label">Target Price</div>
            <div className="svbr__stat-item-value">{request.price}</div>
          </div>
          <div className="svbr__stat-item">
            <div className="svbr__stat-item-label">Frequency</div>
            <div className="svbr__stat-item-value">{request.frequency}</div>
          </div>
          <div className="svbr__stat-item">
            <div className="svbr__stat-item-label">Logistics</div>
            <div className="svbr__stat-item-value">{request.logistics}</div>
          </div>
        </div>

        <div className="svbr__card-footer">
          <div className="svbr__time-ago">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {request.timeAgo}
          </div>

          {!isLocked && (
            <div className="svbr__card-actions">
              <button className="svbr__btn-negotiate" onClick={() => onNegotiate(request)}>
                Negotiate
              </button>
              <button className="svbr__btn-accept" onClick={() => onAccept(request.id)}>
                Accept Request
              </button>
            </div>
          )}

          {isCompleted && (
            <div className="svbr__card-actions">
              <button className="svbr__btn-negotiate svbr__btn-negotiate--disabled">
                Completed
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Main BulkRequests Page ────────────────────────────────────
const BulkRequests = () => {
  const [farmerName, setFarmerName] = useState(() => {
    try { const p = JSON.parse(localStorage.getItem("sv_profile")); return p?.name || p?.farmerName || "GreenFarm Organics"; } catch { return "GreenFarm Organics"; }
  });
  useEffect(() => {
    const sync = () => { try { const p = JSON.parse(localStorage.getItem("sv_profile")); setFarmerName(p?.name || p?.farmerName || "GreenFarm Organics"); } catch {} };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  const farmerInitials = farmerName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const [requests, setRequests]         = useState(INITIAL_REQUESTS);
  const [activeTab, setTab]             = useState("pending");
  const [searchVal, setSearch]          = useState("");
  const [negotiateTarget, setNego]      = useState(null);
  const [toast, setToast]               = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const showToast = (message, type = "success") => setToast({ message, type });

  const tabCounts = useMemo(() => {
    const counts = {};
    requests.forEach((r) => { counts[r.tab] = (counts[r.tab] || 0) + 1; });
    return counts;
  }, [requests]);

  const filtered = useMemo(() => {
    let list = requests.filter((r) => r.tab === activeTab);
    if (searchVal.trim())
      list = list.filter((r) =>
        r.requester.toLowerCase().includes(searchVal.toLowerCase()) ||
        r.product.toLowerCase().includes(searchVal.toLowerCase())
      );
    return list;
  }, [requests, activeTab, searchVal]);

  const handleAccept = (id) => {
    setRequests((prev) =>
      prev.map((r) => r.id === id ? { ...r, status: "accepted", tab: "accepted" } : r)
    );
    showToast("Request accepted successfully!", "success");
  };

  const handleNegotiateSubmit = (id, form) => {
    setRequests((prev) =>
      prev.map((r) => r.id === id
        ? { ...r, status: "negotiating", tab: "negotiating",
            timeAgo: "Counter-offer sent just now",
            ...(form.counterPrice && { price: form.counterPrice }),
            ...(form.counterQty   && { quantity: form.counterQty }),
            ...(form.logistics    && { logistics: form.logistics }),
          }
        : r
      )
    );
    showToast("Counter-offer sent to " + requests.find((r) => r.id === id)?.requester, "info");
  };

  return (
    <div className="svbr__layout">
      <Sidebar activePage="Bulk Requests" />

      <div className="svbr__main">
        {/* Top Bar — matches Dashboard navbar layout */}
        <header className="svbr__topbar">
          <div className="svbr__search-wrap">
            <svg className="svbr__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="svbr__search-input"
              type="text"
              placeholder="Search orders, inventory, or reports..."
              value={searchVal}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="svbr__topbar-right">
            <div className="svbr__notif-wrapper">
              <button className="svbr__notif-btn" title="Notifications" onClick={() => setShowNotifications(!showNotifications)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 01-3.46 0" />
                </svg>
                <span className="svbr__notif-dot" />
              </button>
              {showNotifications && (
                <div className="svbr__notif-panel">
                  <div className="svbr__notif-panel-header">Notifications</div>
                  <div className="svbr__notif-panel-body">
                    <div className="svbr__notif-item">✓ Low stock alert for Organic Carrots</div>
                    <div className="svbr__notif-item">💬 New order from Sarah Jenkins</div>
                    <div className="svbr__notif-item">⚠️ Inventory review needed</div>
                    <div className="svbr__notif-item">✅ Order #SV-9021 completed</div>
                  </div>
                  <div className="svbr__notif-panel-footer">
                    <button onClick={() => setShowNotifications(false)} className="svbr__notif-mark-read">Mark all as read</button>
                  </div>
                </div>
              )}
            </div>

            <div className="svbr__vendor-info">
              <div className="svbr__vendor-text">
                <div className="svbr__vendor-name">{farmerName}</div>
                <div className="svbr__vendor-tier">Premium Vendor</div>
              </div>
              <div className="svbr__vendor-avatar">{farmerInitials}</div>
            </div>
          </div>
        </header>

        <main className="svbr__content">
          <div className="svbr__header">
            <h1>Active Inquiries</h1>
            <p>Manage high-volume orders from restaurants and wholesalers.</p>
          </div>

          <div className="svbr__tabs-bar">
            {TABS.map((tab) => {
              const count = tabCounts[tab.key] ?? 0;
              const display = tab.count !== null
                ? `${tab.label} (${count})`
                : tab.label;
              return (
                <button
                  key={tab.key}
                  className={`svbr__tab ${activeTab === tab.key ? "svbr__tab--active" : ""}`}
                  onClick={() => { setTab(tab.key); setSearch(""); }}
                >
                  {display}
                </button>
              );
            })}
          </div>

          <div className="svbr__cards-list">
            {filtered.length === 0 ? (
              <div className="svbr__empty">
                <div className="svbr__empty-icon">📦</div>
                <div className="svbr__empty-title">No requests here</div>
                <div className="svbr__empty-sub">
                  {searchVal ? "Try a different search term." : "Nothing in this category yet."}
                </div>
              </div>
            ) : (
              filtered.map((req) => (
                <RequestCard
                  key={req.id}
                  request={req}
                  onNegotiate={setNego}
                  onAccept={handleAccept}
                />
              ))
            )}
          </div>
        </main>
      </div>

      {negotiateTarget && (
        <NegotiateModal
          request={negotiateTarget}
          onClose={() => setNego(null)}
          onSubmit={handleNegotiateSubmit}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default BulkRequests;