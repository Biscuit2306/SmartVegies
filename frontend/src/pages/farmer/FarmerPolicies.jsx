import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import "../../styles/farmer-css/dashboard.css"; // Imported for layout and topbar styles
import "../../styles/farmer-css/farmerpolicies.css"; // Specific styles for policies

// Dummy Data for Policies, Subsidies, and Loans
const SCHEMES = [
  {
    id: 1,
    type: "policy",
    title: "PM-KISAN (Kisan Samman Nidhi)",
    desc: "Provides assured income support of ₹6,000 per year to all landholding farmer families.",
    benefit: "₹6,000 / Year",
    deadline: "Open All Year",
  },
  {
    id: 2,
    type: "loan",
    title: "Kisan Credit Card (KCC)",
    desc: "Offers timely credit to farmers to meet their cultivation and agricultural expenses at low interest rates.",
    benefit: "Up to ₹3 Lakh at 4%",
    deadline: "Apply Anytime",
  },
  {
    id: 3,
    type: "subsidy",
    title: "PM Fasal Bima Yojana (PMFBY)",
    desc: "Crop insurance scheme providing financial support to farmers in case of crop failure due to natural calamities.",
    benefit: "Insurance Cover",
    deadline: "Before Sowing",
  },
  {
    id: 4,
    type: "subsidy",
    title: "Solar Pump Subsidy (PM-KUSUM)",
    desc: "Subsidy for setting up standalone solar pumps and grid-connected solar power plants.",
    benefit: "Up to 60% Subsidy",
    deadline: "State Dependent",
  },
  {
    id: 5,
    type: "loan",
    title: "Agri Infrastructure Fund",
    desc: "Financing facility for investment in viable projects for post-harvest management infrastructure.",
    benefit: "3% Interest Subvention",
    deadline: "2032",
  },
  {
    id: 6,
    type: "policy",
    title: "Paramparagat Krishi Vikas Yojana",
    desc: "Promotes organic farming through a cluster approach and Participatory Guarantee System certification.",
    benefit: "₹50,000 / Hectare",
    deadline: "Continuous",
  }
];

export default function FarmerPolicies() {
  const [filter, setFilter] = useState("all");
  const [searchVal, setSearchVal] = useState("");

  // Filter schemes based on active tab
  const filteredSchemes = SCHEMES.filter((scheme) => 
    filter === "all" ? true : scheme.type === filter
  );

  return (
    <div className="svd__layout">
      {/* 1. Standard Farmer Sidebar */}
      <Sidebar />

      <div className="svd__main">
        {/* 2. Standard Topbar (Navigation) */}
        <header className="svd__topbar">
          <div className="svd__search-wrap">
            <svg className="svd__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="svd__search-input"
              type="text"
              placeholder="Search policies, subsidies, or loans..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
            />
          </div>

          <div className="svd__topbar-right">
            <button className="svd__notif-btn" title="Notifications">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <span className="svd__notif-dot" />
            </button>

            <div className="svd__vendor-info">
              <div className="svd__vendor-text">
                <div className="svd__vendor-name">GreenFarm Organics</div>
                <div className="svd__vendor-tier">Premium Vendor</div>
              </div>
              <div className="svd__vendor-avatar">GO</div>
            </div>
          </div>
        </header>

        {/* 3. Page Content */}
        <main className="svd__content">
          <div className="fp-header">
            <div>
              <h1>Government Schemes & Financial Aid</h1>
              <p>Discover policies, claim subsidies, and apply for low-interest loans.</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="fp-tabs">
            <button 
              className={`fp-tab-btn ${filter === "all" ? "active" : ""}`} 
              onClick={() => setFilter("all")}
            >
              All Info
            </button>
            <button 
              className={`fp-tab-btn ${filter === "policy" ? "active" : ""}`} 
              onClick={() => setFilter("policy")}
            >
              Govt Policies
            </button>
            <button 
              className={`fp-tab-btn ${filter === "subsidy" ? "active" : ""}`} 
              onClick={() => setFilter("subsidy")}
            >
              Subsidies & Freebies
            </button>
            <button 
              className={`fp-tab-btn ${filter === "loan" ? "active" : ""}`} 
              onClick={() => setFilter("loan")}
            >
              Agri Loans
            </button>
          </div>

          {/* Cards Grid */}
          <div className="fp-grid">
            {filteredSchemes.map((scheme) => (
              <div key={scheme.id} className="fp-card">
                <div className="fp-card-header">
                  <span className={`fp-badge badge-${scheme.type}`}>
                    {scheme.type}
                  </span>
                </div>
                
                <h3 className="fp-title">{scheme.title}</h3>
                <p className="fp-desc">{scheme.desc}</p>
                
                <div className="fp-meta">
                  <div className="fp-meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    {scheme.benefit}
                  </div>
                  <div className="fp-meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    {scheme.deadline}
                  </div>
                </div>

                <button 
                  className="fp-apply-btn"
                  onClick={() => alert(`Redirecting to official portal for ${scheme.title}...`)}
                >
                  Learn More & Apply
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}