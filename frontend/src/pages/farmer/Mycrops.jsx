import React, { useState, useMemo } from "react";
import Sidebar from "../../components/Sidebar";
import "../../styles/farmer-css/mycrops.css";

// ── Static Crop Data ─────────────────────────────────────────
const INITIAL_CROPS = [
  {
    id: 1,
    name: "Organic Carrots",
    variety: "Nantes Variety",
    emoji: "🥕",
    status: "growing",
    quantity: "120 kg",
    field: "Field A",
    planted: "Sep 10, 2023",
    harvest: "Nov 20, 2023",
    progress: 72,
    category: "Root Vegetables",
  },
  {
    id: 2,
    name: "Baby Spinach",
    variety: "Bloomsdale",
    emoji: "🥬",
    status: "issue",
    quantity: "45 kg",
    field: "Field B",
    planted: "Oct 01, 2023",
    harvest: "Nov 05, 2023",
    progress: 30,
    category: "Leafy Greens",
  },
  {
    id: 3,
    name: "Green Broccoli",
    variety: "Calabrese",
    emoji: "🥦",
    status: "growing",
    quantity: "80 kg",
    field: "Field C",
    planted: "Sep 20, 2023",
    harvest: "Dec 01, 2023",
    progress: 55,
    category: "Brassicas",
  },
  {
    id: 4,
    name: "Cherry Tomatoes",
    variety: "Sweet 100",
    emoji: "🍅",
    status: "harvested",
    quantity: "200 kg",
    field: "Field A",
    planted: "Jul 15, 2023",
    harvest: "Oct 10, 2023",
    progress: 100,
    category: "Fruits",
  },
  {
    id: 5,
    name: "Red Onions",
    variety: "Red Baron",
    emoji: "🧅",
    status: "seedling",
    quantity: "60 kg",
    field: "Field D",
    planted: "Oct 18, 2023",
    harvest: "Jan 15, 2024",
    progress: 12,
    category: "Bulbs",
  },
  {
    id: 6,
    name: "Sweet Corn",
    variety: "Golden Bantam",
    emoji: "🌽",
    status: "growing",
    quantity: "150 kg",
    field: "Field B",
    planted: "Aug 30, 2023",
    harvest: "Nov 28, 2023",
    progress: 80,
    category: "Grains",
  },
];

const SUMMARY_STATS = [
  { icon: "🌱", label: "Total Crops",     value: "6",   colorClass: "svc__summary-icon--green"  },
  { icon: "🌿", label: "Currently Growing", value: "3", colorClass: "svc__summary-icon--blue"   },
  { icon: "⚠️",  label: "Need Attention",  value: "1",  colorClass: "svc__summary-icon--orange" },
  { icon: "✅",  label: "Harvested",       value: "1",  colorClass: "svc__summary-icon--red"    },
];

const FILTER_TABS = ["All", "Growing", "Seedling", "Harvested", "Issue"];

