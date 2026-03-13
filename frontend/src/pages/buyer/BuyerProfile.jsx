import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/buyer-css/buyerprofile.css";

// ─── Icon helper ──────────────────────────────────────────────────────────────
const Svg = ({ children, size = 20, stroke = "currentColor", fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

// ─── Sidebar nav ──────────────────────────────────────────────────────────────
const NAV_ICONS = {
  dashboard:    <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
  marketplace:  <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
  cart:         <><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></>,
  myorders:     <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
  bulk:         <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></>,
  profile:      <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
};
const NAV = [
  { id:"dashboard",    path:"/buyer/dashboard",    label:"Dashboard"    },
  { id:"marketplace",  path:"/buyer/marketplace",  label:"Marketplace"  },
  { id:"cart",         path:"/buyer/cart",          label:"Cart", badge:3},
  { id:"myorders",     path:"/buyer/myorders",      label:"My Orders"    },
  { id:"bulk",         path:"/buyer/bulk-order",    label:"Bulk Order"   },
  { id:"profile",      path:"/buyer/profile",       label:"Profile"      },
];

// ─── Initial data ─────────────────────────────────────────────────────────────
const INIT_ADDRESSES = [
  { id:1, label:"Home",   lines:["123 Green Valley Lane","Seattle, WA 98101","United States"],   isDefault:true  },
  { id:2, label:"Office", lines:["Tech Plaza, Building B","100 Innovation Way","Redmond, WA 98052"], isDefault:false },
];
const INIT_PAYMENTS = [
  { id:1, type:"visa",       name:"Visa ending in 4242",       exp:"Expires 12/26", primary:true  },
  { id:2, type:"mastercard", name:"Mastercard ending in 9876",  exp:"Expires 05/25", primary:false },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function BuyerProfile() {
  const navigate = useNavigate();

  // Profile
  const [editingProfile, setEditingProfile] = useState(false);
  const [profile, setProfile] = useState({ firstName:"Alex", lastName:"Johnson", email:"alex.johnson@example.com", phone:"+1 (206) 555-0142" });
  const [draft,   setDraft]   = useState({ ...profile });

  // Addresses
  const [addresses,    setAddresses]    = useState(INIT_ADDRESSES);
  const [addingAddr,   setAddingAddr]   = useState(false);
  const [editingAddr,  setEditingAddr]  = useState(null); // id
  const [newAddr,      setNewAddr]      = useState({ label:"", line1:"", line2:"", city:"", state:"", zip:"", country:"" });

  // Payments
  const [payments, setPayments] = useState(INIT_PAYMENTS);

  // Toast
  const [toast, setToast] = useState("");
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2800); };

  // ── Profile handlers ──
  const saveProfile = () => {
    setProfile({ ...draft });
    setEditingProfile(false);
    showToast("Profile updated successfully!");
  };

  // ── Address handlers ──
  const setDefault = (id) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
    showToast("Default address updated!");
  };
  const removeAddr = (id) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    showToast("Address removed.");
  };
  const saveNewAddr = () => {
    if (!newAddr.label || !newAddr.line1) return;
    const entry = {
      id: Date.now(),
      label: newAddr.label,
      lines: [newAddr.line1, newAddr.line2 && newAddr.line2, `${newAddr.city}, ${newAddr.state} ${newAddr.zip}`, newAddr.country].filter(Boolean),
      isDefault: addresses.length === 0,
    };
    setAddresses(prev => [...prev, entry]);
    setNewAddr({ label:"", line1:"", line2:"", city:"", state:"", zip:"", country:"" });
    setAddingAddr(false);
    showToast("Address added!");
  };

  // ── Payment handlers ──
  const setPrimary = (id) => {
    setPayments(prev => prev.map(p => ({ ...p, primary: p.id === id })));
    showToast("Primary payment updated!");
  };
  const removePayment = (id) => {
    setPayments(prev => prev.filter(p => p.id !== id));
    showToast("Payment method removed.");
  };

  const initials = `${profile.firstName[0]}${profile.lastName[0]}`;

  return (
    <div className="sv-bp__app">

      {/* Sidebar */}
      <aside className="sv-bp__sidebar">
        <div className="sv-bp__logo" onClick={() => navigate("/buyer/dashboard")}>
          <div className="sv-bp__logo-icon">
            <Svg size={20} stroke="#5bc424"><path d="M17 8C8 10 5.9 16.17 3.82 19.82A2 2 0 0 0 5.8 22.6C8 22 11 20 14 18c0 0 1.5 3.5 5 3.5 0-5-3-7-5-7 2-3 4-5 4-8.5 0-3-2.5-5-2.5-5S19 6 17 8z"/></Svg>
          </div>
          SmartVegies
        </div>
        <nav className="sv-bp__nav">
          {NAV.map(({ id, path, label, badge }) => (
            <button key={id}
              className={`sv-bp__nav-item${id === "profile" ? " sv-bp__nav-item--active" : ""}`}
              onClick={() => navigate(path)}>
              <Svg size={20}>{NAV_ICONS[id]}</Svg>
              {label}
              {badge && <span className="sv-bp__nav-badge">{badge}</span>}
            </button>
          ))}
        </nav>
        <div className="sv-bp__wallet">
          <div className="sv-bp__wallet-label">Current Balance</div>
          <div className="sv-bp__wallet-amount">$142.50</div>
          <button className="sv-bp__wallet-btn">Top Up Wallet</button>
        </div>
      </aside>

      {/* Main */}
      <main className="sv-bp__main">
        <h1 className="sv-bp__page-title">Profile</h1>
        <p className="sv-bp__page-sub">Manage your personal information, delivery addresses, and payment methods.</p>

        {/* ── Profile Card ── */}
        <div className="sv-bp__profile-card" style={{ flexDirection:"column", alignItems:"stretch" }}>
          <div style={{ display:"flex", alignItems:"center", gap:24 }}>
            <div className="sv-bp__avatar-wrap">
              <div className="sv-bp__avatar-img">{initials}</div>
              <div className="sv-bp__avatar-edit">
                <Svg size={11}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></Svg>
              </div>
            </div>
            <div className="sv-bp__profile-info">
              <div className="sv-bp__profile-name">{profile.firstName} {profile.lastName}</div>
              <div className="sv-bp__profile-email">{profile.email}</div>
              <div className="sv-bp__profile-badges">
                <span className="sv-bp__badge-premium">Premium Member</span>
                <span className="sv-bp__since">Since Oct 2023</span>
              </div>
            </div>
            <button className="sv-bp__edit-profile-btn" onClick={() => { setDraft({...profile}); setEditingProfile(v => !v); }}>
              {editingProfile ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {/* Inline edit form */}
          {editingProfile && (
            <div className="sv-bp__edit-form">
              <div className="sv-bp__edit-grid">
                {[
                  ["First Name", "firstName"], ["Last Name", "lastName"],
                  ["Email",      "email"],     ["Phone",     "phone"],
                ].map(([label, key]) => (
                  <div key={key} className="sv-bp__edit-field">
                    <label className="sv-bp__edit-label">{label}</label>
                    <input className="sv-bp__edit-input" value={draft[key]}
                      onChange={e => setDraft(d => ({ ...d, [key]: e.target.value }))} />
                  </div>
                ))}
              </div>
              <div className="sv-bp__edit-actions">
                <button className="sv-bp__btn sv-bp__btn--green" onClick={saveProfile}>Save Changes</button>
                <button className="sv-bp__btn sv-bp__btn--ghost" onClick={() => setEditingProfile(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>

        {/* ── Delivery Addresses ── */}
        <div className="sv-bp__section-hdr">
          <span className="sv-bp__section-title">Delivery Addresses</span>
          <button className="sv-bp__section-action" onClick={() => setAddingAddr(v => !v)}>
            <Svg size={16}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Svg>
            Add New
          </button>
        </div>

        <div className="sv-bp__addr-grid">
          {/* Add address form */}
          {addingAddr && (
            <div className="sv-bp__addr-form">
              <div className="sv-bp__addr-form-grid">
                {[
                  ["Label (Home / Office)", "label", false],
                  ["Street Address",        "line1", false],
                  ["Apt / Suite (optional)","line2", false],
                  ["City",                  "city",  false],
                  ["State",                 "state", false],
                  ["ZIP / PIN",             "zip",   false],
                  ["Country",               "country",true],
                ].map(([label, key, full]) => (
                  <div key={key} className={`sv-bp__edit-field${full ? " sv-bp__addr-form-full" : ""}`}>
                    <label className="sv-bp__edit-label">{label}</label>
                    <input className="sv-bp__edit-input" value={newAddr[key]}
                      onChange={e => setNewAddr(a => ({ ...a, [key]: e.target.value }))} />
                  </div>
                ))}
              </div>
              <div className="sv-bp__edit-actions" style={{ marginTop:14 }}>
                <button className="sv-bp__btn sv-bp__btn--green" onClick={saveNewAddr}>Save Address</button>
                <button className="sv-bp__btn sv-bp__btn--ghost" onClick={() => setAddingAddr(false)}>Cancel</button>
              </div>
            </div>
          )}

          {addresses.map(addr => (
            <div key={addr.id}
              className={`sv-bp__addr-card${addr.isDefault ? " sv-bp__addr-card--selected" : ""}`}
              onClick={() => setDefault(addr.id)}>
              {addr.isDefault && <span className="sv-bp__default-badge">Default</span>}
              <div className="sv-bp__addr-label">{addr.label}</div>
              {addr.lines.map((l, i) => <div key={i} className="sv-bp__addr-line">{l}</div>)}
              <div className="sv-bp__addr-actions" onClick={e => e.stopPropagation()}>
                <button className="sv-bp__addr-btn" onClick={() => setDefault(addr.id)}>
                  {addr.isDefault ? "✓ Default" : "Set Default"}
                </button>
                <button className="sv-bp__addr-btn sv-bp__addr-btn--danger" onClick={() => removeAddr(addr.id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Empty add card */}
          {!addingAddr && (
            <div className="sv-bp__add-addr-card" onClick={() => setAddingAddr(true)}>
              <Svg size={28} stroke="#9ca3af"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Svg>
              Add new address
            </div>
          )}
        </div>

        {/* ── Payment Methods ── */}
        <div className="sv-bp__section-hdr">
          <span className="sv-bp__section-title">Payment Methods</span>
          <button className="sv-bp__section-action">
            <Svg size={16}><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></Svg>
            Add Payment
          </button>
        </div>

        <div className="sv-bp__pay-list">
          {payments.map(p => (
            <div key={p.id} className="sv-bp__pay-row">
              <div className="sv-bp__pay-icon">
                {p.type === "visa"
                  ? <Svg size={22}><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></Svg>
                  : <Svg size={22}><circle cx="9" cy="12" r="7"/><circle cx="15" cy="12" r="7"/></Svg>
                }
              </div>
              <div className="sv-bp__pay-info">
                <div className="sv-bp__pay-name">{p.name}</div>
                <div className="sv-bp__pay-exp">{p.exp}</div>
              </div>
              {p.primary && <span className="sv-bp__pay-primary">Primary</span>}
              {!p.primary && (
                <button className="sv-bp__btn sv-bp__btn--ghost" style={{fontSize:12,padding:"6px 14px"}}
                  onClick={() => setPrimary(p.id)}>
                  Set Primary
                </button>
              )}
              <button className="sv-bp__pay-menu" onClick={() => removePayment(p.id)} title="Remove">
                ···
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div className="sv-bp__toast">
          <Svg size={18}><polyline points="20 6 9 17 4 12"/></Svg>
          {toast}
        </div>
      )}
    </div>
  );
}