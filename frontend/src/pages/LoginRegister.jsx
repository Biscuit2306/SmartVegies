/**
 * LoginRegister.jsx — SmartVegies Auth Page
 * Place at: frontend/src/pages/LoginRegister.jsx
 */

import { useState } from "react";
import "../styles/loginregister.css";
import { useNavigate } from "react-router-dom";

// ─── Icons ────────────────────────────────────────────────────────────────────

const LeafIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lr-brand-icon">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lr-input-icon">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lr-input-icon">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lr-input-icon">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lr-input-icon">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 5.51 5.51l.97-.97a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16.92z" />
  </svg>
);

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lr-input-icon">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const StoreIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lr-input-icon">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const EyeIcon = ({ open }) => open ? (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lr-eye-svg">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
) : (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lr-eye-svg">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="lr-social-svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="#1877F2" className="lr-social-svg">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.12 8.44 9.88v-6.99H7.9v-2.89h2.54V9.8c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.89h-2.33v6.99C18.34 21.12 22 16.99 22 12z" />
  </svg>
);

// ─── Reusable Field + Input ───────────────────────────────────────────────────

function Field({ label, error, children }) {
  return (
    <div className="lr-field">
      {label && <div className="lr-label">{label}</div>}
      {children}
      {error && <span className="lr-error">{error}</span>}
    </div>
  );
}

