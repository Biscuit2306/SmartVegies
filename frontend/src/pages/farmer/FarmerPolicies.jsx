import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import "../../styles/farmer-css/dashboard.css"; 
import "../../styles/farmer-css/farmerpolicies.css"; 

// Expanded Data for Policies, Subsidies, Freebies, and Loans with Official Links
const SCHEMES = [
  {
    id: 1,
    type: "policy",
    title: "PM-KISAN (Kisan Samman Nidhi)",
    desc: "Provides assured income support of ₹6,000 per year to all landholding farmer families across the country.",
    benefit: "₹6,000 / Year",
    deadline: "Open All Year",
    link: "https://pmkisan.gov.in/"
  },
  {
    id: 2,
    type: "loan",
    title: "Kisan Credit Card (KCC)",
    desc: "Offers timely credit to farmers to meet their cultivation and agricultural expenses at extremely low-interest rates.",
    benefit: "Up to ₹3 Lakh at 4%",
    deadline: "Apply Anytime",
    link: "https://www.myscheme.gov.in/schemes/kcc"
  },
  {
    id: 3,
    type: "subsidy",
    title: "PM Fasal Bima Yojana (PMFBY)",
    desc: "Comprehensive crop insurance scheme providing financial support to farmers in case of crop failure due to natural calamities.",
    benefit: "Full Insurance Cover",
    deadline: "Before Sowing",
    link: "https://pmfby.gov.in/"
  },
  {
    id: 4,
    type: "subsidy",
    title: "Solar Pump Subsidy (PM-KUSUM)",
    desc: "Huge subsidies for setting up standalone solar pumps and grid-connected solar power plants to reduce electricity costs.",
    benefit: "Up to 60% Subsidy",
    deadline: "State Dependent",
    link: "https://pmkusum.mnre.gov.in/"
  },
  {
    id: 5,
    type: "loan",
    title: "Agriculture Infrastructure Fund",
    desc: "Medium to long term debt financing facility for investment in viable projects for post-harvest management infrastructure.",
    benefit: "3% Interest Subvention",
    deadline: "Open until 2032",
    link: "https://agriinfra.dac.gov.in/"
  },
  {
    id: 6,
    type: "policy",
    title: "Paramparagat Krishi Vikas Yojana",
    desc: "Promotes organic farming through a cluster approach and Participatory Guarantee System certification.",
    benefit: "₹50,000 / Hectare",
    deadline: "Continuous",
    link: "https://pgsindia-ncof.gov.in/pkvy/index.aspx"
  },
  {
    id: 7,
    type: "policy",
    title: "National Agriculture Market (e-NAM)",
    desc: "Pan-India electronic trading portal networking existing APMC mandis to create a unified national market for agricultural commodities.",
    benefit: "Free Market Access",
    deadline: "Open All Year",
    link: "https://enam.gov.in/web/"
  },
  {
    id: 8,
    type: "subsidy",
    title: "Agricultural Mechanization (SMAM)",
    desc: "Subsidies on buying tractors, tillers, and other heavy farming machinery to increase farm productivity.",
    benefit: "40% to 80% Subsidy",
    deadline: "Varies by State",
    link: "https://agrimachinery.nic.in/"
  },
  {
    id: 9,
    type: "loan",
    title: "Dairy Entrepreneurship Scheme",
    desc: "NABARD backed financial assistance to set up modern dairy farms and promote heifer calf rearing.",
    benefit: "25-33% Capital Subsidy",
    deadline: "Subject to funds",
    link: "https://www.nabard.org/"
  },
  {
    id: 10,
    type: "policy",
    title: "Soil Health Card Scheme",
    desc: "Provides farmers with soil nutrient status of their holding and advises them on the dosage of fertilizers.",
    benefit: "Free Soil Testing",
    deadline: "Every 2 Years",
    link: "https://soilhealth.dac.gov.in/"
  },
  {
    id: 11,
    type: "subsidy",
    title: "Pradhan Mantri Krishi Sinchayee Yojana",
    desc: "Subsidy for micro-irrigation systems like drip and sprinkler irrigation to save water and improve yields.",
    benefit: "55% for Small Farmers",
    deadline: "Continuous",
    link: "https://pmksy.gov.in/"
  },
  {
    id: 12,
    type: "loan",
    title: "Agri-Clinics and Agri-Business Centres",
    desc: "Loans and subsidies for agriculture graduates to set up advisory services or commercial agribusinesses.",
    benefit: "36% - 44% Subsidy",
    deadline: "Apply Anytime",
    link: "https://www.agriclinics.net/"
  },
  {
    id: 13,
    type: "subsidy",
    title: "PM Matsya Sampada Yojana (PMMSY)",
    desc: "Financial assistance and subsidies for fish farmers to modernize aquaculture and improve fisheries infrastructure.",
    benefit: "40-60% Project Subsidy",
    deadline: "Open All Year",
    link: "https://pmmsy.dof.gov.in/"
  },
  {
    id: 14,
    type: "subsidy",
    title: "Gramin Bhandaran Yojana",
    desc: "Capital investment subsidy scheme for the construction and renovation of rural godowns to prevent distress sale of produce.",
    benefit: "15% - 33% Subsidy",
    deadline: "Varies by State",
    link: "https://www.nabard.org/"
  },
  {
    id: 15,
    type: "loan",
    title: "Interest Subvention Scheme (ISS)",
    desc: "Provides short-term crop loans up to ₹3 lakh to farmers at a concessional interest rate of 7% per annum.",
    benefit: "3% Extra Subvention",
    deadline: "Apply Seasonally",
    link: "https://rbi.org.in/"
  },
  {
    id: 16,
    type: "policy",
    title: "Krishi Udan Yojana",
    desc: "Aims to assist farmers in transporting agricultural products so that it improves their value realization.",
    benefit: "Freight Support",
    deadline: "Continuous",
    link: "https://www.civilaviation.gov.in/"
  },
  {
    id: 17,
    type: "subsidy",
    title: "National Beekeeping & Honey Mission",
    desc: "Financial support for women's groups and farmers to start beekeeping and honey production businesses.",
    benefit: "Up to 85% Subsidy",
    deadline: "Open All Year",
    link: "https://nbb.gov.in/"
  },
  {
    id: 18,
    type: "policy",
    title: "Rashtriya Gokul Mission",
    desc: "Aims to conserve and develop indigenous bovine breeds and distribute disease-free high genetic merit bulls.",
    benefit: "Free Breed Support",
    deadline: "Continuous",
    link: "https://dahd.nic.in/rashtriya-gokul-mission"
  },
  {
    id: 19,
    type: "loan",
    title: "MUDRA Loan for Allied Agri",
    desc: "Collateral-free loans for non-corporate small businesses in allied agricultural activities (poultry, dairy, beekeeping).",
    benefit: "Up to ₹10 Lakhs",
    deadline: "Apply Anytime",
    link: "https://www.mudra.org.in/"
  },
  {
    id: 20,
    type: "subsidy",
    title: "Seed Village Programme",
    desc: "Aims at upgrading the quality of farmer-saved seeds. Distributes foundation/certified seeds at subsidized rates.",
    benefit: "50% Seed Subsidy",
    deadline: "Pre-Monsoon",
    link: "https://seednet.gov.in/"
  },
  {
    id: 21,
    type: "loan",
    title: "Stand-Up India Scheme (Agri)",
    desc: "Facilitates bank loans for SC/ST and women entrepreneurs setting up greenfield agricultural or processing enterprises.",
    benefit: "₹10 Lakh - ₹1 Crore",
    deadline: "Apply Anytime",
    link: "https://www.standupmitra.in/"
  },
  {
    id: 22,
    type: "policy",
    title: "Pashu Sanjeevani",
    desc: "Provision of 'Nakul Swasthya Patra' (Animal Health Cards) and UID identification of animals in milk.",
    benefit: "Free Animal Tracking",
    deadline: "Continuous",
    link: "https://dahd.nic.in/"
  }
];

export default function FarmerPolicies() {
  const [filter, setFilter] = useState("all");
  const [searchVal, setSearchVal] = useState("");

  // Filter schemes based on active tab and search input
  const filteredSchemes = SCHEMES.filter((scheme) => {
    const matchesFilter = filter === "all" ? true : scheme.type === filter;
    const matchesSearch = scheme.title.toLowerCase().includes(searchVal.toLowerCase()) || 
                          scheme.desc.toLowerCase().includes(searchVal.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
          
          {/* ---> DASHBOARD STYLE HEADER <--- */}
          <div className="svd__header" style={{ marginBottom: '24px' }}>
            <div className="svd__header-text">
              <h1>Government Schemes & Financial Aid</h1>
              <p>Discover policies, claim subsidies, and apply for low-interest loans directly.</p>
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
            {filteredSchemes.length > 0 ? (
              filteredSchemes.map((scheme) => (
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

                  {/* Button directly opens the official link */}
                  <button 
                    className="fp-apply-btn"
                    onClick={() => window.open(scheme.link, "_blank", "noopener,noreferrer")}
                  >
                    Learn More & Apply
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </div>
              ))
            ) : (
              <p style={{ color: "#7a9a7a", marginTop: "20px" }}>No schemes found matching your search.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}