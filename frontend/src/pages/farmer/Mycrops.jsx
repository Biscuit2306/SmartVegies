import React, { useState, useMemo, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import "../../styles/farmer-css/mycrops.css";

// Inline persisted state — no external file needed
const usePersistedState = (key, initialValue) => {
  const [state, setStateRaw] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : initialValue;
    } catch { return initialValue; }
  });
  const setState = (value) => {
    setStateRaw((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
      return next;
    });
  };
  return [state, setState];
};

// ── Static Crop Data ─────────────────────────────────────────
const INITIAL_CROPS = [
  {
    id: 1,
    name: "Organic Carrots",
    variety: "Nantes Variety",
    emoji: "🥕",
    status: "growing",
    quantity: "120 kg",
    price: 0,
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
    price: 0,
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
    price: 0,
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
    price: 0,
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
    price: 0,
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
    price: 0,
    field: "Field B",
    planted: "Aug 30, 2023",
    harvest: "Nov 28, 2023",
    progress: 80,
    category: "Grains",
  },
];

const SUMMARY_STATS = [
  { icon: "🌱", label: "Total Crops",       value: "6", colorClass: "svc__summary-icon--green"  },
  { icon: "🌿", label: "Currently Growing", value: "3", colorClass: "svc__summary-icon--blue"   },
  { icon: "⚠️",  label: "Need Attention",   value: "1", colorClass: "svc__summary-icon--orange" },
  { icon: "✅",  label: "Harvested",         value: "1", colorClass: "svc__summary-icon--red"    },
];

const FILTER_TABS = ["All", "Growing", "Seedling", "Harvested", "Issue"];

// ── Helpers ──────────────────────────────────────────────────
const statusLabel = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const toDateInput = (str) => {
  if (!str) return "";
  const d = new Date(str);
  if (isNaN(d)) return "";
  return d.toISOString().split("T")[0];
};

