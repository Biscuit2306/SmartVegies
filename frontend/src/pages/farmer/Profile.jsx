import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/Sidebar";
import "../../styles/farmer-css/profile.css";

// ── Persisted state helper ────────────────────────────────────
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
  const [saved, setSaved]       = usePersistedState("sv_profile", INIT);
  const [form, setForm]         = useState(saved);
  const [editMode, setEditMode] = useState(false);
  const [dirty, setDirty]       = useState(false);
  const [toast, setToast]       = useState(null);
  const [completion, setCompletion] = useState(85);
  const [showNotifications, setShowNotifications] = useState(false);

  // Avatar & cover image state (persisted as base64)
  const [avatarSrc, setAvatarSrc]   = usePersistedState("sv_profile_avatar", null);
  const [coverSrc, setCoverSrc]     = usePersistedState("sv_profile_cover", null);
  const [galleryImgs, setGalleryImgs] = usePersistedState("sv_profile_gallery", []);

  const avatarInputRef  = useRef(null);
  const coverInputRef   = useRef(null);
  const galleryInputRef = useRef(null);

  // Sync form when saved changes externally (e.g. on mount from localStorage)
  useEffect(() => { setForm(saved); }, []);

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
    const updated = {
      ...form,
      name:     form.farmerName || form.name,
      location: form.address    || form.location,
    };
    setForm(updated);
    setSaved(updated);
    setDirty(false);
    setEditMode(false);
    setToast("Profile saved successfully!");
    // Notify other open tabs/pages that the profile name has changed
    window.dispatchEvent(new Event("storage"));
  };

  const handleCancel = () => {
    setForm({ ...saved });
    setDirty(false);
    setEditMode(false);
  };

  const handleEditClick = () => {
    setForm({ ...saved });
    setEditMode(true);
  };

  // ── Image helpers ──
  const readFileAsDataURL = (file) =>
    new Promise((res) => {
      const reader = new FileReader();
      reader.onload = (e) => res(e.target.result);
      reader.readAsDataURL(file);
    });

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const src = await readFileAsDataURL(file);
    setAvatarSrc(src);
    setToast("Profile photo updated!");
    e.target.value = "";
  };

  const handleCoverChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const src = await readFileAsDataURL(file);
    setCoverSrc(src);
    setToast("Cover photo updated!");
    e.target.value = "";
  };

  const handleGalleryAdd = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const srcs = await Promise.all(files.map(readFileAsDataURL));
    setGalleryImgs((prev) => [...prev, ...srcs]);
    setToast(`${srcs.length} photo${srcs.length > 1 ? "s" : ""} added!`);
    e.target.value = "";
  };

  const handleGalleryRemove = (idx) => {
    setGalleryImgs((prev) => prev.filter((_, i) => i !== idx));
  };

  const STATIC_GALLERY = ["🍅🥦", "🌾", "🧺"];

  const initials = (name) =>
    (name || "").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="svp__layout">
      <Sidebar activePage="Profile" />

      {/* Hidden file inputs */}
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        className="svp__hidden-input"
        onChange={handleAvatarChange}
      />
      <input
        ref={coverInputRef}
        type="file"
        accept="image/*"
        className="svp__hidden-input"
        onChange={handleCoverChange}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        multiple
        className="svp__hidden-input"
        onChange={handleGalleryAdd}
      />

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
            <div className="svp__notif-wrapper">
              <button className="svp__notif-btn" title="Notifications" onClick={() => setShowNotifications(!showNotifications)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 01-3.46 0" />
                </svg>
                <span className="svp__notif-dot" />
              </button>
              {showNotifications && (
                <div className="svp__notif-panel">
                  <div className="svp__notif-panel-header">Notifications</div>
                  <div className="svp__notif-panel-body">
                    <div className="svp__notif-item">✓ Low stock alert for Organic Carrots</div>
                    <div className="svp__notif-item">💬 New order from Sarah Jenkins</div>
                    <div className="svp__notif-item">⚠️ Inventory review needed</div>
                    <div className="svp__notif-item">✅ Order #SV-9021 completed</div>
                  </div>
                  <div className="svp__notif-panel-footer">
                    <button onClick={() => setShowNotifications(false)} className="svp__notif-mark-read">Mark all as read</button>
                  </div>
                </div>
              )}
            </div>

            <div className="svp__vendor-info">
              <div className="svp__vendor-text">
                <div className="svp__vendor-name">{saved.name}</div>
                <div className="svp__vendor-tier">Verified Farmer</div>
              </div>
              <div className="svp__vendor-avatar-sm">
                {avatarSrc
                  ? <img src={avatarSrc} alt="avatar" />
                  : initials(saved.name)
                }
              </div>
            </div>
          </div>
        </header>

        {/* Unsaved changes banner */}
        {dirty && editMode && (
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
              <button className="svp__cancel-btn" onClick={handleCancel}>Discard</button>
              <button className="svp__save-btn" onClick={handleSave}>Save Now</button>
            </div>
          </div>
        )}

        <div className="svp__content">
          {/* ── Hero Card ── */}
          <div className="svp__hero-card">
            {/* Cover */}
            <div className="svp__cover-wrap">
              {coverSrc
                ? <img src={coverSrc} alt="cover" className="svp__cover-img" />
                : <div className="svp__cover-emoji-bg">🌾🌿🍃</div>
              }
              <button className="svp__update-cover-btn" onClick={() => coverInputRef.current?.click()}>
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
                    {avatarSrc
                      ? <img src={avatarSrc} alt="avatar" />
                      : initials(form.name)
                    }
                  </div>
                  <button
                    className="svp__avatar-edit-btn"
                    title="Change photo"
                    onClick={() => avatarInputRef.current?.click()}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 16V8" />
                      <path d="M9 11l3-3 3 3" />
                      <path d="M20 16v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2" />
                    </svg>
                  </button>
                </div>

                {/* Info */}
                <div className="svp__profile-info">
                  <div className="svp__profile-name">{saved.name}</div>
                  <div className="svp__profile-meta">
                    <div className="svp__profile-meta-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {saved.address || saved.location}
                    </div>
                    <div className="svp__profile-meta-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      Joined {saved.joinedYear}
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

              {/* Actions — Edit button only when not in edit mode; Save+Cancel when editing */}
              <div className="svp__profile-actions">
                {editMode ? (
                  <>
                    <button className="svp__save-btn" onClick={handleSave}>Save Profile</button>
                    <button className="svp__cancel-btn" onClick={handleCancel}>Cancel</button>
                  </>
                ) : (
                  <button className="svp__edit-btn" onClick={handleEditClick}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit Profile
                  </button>
                )}
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
                      placeholder="e.g. Green Acres Farm" disabled={!editMode} />
                  </div>
                  <div className="svp__form-group">
                    <label className="svp__form-label">Farmer Name</label>
                    <input className="svp__form-input" name="farmerName" value={form.farmerName} onChange={handle}
                      placeholder="e.g. John Doe" disabled={!editMode} />
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
                        value={form.address} onChange={handle} placeholder="Street address, city, state, zip"
                        disabled={!editMode} />
                    </div>
                  </div>
                </div>

                <div className="svp__form-row">
                  <div className="svp__form-group svp__form-group--full">
                    <label className="svp__form-label">Farm Description</label>
                    <textarea className="svp__form-textarea" name="description" value={form.description}
                      onChange={handle} placeholder="Describe your farm, specialties, practices..."
                      disabled={!editMode} />
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
                      onChange={handle} placeholder="you@yourfarm.com" disabled={!editMode} />
                  </div>
                  <div className="svp__form-group">
                    <label className="svp__form-label">Phone Number</label>
                    <input className="svp__form-input" name="phone" type="tel" value={form.phone}
                      onChange={handle} placeholder="e.g. +1 (503) 555-0123" disabled={!editMode} />
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
                      onChange={handle} placeholder="www.yourfarm.com" disabled={!editMode} />
                  </div>
                  <div className="svp__social-item">
                    <div className="svp__social-icon svp__social-icon--fb">📘</div>
                    <input className="svp__form-input" name="facebook" value={form.facebook}
                      onChange={handle} placeholder="facebook.com/yourpage" disabled={!editMode} />
                  </div>
                  <div className="svp__social-item">
                    <div className="svp__social-icon svp__social-icon--ig">📸</div>
                    <input className="svp__form-input" name="instagram" value={form.instagram}
                      onChange={handle} placeholder="@yourhandle" disabled={!editMode} />
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
                  <button
                    className="svp__gallery-manage-btn"
                    onClick={() => setGalleryImgs([])}
                    title="Clear all uploaded photos"
                  >
                    Clear All
                  </button>
                </div>

                <div className="svp__gallery-grid">
                  {/* Static emoji placeholders */}
                  {STATIC_GALLERY.map((em, i) => (
                    <div key={`static-${i}`} className="svp__gallery-img-wrap" title="Farm photo">
                      <span className="svp__gallery-emoji">{em}</span>
                    </div>
                  ))}
                  {/* Uploaded photos */}
                  {galleryImgs.map((src, i) => (
                    <div key={`uploaded-${i}`} className="svp__gallery-img-wrap svp__gallery-img-wrap--uploaded">
                      <img src={src} alt={`gallery-${i}`} />
                      <button
                        className="svp__gallery-remove-btn"
                        onClick={() => handleGalleryRemove(i)}
                        title="Remove photo"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  {/* Add photo button */}
                  <button className="svp__gallery-add-btn" onClick={() => galleryInputRef.current?.click()}>
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