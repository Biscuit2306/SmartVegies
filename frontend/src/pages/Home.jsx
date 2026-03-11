/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import "../styles/home.css";

// ─── Inline SVG Icons ─────────────────────────────────────────────────────────

const LeafIcon = ({ size = 32 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const StoreIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
    <path d="M2 7h20" />
    <path d="M22 7v3a2 2 0 0 1-2 2 2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7" />
  </svg>
);

const PackageSearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" />
    <path d="m7.5 4.27 9 5.15" />
    <polyline points="3.29 7 12 12 20.71 7" />
    <line x1="12" x2="12" y1="22" y2="12" />
    <circle cx="18.5" cy="15.5" r="2.5" />
    <path d="M20.27 17.27 22 19" />
  </svg>
);

const BarChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" x2="18" y1="20" y2="10" />
    <line x1="12" x2="12" y1="20" y2="4" />
    <line x1="6" x2="6" y1="20" y2="14" />
  </svg>
);

const Share2Icon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
    <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

// ─── Sub-components ───────────────────────────────────────────────────────────

const Navbar = () => (
  <header className="hm-navbar">
    <div className="hm-navbar-brand">
      <LeafIcon size={32} />
      <h2>SmartVegies</h2>
    </div>
    <div className="hm-navbar-right">
      <nav className="hm-navbar-links">
        <a href="#how-it-works">How it Works</a>
        <a href="#buyers">For Buyers</a>
        <a href="#vendors">For Vendors</a>
      </nav>
      <div className="hm-navbar-btns">
        <button className="hm-btn hm-btn-primary-sm">Shop Now</button>
        <button className="hm-btn hm-btn-secondary-sm">Start Selling</button>
      </div>
    </div>
    <div className="hm-navbar-menu-icon">
      <MenuIcon />
    </div>
  </header>
);

const Hero = () => (
  <section className="hm-hero">
    <div className="hm-hero-inner">
      <div className="hm-hero-text hm-hero-animate-left">
        <div className="hm-hero-copy">
          <span className="hm-eyebrow">Direct from local farms</span>
          <h1 className="hm-hero-title">
            Freshness Delivered from{" "}
            <span className="hm-text-primary">Local Fields</span> to Your Table
          </h1>
          <p className="hm-hero-desc">
            Connecting you with passionate local vendors for the highest quality
            produce in your neighborhood. Sustainably sourced, carefully
            delivered.
          </p>
        </div>
        <div className="hm-hero-btns">
          <button className="hm-btn hm-btn-hero-primary">Shop Fresh Now</button>
          <button className="hm-btn hm-btn-hero-outline">Start Selling</button>
        </div>
        <div className="hm-hero-social">
          <div className="hm-avatar-stack">
            <div className="hm-avatar hm-avatar-light"></div>
            <div className="hm-avatar hm-avatar-mid"></div>
            <div className="hm-avatar hm-avatar-dark"></div>
          </div>
          <span>Joined by 2,000+ local foodies this month</span>
        </div>
      </div>
      <div
        className="hm-hero-image hm-hero-animate-scale"
        style={{
          "--hm-hero-bg": 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDBicm-SOYkeuB0QkTYSgoJ3hyuaZzQDQ6SWhg9vwfeOPfRJb3CCdmOHCzzx7uzIauShVp3WYs_iaV43i6PocPT8X4shoIIRJQaq5TgKtrjrBZ1ngfdAPUD9Ae44LgTwozUyZvDNY0NV5ptXqP2faheTyV-BTZaWMwbFO_Clvvaa9kXzYHSogsHIj7liFl3WnSeA8kodbkarLLENL8yKlFCbCUA7nwpowKtMgDVqPXQjTODKil0HUs96U235g3Dz-F9NEtLxZAXRhRs")',
        }}
      />
    </div>
  </section>
);

const FeatureCard = ({ number, title, description, image }) => (
  <div className="hm-feature-card">
    <div
      className="hm-card-image"
      style={{ "--hm-card-bg": `url("${image}")` }}
    />
    <div>
      <div className="hm-card-title-row">
        <span className="hm-card-number">{number}</span>
        <h4 className="hm-card-title">{title}</h4>
      </div>
      <p className="hm-card-desc">{description}</p>
    </div>
  </div>
);

const VendorTool = ({ icon: Icon, title, description }) => (
  <div className="hm-vendor-tool">
    <div className="hm-tool-icon">
      <Icon />
    </div>
    <div>
      <h4 className="hm-tool-title">{title}</h4>
      <p className="hm-tool-desc">{description}</p>
    </div>
  </div>
);