const fromDateInput = (str) => {
  if (!str) return "";
  return new Date(str).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

// ── Add Crop Modal ────────────────────────────────────────────
const AddCropModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({
    name: "", variety: "", emoji: "🌿",
    field: "", quantity: "", price: "",
    planted: "", harvest: "", category: "", status: "seedling",
  });

  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = () => {
    if (!form.name.trim()) return;
    onAdd({
      ...form,
      id: Date.now(),
      progress: 5,
      price: parseFloat(form.price) || 0,
      planted: fromDateInput(form.planted) || form.planted,
      harvest: fromDateInput(form.harvest) || form.harvest,
    });
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
              <label className="svc__form-label">Price per kg (₹)</label>
              <input className="svc__form-input" name="price" value={form.price}
                placeholder="e.g. 3.50" type="number" min="0" step="0.01" onChange={handle} />
            </div>
            <div className="svc__form-group">
              <label className="svc__form-label">Category</label>
              <input className="svc__form-input" name="category" value={form.category}
                placeholder="e.g. Leafy Greens" onChange={handle} />
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

// ── Edit Crop Modal ───────────────────────────────────────────
const EditCropModal = ({ crop, onClose, onSave }) => {
  const [form, setForm] = useState({
    name:     crop.name,
    variety:  crop.variety,
    emoji:    crop.emoji || "🌿",
    field:    crop.field,
    quantity: crop.quantity,
    price:    crop.price ?? 0,
    planted:  toDateInput(crop.planted),
    harvest:  toDateInput(crop.harvest),
    category: crop.category,
    status:   crop.status,
    progress: crop.progress,
  });

  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = () => {
    if (!form.name.trim()) return;
    onSave({
      ...crop,
      ...form,
      price:    parseFloat(form.price) || 0,
      progress: parseInt(form.progress, 10) || 0,
      planted:  fromDateInput(form.planted) || form.planted,
      harvest:  fromDateInput(form.harvest) || form.harvest,
    });
    onClose();
  };

  return (
    <div className="svc__modal-overlay" onClick={onClose}>
      <div className="svc__modal svc__modal--wide" onClick={(e) => e.stopPropagation()}>
        <div className="svc__modal-header">
          <span className="svc__modal-title">Edit Crop</span>
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
              <input className="svc__form-input" name="name" value={form.name} onChange={handle} />
            </div>
            <div className="svc__form-group">
              <label className="svc__form-label">Variety</label>
              <input className="svc__form-input" name="variety" value={form.variety} onChange={handle} />
            </div>
          </div>

          <div className="svc__form-row">
            <div className="svc__form-group">
              <label className="svc__form-label">Field</label>
              <input className="svc__form-input" name="field" value={form.field} onChange={handle} />
            </div>
            <div className="svc__form-group">
              <label className="svc__form-label">Quantity</label>
              <input className="svc__form-input" name="quantity" value={form.quantity} onChange={handle} />
            </div>
          </div>

          <div className="svc__form-row">
            <div className="svc__form-group">
              <label className="svc__form-label">Price per kg (₹)</label>
              <input className="svc__form-input" name="price" value={form.price}
                type="number" min="0" step="0.01" onChange={handle} />
            </div>
            <div className="svc__form-group">
              <label className="svc__form-label">Category</label>
              <input className="svc__form-input" name="category" value={form.category} onChange={handle} />
            </div>
          </div>

          <div className="svc__form-row">
            <div className="svc__form-group">
              <label className="svc__form-label">Planted Date</label>
              <input className="svc__form-input" name="planted" type="date" value={form.planted} onChange={handle} />
            </div>
            <div className="svc__form-group">
              <label className="svc__form-label">Harvest Date</label>
              <input className="svc__form-input" name="harvest" type="date" value={form.harvest} onChange={handle} />
            </div>
          </div>

          <div className="svc__form-row">
            <div className="svc__form-group">
              <label className="svc__form-label">Status</label>
              <select className="svc__form-select" name="status" value={form.status} onChange={handle}>
                <option value="seedling">Seedling</option>
                <option value="growing">Growing</option>
                <option value="harvested">Harvested</option>
                <option value="issue">Issue</option>
              </select>
            </div>
            <div className="svc__form-group">
              <label className="svc__form-label">Growth Progress ({form.progress}%)</label>
              <input
                className="svc__form-input svc__form-input--range"
                name="progress"
                type="range"
                min="0"
                max="100"
                value={form.progress}
                onChange={handle}
              />
              <div className="svc__progress-range-labels">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="svc__modal-footer">
          <button className="svc__btn-outline" onClick={onClose}>Cancel</button>
          <button className="svc__btn-primary" onClick={submit}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v14a2 2 0 01-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// ── View Crop Modal ───────────────────────────────────────────
const ViewCropModal = ({ crop, onClose }) => (
  <div className="svc__modal-overlay" onClick={onClose}>
    <div className="svc__modal svc__modal--wide" onClick={(e) => e.stopPropagation()}>
      <div className="svc__modal-header">
        <span className="svc__modal-title">Crop Details</span>
        <button className="svc__modal-close" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="svc__view-modal-hero">
        <div className="svc__view-modal-emoji">{crop.emoji || "🌿"}</div>
        <div className="svc__view-modal-hero-text">
          <div className="svc__view-modal-name">{crop.name}</div>
          <div className="svc__view-modal-variety">{crop.variety}</div>
          <span className={`svc__crop-status svc__crop-status--${crop.status}`}>
            {statusLabel(crop.status)}
          </span>
        </div>
      </div>

      <div className="svc__view-modal-grid">
        <div className="svc__view-detail-item">
          <div className="svc__view-detail-label">Field</div>
          <div className="svc__view-detail-value">{crop.field || "—"}</div>
        </div>
        <div className="svc__view-detail-item">
          <div className="svc__view-detail-label">Quantity</div>
          <div className="svc__view-detail-value">{crop.quantity || "—"}</div>
        </div>
        <div className="svc__view-detail-item">
          <div className="svc__view-detail-label">Price per kg</div>
          <div className="svc__view-detail-value">
            {crop.price != null && crop.price > 0 ? `₹${parseFloat(crop.price).toFixed(2)}` : "—"}
          </div>
        </div>
        <div className="svc__view-detail-item">
          <div className="svc__view-detail-label">Category</div>
          <div className="svc__view-detail-value">{crop.category || "—"}</div>
        </div>
        <div className="svc__view-detail-item">
          <div className="svc__view-detail-label">Planted</div>
          <div className="svc__view-detail-value">{crop.planted || "—"}</div>
        </div>
        <div className="svc__view-detail-item">
          <div className="svc__view-detail-label">Expected Harvest</div>
          <div className="svc__view-detail-value">{crop.harvest || "—"}</div>
        </div>
        <div className="svc__view-detail-item">
          <div className="svc__view-detail-label">Growth Progress</div>
          <div className="svc__view-detail-value">{crop.progress}%</div>
        </div>
      </div>

      <div className="svc__view-modal-progress">
        <div className="svc__crop-progress-header">
          <span className="svc__crop-progress-label">Growth Progress</span>
          <span className="svc__crop-progress-pct">{crop.progress}%</span>
        </div>
        <div className="svc__crop-progress-track">
          <div
            className={`svc__crop-progress-fill${crop.status === "issue" ? " svc__crop-progress-fill--issue" : ""}`}
            style={{ width: `${crop.progress}%` }}
          />
        </div>
      </div>

      <div className="svc__modal-footer">
        <button className="svc__btn-outline" onClick={onClose}>Close</button>
      </div>
    </div>
  </div>
);

// ── Confirm Remove Modal ──────────────────────────────────────
const ConfirmRemoveModal = ({ crop, onClose, onConfirm }) => (
  <div className="svc__modal-overlay" onClick={onClose}>
    <div className="svc__modal svc__modal--narrow" onClick={(e) => e.stopPropagation()}>
      <div className="svc__modal-header">
        <span className="svc__modal-title">Remove Crop</span>
        <button className="svc__modal-close" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div className="svc__confirm-body">
        <div className="svc__confirm-icon">🗑️</div>
        <div className="svc__confirm-title">Remove "{crop.name}"?</div>
        <div className="svc__confirm-sub">This action cannot be undone. The crop will be permanently removed from your list.</div>
      </div>
      <div className="svc__modal-footer">
        <button className="svc__btn-outline" onClick={onClose}>Cancel</button>
        <button className="svc__btn-danger" onClick={() => { onConfirm(crop.id); onClose(); }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
          </svg>
          Remove Crop
        </button>
      </div>
    </div>
  </div>
);

// ── Crop Card ─────────────────────────────────────────────────
const CropCard = ({ crop, onDelete, onEdit, onView }) => (
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
          <div className="svc__crop-meta-label">Price</div>
          <div className="svc__crop-meta-value">
            {crop.price > 0 ? `₹${parseFloat(crop.price).toFixed(2)}` : "—"}
          </div>
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
            className={`svc__crop-progress-fill${crop.status === "issue" ? " svc__crop-progress-fill--issue" : ""}`}
            style={{ width: `${crop.progress}%` }}
          />
        </div>
      </div>
    </div>

    <div className="svc__crop-card-actions">
      <button className="svc__crop-action-btn" onClick={() => onEdit(crop)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        Edit
      </button>
      <button className="svc__crop-action-btn" onClick={() => onView(crop)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        View
      </button>
      <button
        className="svc__crop-action-btn svc__crop-action-btn--primary"
        onClick={() => onDelete(crop)}
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
  const [farmerName, setFarmerName] = useState(() => {
    try { const p = JSON.parse(localStorage.getItem("sv_profile")); return p?.name || p?.farmerName || "GreenFarm Organics"; } catch { return "GreenFarm Organics"; }
  });
  useEffect(() => {
    const sync = () => { try { const p = JSON.parse(localStorage.getItem("sv_profile")); setFarmerName(p?.name || p?.farmerName || "GreenFarm Organics"); } catch {} };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  const farmerInitials = farmerName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const [crops, setCrops]         = usePersistedState("sv_crops", INITIAL_CROPS);
  const [activeFilter, setFilter] = useState("All");
  const [searchVal, setSearch]    = useState("");
  const [sortBy, setSort]         = useState("name");
  const [showModal, setModal]     = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [editCrop,   setEditCrop]   = useState(null);
  const [viewCrop,   setViewCrop]   = useState(null);
  const [removeCrop, setRemoveCrop] = useState(null);

  const filtered = useMemo(() => {
    let list = [...crops];
    if (activeFilter !== "All")
      list = list.filter((c) => c.status === activeFilter.toLowerCase());
    if (searchVal.trim())
      list = list.filter((c) =>
        c.name.toLowerCase().includes(searchVal.toLowerCase()) ||
        c.category?.toLowerCase().includes(searchVal.toLowerCase())
      );
    if (sortBy === "name")     list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "progress") list.sort((a, b) => b.progress - a.progress);
    if (sortBy === "harvest")  list.sort((a, b) => new Date(a.harvest) - new Date(b.harvest));
    return list;
  }, [crops, activeFilter, searchVal, sortBy]);

  const handleAdd    = (crop) => setCrops((prev) => [crop, ...prev]);
  const handleDelete = (id)   => setCrops((prev) => prev.filter((c) => c.id !== id));
  const handleSave   = (updated) => setCrops((prev) => prev.map((c) => c.id === updated.id ? updated : c));

  const handleExport = () => {
    const headers = ["Name", "Variety", "Status", "Quantity", "Price", "Field", "Category", "Planted", "Harvest", "Progress"];
    const rows = crops.map((c) => [
      c.name, c.variety, c.status, c.quantity,
      c.price > 0 ? `₹${parseFloat(c.price).toFixed(2)}` : "—",
      c.field, c.category, c.planted, c.harvest, `${c.progress}%`,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${(v || "").toString().replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = "my-crops.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="svc__layout">
      <Sidebar activePage="My Crops" />

      <div className="svc__main">
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
            <div className="svc__notif-wrapper">
              <button className="svc__notif-btn" title="Notifications" onClick={() => setShowNotifications(!showNotifications)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 01-3.46 0" />
                </svg>
                <span className="svc__notif-dot" />
              </button>
              {showNotifications && (
                <div className="svc__notif-panel">
                  <div className="svc__notif-panel-header">Notifications</div>
                  <div className="svc__notif-panel-body">
                    <div className="svc__notif-item">✓ Low stock alert for Organic Carrots</div>
                    <div className="svc__notif-item">💬 New order from Sarah Jenkins</div>
                    <div className="svc__notif-item">⚠️ Inventory review needed</div>
                    <div className="svc__notif-item">✅ Order #SV-9021 completed</div>
                  </div>
                  <div className="svc__notif-panel-footer">
                    <button onClick={() => setShowNotifications(false)} className="svc__notif-mark-read">Mark all as read</button>
                  </div>
                </div>
              )}
            </div>
            <div className="svc__vendor-info">
              <div className="svc__vendor-text">
                <div className="svc__vendor-name">{farmerName}</div>
                <div className="svc__vendor-tier">Premium Vendor</div>
              </div>
              <div className="svc__vendor-avatar">{farmerInitials}</div>
            </div>
          </div>
        </header>

        <main className="svc__content">
          <div className="svc__header">
            <div className="svc__header-text">
              <h1>My Crops</h1>
              <p>Manage and track all your crops in one place.</p>
            </div>
            <div className="svc__header-actions">
              <button className="svc__btn-outline" onClick={handleExport}>
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

          <div className="svc__controls">
            <div className="svc__filter-tabs">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab}
                  className={`svc__filter-tab${activeFilter === tab ? " svc__filter-tab--active" : ""}`}
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
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="svc__empty">
              <div className="svc__empty-icon">🌾</div>
              <div className="svc__empty-title">No crops found</div>
              <div className="svc__empty-sub">Try a different filter or add a new crop.</div>
            </div>
          ) : (
            <div className="svc__crops-grid">
              {filtered.map((crop) => (
                <CropCard
                  key={crop.id}
                  crop={crop}
                  onEdit={setEditCrop}
                  onView={setViewCrop}
                  onDelete={setRemoveCrop}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {showModal && <AddCropModal onClose={() => setModal(false)} onAdd={handleAdd} />}
      {editCrop  && <EditCropModal crop={editCrop} onClose={() => setEditCrop(null)} onSave={handleSave} />}
      {viewCrop  && <ViewCropModal crop={viewCrop} onClose={() => setViewCrop(null)} />}
      {removeCrop && <ConfirmRemoveModal crop={removeCrop} onClose={() => setRemoveCrop(null)} onConfirm={handleDelete} />}
    </div>
  );
};

export default MyCrops;