function Input({ icon: Icon, rightSlot, error, ...props }) {
  return (
    <div className={`lr-input-box${error ? " lr-input-box--err" : ""}`}>
      {Icon && <Icon />}
      <input className="lr-input" {...props} />
      {rightSlot}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LoginRegister() {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("buyer");
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const switchMode = (newMode) => {
  setMode(newMode);
  setErrors({});
};

  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "",
    confirmPassword: "", farmName: "", location: "",
    remember: false, agree: false,
  });
const navigate = useNavigate();
  const set = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    setErrors(p => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (mode === "signup" && !form.name.trim()) e.name = "Full name is required.";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Enter a valid email address.";
    if (form.password.length < 8) e.password = "Minimum 8 characters.";
    if (mode === "signup" && form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match.";
    if (mode === "signup" && role === "vendor" && !form.farmName.trim()) e.farmName = "Farm name is required.";
    if (mode === "signup" && !form.agree) e.agree = "You must agree to continue.";
    return e;
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const errs = validate();
  if (Object.keys(errs).length) {
    setErrors(errs);
    return;
  }

  try {
    const endpoint =
      mode === "login"
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/register";

    // Different payload for login vs signup
    let payload;

    if (mode === "login") {
      payload = {
        email: form.email,
        password: form.password,
        role: role
      };
    } else {
      payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        farmName: form.farmName,
        location: form.location,
        role: role
      };
    }

    console.log("Submitting:", payload);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    console.log("Server response:", data);

    if (!response.ok) {
      alert(data.message || "Authentication failed");
      return;
    }

   // Save token locally
localStorage.setItem("token", data.token);
localStorage.setItem("role", data.role);

setSubmitted(true);

// redirect to dashboard based on role
if (data.role === "buyer") {
  navigate("/buyer/dashboard");
} else if (data.role === "vendor") {
  navigate("/farmer/dashboard");
}

  } catch (error) {
    console.error("Auth error:", error);
    alert("Server connection failed");
  }
};
  // ── Success ─────────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="lr-page">
        <Navbar />
        <main className="lr-main lr-main--center">
          <div className="lr-success">
            <div className="lr-success-ring">✓</div>
            <h2 className="lr-success-title">{mode === "login" ? "Welcome back!" : "Account created!"}</h2>
            <p className="lr-success-sub">
              {mode === "login"
                ? `Signed in as ${role}. Taking you to your dashboard…`
                : `Welcome, ${form.name || form.email}! Your SmartVegies account is ready.`}
            </p>
            <button className="lr-btn-primary" onClick={() => { setSubmitted(false); switchMode("login"); }}>
              Back to Sign In
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Main ────────────────────────────────────────────────────────────────────
  return (
    <div className="lr-page">
      <Navbar />

      <main className="lr-main">
        <div className="lr-card">

          {/* ── LEFT PANEL ── */}
          <div className="lr-panel-left">
            <div className="lr-panel-blob lr-panel-blob--a" />
            <div className="lr-panel-blob lr-panel-blob--b" />

            <div className="lr-panel-inner">
              <div>
                <span className="lr-panel-eyebrow">Farm to table, simplified</span>
                <h2 className="lr-panel-title">
                  Growing together,<br />
                  <span className="lr-panel-accent">delivered fresh.</span>
                </h2>
                <p className="lr-panel-desc">
                  Join thousands of buyers and vendors building a fresher, more connected local food community.
                </p>
              </div>

              <div className="lr-panel-features">
                <div className="lr-panel-feature">
                  <div className="lr-panel-feature-icon">🛒</div>
                  <div>
                    <strong>For Buyers</strong>
                    <p>Farm-fresh produce delivered to your door. Zero hassle, maximum freshness.</p>
                  </div>
                </div>
                <div className="lr-panel-feature">
                  <div className="lr-panel-feature-icon">🌾</div>
                  <div>
                    <strong>For Vendors</strong>
                    <p>Reach thousands of local customers. Manage your store and grow your business.</p>
                  </div>
                </div>
              </div>

              <div className="lr-panel-images">
                <div className="lr-panel-img">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_KJDl0rmVBjQO7JY5zVpt3wmt_Hb8PlGyl9tkdzLf_qOnu-g6xwczYZ3TYr_NZVwQ0zxeGkFFDJI1cCKWxbgbWL48s5blIwYyvXGc5B4w3wLMnhFhrcAEh7FGvz4jN4QKKLiIMKUBj1OBYwSTPJb_cBrGBu1gRukhjgKxkJRTNaDwycDOSAT_WxelPbwMLYjhDpaEl3RVK1Pr5kvmkclINiy2INTq0pDQ7UVk5CxeNAVtpIFp3sq-W_DY2VtsqqGCvyAcALh4Rc7z" alt="Fresh vegetables" />
                </div>
                <div className="lr-panel-img">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuByWtyk-dNs6GkPglZav_4Ntc07eA5J5YBDuq4Vw-EurF34TgQolprQX3QD-UkwBY3QGtuiJuRaJFwRqxtMdX-ZzzL4j9FXjm4CmBB99En_QFUGO1XazcKEX_CViy7l5rWIsaSBCey9jxK54cOfH6lCOb1RaChV0fdcOP3hK_nENz0Wi0DbMQUdO8xFOCdDXAh0uAo14Xga-35DPh6B0tlTlFIlGDdO6OeV4eyVQZcDAa3mKleQqhbPcI7F7ZRGHmf4Atzfprh8IB_l" alt="Market vendor" />
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="lr-panel-right">

            {/* Mode toggle */}
            <div className="lr-toggle">
              <button className={`lr-toggle-btn${mode === "login" ? " lr-toggle-btn--on" : ""}`} onClick={() => switchMode("login")}>Sign In</button>
              <button className={`lr-toggle-btn${mode === "signup" ? " lr-toggle-btn--on" : ""}`} onClick={() => switchMode("signup")}>Create Account</button>
            </div>

            <div className="lr-heading">
              <h2 className="lr-heading-title">{mode === "login" ? "Welcome Back" : "Get Started"}</h2>
              <p className="lr-heading-sub">{mode === "login" ? "Sign in to your SmartVegies account." : "Create your SmartVegies account below."}</p>
            </div>

            {/* Role tabs */}
            <div className="lr-roles">
              <button className={`lr-role${role === "buyer" ? " lr-role--on" : ""}`} onClick={() => { setRole("buyer"); setErrors({}); }}>
                <span>🛒</span> Buyer
              </button>
              <button className={`lr-role${role === "vendor" ? " lr-role--on" : ""}`} onClick={() => { setRole("vendor"); setErrors({}); }}>
                <span>🌾</span> Vendor
              </button>
            </div>

            {/* Form */}
            <form className="lr-form" onSubmit={handleSubmit} noValidate>

              {mode === "signup" && (
                <Field label="Full Name" error={errors.name}>
                  <Input icon={UserIcon} name="name" type="text" placeholder="John Doe" value={form.name} onChange={set} error={errors.name} />
                </Field>
              )}

              {mode === "signup" && role === "vendor" && (
                <>
                  <Field label="Farm / Business Name" error={errors.farmName}>
                    <Input icon={StoreIcon} name="farmName" type="text" placeholder="Green Acres Farm" value={form.farmName} onChange={set} error={errors.farmName} />
                  </Field>
                  <Field label="Location">
                    <Input icon={MapPinIcon} name="location" type="text" placeholder="City, State" value={form.location} onChange={set} />
                  </Field>
                </>
              )}

              {mode === "signup" && (
                <Field label="Phone Number">
                  <Input icon={PhoneIcon} name="phone" type="tel" placeholder="+91 00000 00000" value={form.phone} onChange={set} />
                </Field>
              )}

              <Field label="Email Address" error={errors.email}>
                <Input icon={MailIcon} name="email" type="email" placeholder="name@example.com" value={form.email} onChange={set} error={errors.email} />
              </Field>

              <Field
                label={
                  <div className="lr-label-row">
                    <span>Password</span>
                    {mode === "login" && <a href="#" className="lr-forgot">Forgot password?</a>}
                  </div>
                }
                error={errors.password}
              >
                <Input
                  icon={LockIcon}
                  name="password"
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set}
                  error={errors.password}
                  rightSlot={
                    <button type="button" className="lr-eye-btn" onClick={() => setShowPw(v => !v)}>
                      <EyeIcon open={showPw} />
                    </button>
                  }
                />
              </Field>

              {mode === "signup" && (
                <Field label="Confirm Password" error={errors.confirmPassword}>
                  <Input
                    icon={LockIcon}
                    name="confirmPassword"
                    type={showCpw ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={set}
                    error={errors.confirmPassword}
                    rightSlot={
                      <button type="button" className="lr-eye-btn" onClick={() => setShowCpw(v => !v)}>
                        <EyeIcon open={showCpw} />
                      </button>
                    }
                  />
                </Field>
              )}

              {mode === "login" ? (
                <label className="lr-check-label">
                  <input type="checkbox" name="remember" checked={form.remember} onChange={set} className="lr-check-input" />
                  <span>Remember me for 30 days</span>
                </label>
              ) : (
                <Field error={errors.agree}>
                  <label className="lr-check-label">
                    <input type="checkbox" name="agree" checked={form.agree} onChange={set} className="lr-check-input" />
                    <span>I agree to the <a href="#" className="lr-link">Terms of Service</a> and <a href="#" className="lr-link">Privacy Policy</a></span>
                  </label>
                </Field>
              )}

              <button type="submit" className="lr-btn-primary">
                {mode === "login" ? "Sign In" : `Create ${role === "vendor" ? "Vendor" : "Buyer"} Account`}
              </button>
            </form>

            <div className="lr-divider"><span>or continue with</span></div>

            <div className="lr-socials">
              <button className="lr-social-btn"><GoogleIcon /><span>Google</span></button>
              <button className="lr-social-btn"><FacebookIcon /><span>Facebook</span></button>
            </div>

            <p className="lr-switch">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}
              <button className="lr-switch-btn" onClick={() => switchMode(mode === "login" ? "signup" : "login")}>
                {mode === "login" ? " Sign up" : " Sign in"}
              </button>
            </p>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Navbar() {
  return (
    <header className="lr-navbar">
      <div className="lr-navbar-brand">
        <LeafIcon />
        <span className="lr-navbar-name">SmartVegies</span>
      </div>
      <nav className="lr-navbar-links">
        <a href="#">Our Mission</a>
        <a href="#">How it Works</a>
        <a href="#">Support</a>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="lr-footer">
      <span>© 2024 SmartVegies Inc. All rights reserved.</span>
      <div className="lr-footer-links">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Cookie Settings</a>
      </div>
    </footer>
  );
}