const Footer = () => (
  <footer className="hm-footer">
    <div className="hm-footer-inner">
      <div className="hm-footer-brand">
        <div className="hm-footer-brand-title">
          <LeafIcon size={24} />
          <h2>SmartVegies</h2>
        </div>
        <p>
          Connecting communities through fresh, local produce. Quality you can
          trust, delivered with care.
        </p>
        <div className="hm-footer-social">
          <button className="hm-social-btn">
            <Share2Icon />
          </button>
          <button className="hm-social-btn">
            <MailIcon />
          </button>
        </div>
      </div>
      <div className="hm-footer-links">
        <div className="hm-footer-col">
          <h4>Platform</h4>
          <nav>
            <a href="#">How it Works</a>
            <a href="#">Buyers Guide</a>
            <a href="#">Vendor Tools</a>
            <a href="#">Pricing</a>
          </nav>
        </div>
        <div className="hm-footer-col">
          <h4>Company</h4>
          <nav>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Blog</a>
            <a href="#">Contact</a>
          </nav>
        </div>
        <div className="hm-footer-col">
          <h4>Support</h4>
          <nav>
            <a href="#">Help Center</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Safety</a>
          </nav>
        </div>
      </div>
    </div>
    <div className="hm-footer-bottom">
      © 2024 SmartVegies Inc. All rights reserved. Locally sourced. Community
      driven.
    </div>
  </footer>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="hm-app">
      <Navbar />

      <main className="hm-main-content">
        <Hero />

        {/* For Buyers */}
        <section className="hm-section-buyers" id="buyers">
          <div className="hm-section-inner">
            <div className="hm-section-header">
              <h2 className="hm-eyebrow">For Buyers</h2>
              <h3 className="hm-section-title">Simple, Fast & Always Fresh</h3>
              <p className="hm-section-desc">
                Get the best seasonal produce delivered to your door in three
                easy steps.
              </p>
            </div>
            <div className="hm-cards-grid">
              <FeatureCard
                number={1}
                title="Browse Vendors"
                description="Discover highly-rated local farmers and artisans in your immediate area."
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuCEYy2RNzEtXZk0lNKIWlQFCSiM9s_fy0J9HeOuLhAeVsBQcHJSEtSoI5ukL7mfZHY-fCoEFf9fco9L3wlp8USfSM8aA4IYkHOiKo8yPiqietXrUO-9s7hzRBfb51RAw5qltg06smkdUJtJa1_8b92uocZI4v-4jL_HyCRu_OcLhOd-wjmUuyh0hqqy2Xmu9Ev4aYrNHSw9VQAIFxx2nm6pYZZpnVDjBzUmRdV2uY-xqiwzkoSUI9u7g3mjBBo1PfszA9BpG8RsFiHS"
              />
              <FeatureCard
                number={2}
                title="Place Order"
                description="Select your favorites, customize your basket, and pay securely online."
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuAb1JvAgI73QBrQgmaRkjbFZUYHlV20qPKowLRQNM1Sp3Gmv4EsjV4YXJorc9r_-aK3a2jI3n6xjeYpf15XfceiuBkdP2mINvrsodliGbzmJeWLMjgA0COl1DTOBgvANccVxoAMyZXEyfXL5ZPCOxaqdC2p6iMj9nRVo3GPCGXINo9XCp4J81zqJgiTLRHolqZ9yowceTQo8QAK78nbwXpLyoquz9pibeQHMc3xwGhQq4RIpa_m4jtofx9dTSGDmPA1S9QkTZI9TAoX"
              />
              <FeatureCard
                number={3}
                title="Fresh Delivery"
                description="Receive farm-fresh produce at your doorstep within 24 hours of harvest."
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuB8K9qQHjAvH1lKl-MdPafW3qyAUvqt5QHotpczi1ZdF8AB-SM0eVFata6Vo9c1x-NYCixBBTPoFy7S7EUGzvxnZH17xDmkYQsIeYVrT66zR8fyTMSTD-tTVk6-IcuM6YWgOsDjEipm1R1VI92HPh4rOM3pwf2pfdWcRU016Cd2PvZVUq9vsxSbWVqrSy74wsKlrXuTLhp-qraGvk4DOAUa1QN7L4m1MbS3iP_xpmFZIBr3U8ZMsrjzTZq5nrs_6zhMIuCQoEiQc2CA"
              />
            </div>
          </div>
        </section>

        {/* For Vendors */}
        <section className="hm-section-vendors" id="vendors">
          <div className="hm-section-inner">
            <div className="hm-section-header hm-section-header-center">
              <h2 className="hm-eyebrow">For Vendors</h2>
              <h3 className="hm-section-title">
                Empower Your Farm, Grow Your Business
              </h3>
              <p className="hm-section-desc hm-section-desc-wide">
                We provide the digital tools you need to reach thousands of
                customers without the overhead of a traditional storefront.
              </p>
            </div>
            <div className="hm-vendor-tools-grid">
              <VendorTool
                icon={StoreIcon}
                title="Easy Setup"
                description="Launch your digital stall in minutes. Upload photos, set your hours, and start listing products immediately."
              />
              <VendorTool
                icon={PackageSearchIcon}
                title="Smart Inventory"
                description="Real-time stock management. Update availability instantly when items sell out or new crops are ready."
              />
              <VendorTool
                icon={BarChartIcon}
                title="Growth Insights"
                description="Understand your customers better with detailed sales analytics and verified reviews from your community."
              />
            </div>
            <div className="hm-vendor-cta">
              <button className="hm-btn hm-btn-vendor">Apply to Sell</button>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="hm-section-cta">
          <div className="hm-cta-box">
            <div className="hm-cta-pattern"></div>
            <div className="hm-cta-content">
              <h2 className="hm-cta-title">
                Ready to join the{" "}
                <span className="hm-text-primary">local food revolution</span>?
              </h2>
              <p className="hm-cta-desc">
                Whether you're looking for the tastiest tomatoes or looking to
                grow your farm's reach, we've got you covered.
              </p>
              <div className="hm-cta-btns">
                <button className="hm-btn hm-btn-cta-primary">Start Shopping</button>
                <button className="hm-btn hm-btn-cta-outline">
                  Register as Vendor
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}