// ── Helpers ──────────────────────────────────────────────────
const statusLabel = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// ── Add Crop Modal ────────────────────────────────────────────
const AddCropModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({
    name: "", variety: "", emoji: "🌿",
    field: "", quantity: "", planted: "",
    harvest: "", category: "", status: "seedling",
  });

  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = () => {
    if (!form.name.trim()) return;
    onAdd({ ...form, id: Date.now(), progress: 5 });
    onClose();
  };

  return (
    <div className="svc__modal-overlay" onClick={onClose}>
      <div className="svc__modal" onClick={(e) => e.stopPropagation()}>
        <div className="svc__modal-header">
          <span className="svc__modal-title">Add New Crop</span>
          <button className="svc__modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="svc__modal-form">
          <div className="svc__form-row">
            <div className="svc__form-group">
              <label className="svc__form-label">Crop Name *</label>
              <input className="svc__form-input" name="name" value={form.name}
                placeholder="e.g. Organic Carrots" onChange={handle} />
            </div>
            <div className="svc__form-group">
              <label className="svc__form-label">Variety</label>
              <input className="svc__form-input" name="variety" value={form.variety}
                placeholder="e.g. Nantes" onChange={handle} />
            </div>
          </div>

          <div className="svc__form-row">
            <div className="svc__form-group">
              <label className="svc__form-label">Field</label>
              <input className="svc__form-input" name="field" value={form.field}
                placeholder="e.g. Field A" onChange={handle} />
            </div>
            <div className="svc__form-group">
              <label className="svc__form-label">Quantity (kg)</label>
              <input className="svc__form-input" name="quantity" value={form.quantity}
                placeholder="e.g. 100 kg" onChange={handle} />
            </div>
          </div>

          <div className="svc__form-row">
            <div className="svc__form-group">
              <label className="svc__form-label">Planted Date</label>
              <input className="svc__form-input" name="planted" type="date"
                value={form.planted} onChange={handle} />
            </div>
            <div className="svc__form-group">
              <label className="svc__form-label">Harvest Date</label>
              <input className="svc__form-input" name="harvest" type="date"
                value={form.harvest} onChange={handle} />
            </div>
          </div>

          <div className="svc__form-row">
            <div className="svc__form-group">
              <label className="svc__form-label">Category</label>
              <input className="svc__form-input" name="category" value={form.category}
                placeholder="e.g. Leafy Greens" onChange={handle} />
            </div>
            <div className="svc__form-group">
              <label className="svc__form-label">Status</label>
              <select className="svc__form-select" name="status" value={form.status} onChange={handle}>
                <option value="seedling">Seedling</option>
                <option value="growing">Growing</option>
                <option value="harvested">Harvested</option>
                <option value="issue">Issue</option>
              </select>
            </div>
          </div>
        </div>

        <div className="svc__modal-footer">
          <button className="svc__btn-outline" onClick={onClose}>Cancel</button>
          <button className="svc__btn-primary" onClick={submit}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Crop
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Crop Card ─────────────────────────────────────────────────
const CropCard = ({ crop, onDelete }) => (
  <div className="svc__crop-card">
    <div className="svc__crop-card-img">{crop.emoji || "🌿"}</div>

    <div className="svc__crop-card-body">
      <div className="svc__crop-card-top">
        <div>
          <div className="svc__crop-name">{crop.name}</div>
          <div className="svc__crop-variety">{crop.variety}</div>
        </div>
        <span className={`svc__crop-status svc__crop-status--${crop.status}`}>
          {statusLabel(crop.status)}
        </span>
      </div>

      <div className="svc__crop-card-meta">
        <div className="svc__crop-meta-item">
          <div className="svc__crop-meta-label">Quantity</div>
          <div className="svc__crop-meta-value">{crop.quantity}</div>
        </div>
        <div className="svc__crop-meta-item">
          <div className="svc__crop-meta-label">Field</div>
          <div className="svc__crop-meta-value">{crop.field}</div>
        </div>
        <div className="svc__crop-meta-item">
          <div className="svc__crop-meta-label">Planted</div>
          <div className="svc__crop-meta-value">{crop.planted}</div>
        </div>
        <div className="svc__crop-meta-item">
          <div className="svc__crop-meta-label">Harvest</div>
          <div className="svc__crop-meta-value">{crop.harvest}</div>
        </div>
      </div>

      <div className="svc__crop-progress-wrap">
        <div className="svc__crop-progress-header">
          <span className="svc__crop-progress-label">Growth Progress</span>
          <span className="svc__crop-progress-pct">{crop.progress}%</span>
        </div>
        <div className="svc__crop-progress-track">
          <div
            className={`svc__crop-progress-fill ${crop.status === "issue" ? "svc__crop-progress-fill--issue" : ""}`}
            style={{ width: `${crop.progress}%` }}
          />
        </div>
      </div>
    </div>

    <div className="svc__crop-card-actions">
      <button className="svc__crop-action-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        Edit
      </button>
      <button className="svc__crop-action-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        View
      </button>
      <button
        className="svc__crop-action-btn svc__crop-action-btn--primary"
        onClick={() => onDelete(crop.id)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
          <path d="M10 11v6M14 11v6" />
        </svg>
        Remove
      </button>
    </div>
  </div>
);

// ── Main MyCrops Page ─────────────────────────────────────────
const MyCrops = () => {
  const [crops, setCrops]         = useState(INITIAL_CROPS);
  const [activeFilter, setFilter] = useState("All");
  const [searchVal, setSearch]    = useState("");
  const [sortBy, setSort]         = useState("name");
  const [viewMode, setViewMode]   = useState("grid");
  const [showModal, setModal]     = useState(false);

  const filtered = useMemo(() => {
    let list = [...crops];
    if (activeFilter !== "All")
      list = list.filter((c) => c.status === activeFilter.toLowerCase());
    if (searchVal.trim())
      list = list.filter((c) =>
        c.name.toLowerCase().includes(searchVal.toLowerCase()) ||
        c.category?.toLowerCase().includes(searchVal.toLowerCase())
      );
    if (sortBy === "name")    list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "progress") list.sort((a, b) => b.progress - a.progress);
    if (sortBy === "harvest")  list.sort((a, b) => new Date(a.harvest) - new Date(b.harvest));
    return list;
  }, [crops, activeFilter, searchVal, sortBy]);

  const handleAdd    = (crop) => setCrops((prev) => [crop, ...prev]);
  const handleDelete = (id)   => setCrops((prev) => prev.filter((c) => c.id !== id));

  return (
    <div className="svc__layout">
      <Sidebar />

      <div className="svc__main">
        {/* Top Bar */}
        <header className="svc__topbar">
          <div className="svc__search-wrap">
            <svg className="svc__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="svc__search-input"
              type="text"
              placeholder="Search crops by name or category..."
              value={searchVal}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="svc__topbar-right">
            <button className="svc__notif-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <span className="svc__notif-dot" />
            </button>
            <div className="svc__vendor-info">
              <div className="svc__vendor-text">
                <div className="svc__vendor-name">GreenFarm Organics</div>
                <div className="svc__vendor-tier">Premium Vendor</div>
              </div>
              <div className="svc__vendor-avatar">GO</div>
            </div>
          </div>
        </header>

        <main className="svc__content">
          {/* Page Header */}
          <div className="svc__header">
            <div className="svc__header-text">
              <h1>My Crops</h1>
              <p>Manage and track all your crops in one place.</p>
            </div>
            <div className="svc__header-actions">
              <button className="svc__btn-outline">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export
              </button>
              <button className="svc__btn-primary" onClick={() => setModal(true)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Crop
              </button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="svc__summary-row">
            {SUMMARY_STATS.map((s) => (
              <div key={s.label} className="svc__summary-card">
                <div className={`svc__summary-icon ${s.colorClass}`}>{s.icon}</div>
                <div>
                  <div className="svc__summary-num">{s.value}</div>
                  <div className="svc__summary-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="svc__controls">
            <div className="svc__filter-tabs">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab}
                  className={`svc__filter-tab ${activeFilter === tab ? "svc__filter-tab--active" : ""}`}
                  onClick={() => setFilter(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="svc__controls-right">
              <select
                className="svc__sort-select"
                value={sortBy}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="name">Sort: Name</option>
                <option value="progress">Sort: Progress</option>
                <option value="harvest">Sort: Harvest Date</option>
              </select>

              <div className="svc__view-toggle">
                <button
                  className={`svc__view-btn ${viewMode === "grid" ? "svc__view-btn--active" : ""}`}
                  onClick={() => setViewMode("grid")}
                  title="Grid view"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                </button>
                <button
                  className={`svc__view-btn ${viewMode === "list" ? "svc__view-btn--active" : ""}`}
                  onClick={() => setViewMode("list")}
                  title="List view"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Crops Grid / List */}
          {filtered.length === 0 ? (
            <div className="svc__empty">
              <div className="svc__empty-icon">🌾</div>
              <div className="svc__empty-title">No crops found</div>
              <div className="svc__empty-sub">Try a different filter or add a new crop.</div>
            </div>
          ) : (
            <div className={`svc__crops-grid ${viewMode === "list" ? "svc__crops-grid--list" : ""}`}>
              {filtered.map((crop) => (
                <CropCard key={crop.id} crop={crop} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Add Crop Modal */}
      {showModal && <AddCropModal onClose={() => setModal(false)} onAdd={handleAdd} />}
    </div>
  );
};

export default MyCrops;