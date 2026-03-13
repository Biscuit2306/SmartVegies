import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/Sidebar";
import "../../styles/farmer-css/profile.css";

// ── Initial profile state ─────────────────────────────────────
const INIT = {
  name:        "John Doe",
  location:    "Oregon, USA",
  joinedYear:  "2018",
  farmName:    "Green Acres Farm",
  farmerName:  "John Doe",
  address:     "123 Harvest Lane, Salem, OR 97301",
  description: "A family-owned organic farm specializing in seasonal berries and heirloom vegetables. We prioritize sustainable farming practices and local community engagement.",
  email:       "john@greenacres.farm",
  phone:       "1 (503) 555-0123",
  website:     "www.greenacresfarm.com",
  facebook:    "facebook.com/greenacresfarm",
  instagram:   "@greenacresfarm",
};

const GALLERY_EMOJIS = ["🍅🥦", "🌾", "🧺"];

// ── Toast ─────────────────────────────────────────────────────
const Toast = ({ message, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="svp__toast">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      {message}
    </div>
  );
};

// ── Main Profile Page ─────────────────────────────────────────
const Profile = () => {
  const [form, setForm]         = useState(INIT);
  const [saved, setSaved]       = useState(INIT);
  const [dirty, setDirty]       = useState(false);
  const [toast, setToast]       = useState(null);
  const [completion, setCompletion] = useState(85);

  // Track unsaved changes
  useEffect(() => {
    const changed = Object.keys(form).some((k) => form[k] !== saved[k]);
    setDirty(changed);
  }, [form, saved]);

  // Recalculate completion when form changes
  useEffect(() => {
    const fields = ["name","farmName","farmerName","address","description","email","phone","website","facebook","instagram"];
    const filled = fields.filter((k) => form[k]?.trim()).length;
    setCompletion(Math.round((filled / fields.length) * 100));
  }, [form]);

  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = () => {
    setSaved({ ...form });
    setDirty(false);
    setToast("Profile saved successfully!");
  };

  const handleCancel = () => {
    setForm({ ...saved });
    setDirty(false);
  };

  return (
    <div className="svp__layout">
      <Sidebar />

      <div className="svp__main">
        {/* Top Bar */}
        <header className="svp__topbar">
          <div className="svp__topbar-left">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="svp__topbar-title">Farmer Portal</span>
          </div>

          <div className="svp__topbar-right">
            <button className="svp__topbar-icon-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <span className="svp__notif-dot" />
            </button>

            <div className="svp__vendor-info">
              <div className="svp__vendor-text">
                <div className="svp__vendor-name">{saved.name}</div>
                <div className="svp__vendor-tier">Verified Farmer</div>
              </div>
              <div className="svp__vendor-avatar-sm">
                {saved.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
              </div>
            </div>
          </div>
        </header>

        {/* Unsaved changes banner */}
        {dirty && (
          <div className="svp__unsaved-banner">
            <div className="svp__unsaved-banner-left">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              You have unsaved changes
            </div>
            <div className="svp__unsaved-btns">
              <button className="svp__cancel-btn" style={{ padding: "6px 14px", fontSize: "12px" }}
                onClick={handleCancel}>Discard</button>
              <button className="svp__save-btn" style={{ padding: "6px 14px", fontSize: "12px" }}
                onClick={handleSave}>Save Now</button>
            </div>
          </div>
        )}

        <div className="svp__content">
          {/* ── Hero Card ── */}
          <div className="svp__hero-card">
            {/* Cover */}
            <div className="svp__cover-wrap">
              <div className="svp__cover-emoji-bg">🌾🌿🍃</div>
              <button className="svp__update-cover-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Update Cover
              </button>
            </div>

            {/* Profile row */}
            <div className="svp__profile-row">
              <div className="svp__profile-left">
                {/* Avatar */}
                <div className="svp__avatar-wrap">
                  <div className="svp__avatar">
                    {form.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </div>
                  <button className="svp__avatar-edit-btn" title="Change photo">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  </button>
                </div>

                {/* Info */}
                <div className="svp__profile-info">
                  <div className="svp__profile-name">{form.name}</div>
                  <div className="svp__profile-meta">
                    <div className="svp__profile-meta-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {form.location}
                    </div>
                    <div className="svp__profile-meta-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      Joined {form.joinedYear}
                    </div>
                    <span className="svp__verified-badge">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      Verified Farmer
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="svp__profile-actions">
                <button className="svp__save-btn" onClick={handleSave}>Save Profile</button>
                <button className="svp__cancel-btn" onClick={handleCancel}>Cancel</button>
              </div>
            </div>
          </div>

          {/* ── Body ── */}
          <div className="svp__body">
            {/* Left Column */}
            <div className="svp__left-col">

              {/* Farm Details */}
              <div className="svp__section-card">
                <div className="svp__section-header">
                  <div className="svp__section-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  </div>
                  <div>
                    <div className="svp__section-title">Farm Details</div>
                    <div className="svp__section-subtitle">Information about your farm and its operations</div>
                  </div>
                </div>

                <div className="svp__form-row">
                  <div className="svp__form-group">
                    <label className="svp__form-label">Farm Name</label>
                    <input className="svp__form-input" name="farmName" value={form.farmName} onChange={handle}
                      placeholder="e.g. Green Acres Farm" />
                  </div>
                  <div className="svp__form-group">
                    <label className="svp__form-label">Farmer Name</label>
                    <input className="svp__form-input" name="farmerName" value={form.farmerName} onChange={handle}
                      placeholder="e.g. John Doe" />
                  </div>
                </div>

                <div className="svp__form-row">
                  <div className="svp__form-group svp__form-group--full">
                    <label className="svp__form-label">Location / Address</label>
                    <div className="svp__form-input-wrap">
                      <svg className="svp__form-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <input className="svp__form-input svp__form-input--with-icon" name="address"
                        value={form.address} onChange={handle} placeholder="Street address, city, state, zip" />
                    </div>
                  </div>
                </div>

                <div className="svp__form-row">
                  <div className="svp__form-group svp__form-group--full">
                    <label className="svp__form-label">Farm Description</label>
                    <textarea className="svp__form-textarea" name="description" value={form.description}
                      onChange={handle} placeholder="Describe your farm, specialties, practices..." />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="svp__section-card">
                <div className="svp__section-header">
                  <div className="svp__section-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div>
                    <div className="svp__section-title">Contact Information</div>
                    <div className="svp__section-subtitle">How buyers can reach you for inquiries</div>
                  </div>
                </div>

                <div className="svp__form-row">
                  <div className="svp__form-group">
                    <label className="svp__form-label">Email Address</label>
                    <input className="svp__form-input" name="email" type="email" value={form.email}
                      onChange={handle} placeholder="you@yourfarm.com" />
                  </div>
                  <div className="svp__form-group">
                    <label className="svp__form-label">Phone Number</label>
                    <input className="svp__form-input" name="phone" type="tel" value={form.phone}
                      onChange={handle} placeholder="e.g. +1 (503) 555-0123" />
                  </div>
                </div>
              </div>

              {/* Social & Web Presence */}
              <div className="svp__section-card">
                <div className="svp__section-header">
                  <div className="svp__section-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
                    </svg>
                  </div>
                  <div>
                    <div className="svp__section-title">Social & Web Presence</div>
                    <div className="svp__section-subtitle">Let buyers find you online</div>
                  </div>
                </div>

                <div className="svp__social-row">
                  <div className="svp__social-item">
                    <div className="svp__social-icon svp__social-icon--web">🌐</div>
                    <input className="svp__form-input" name="website" value={form.website}
                      onChange={handle} placeholder="www.yourfarm.com" />
                  </div>
                  <div className="svp__social-item">
                    <div className="svp__social-icon svp__social-icon--fb">📘</div>
                    <input className="svp__form-input" name="facebook" value={form.facebook}
                      onChange={handle} placeholder="facebook.com/yourpage" />
                  </div>
                  <div className="svp__social-item">
                    <div className="svp__social-icon svp__social-icon--ig">📸</div>
                    <input className="svp__form-input" name="instagram" value={form.instagram}
                      onChange={handle} placeholder="@yourhandle" />
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column */}
            <div className="svp__right-col">

              {/* Farm Gallery */}
              <div className="svp__section-card">
                <div className="svp__gallery-header">
                  <div className="svp__gallery-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    Farm Gallery
                  </div>
                  <button className="svp__gallery-manage-btn">Manage</button>
                </div>

                <div className="svp__gallery-grid">
                  {GALLERY_EMOJIS.map((em, i) => (
                    <div key={i} className="svp__gallery-img-wrap" title="Click to view">
                      <span style={{ fontSize: 36 }}>{em}</span>
                    </div>
                  ))}
                  <button className="svp__gallery-add-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <span className="svp__gallery-add-label">Add Photo</span>
                  </button>
                </div>
                <div className="svp__gallery-support">Support JPG, PNG up to 10MB</div>
              </div>

              {/* Profile Completion */}
              <div className="svp__completion-card">
                <div className="svp__completion-header">
                  <div className="svp__completion-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <span className="svp__completion-title">Profile Completion</span>
                </div>
                <div className="svp__completion-bar-track">
                  <div
                    className="svp__completion-bar-fill"
                    style={{ width: `${completion}%` }}
                  />
                </div>
                <p className="svp__completion-text">
                  Your profile is <strong>{completion}% complete.</strong>{" "}
                  {completion < 100
                    ? "Fill in all fields to reach 100% and attract more buyers."
                    : "🎉 Your profile is complete!"}
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
};

export default Profile;