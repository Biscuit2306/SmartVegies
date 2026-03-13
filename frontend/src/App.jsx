import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import LoginRegister from "./pages/LoginRegister";

// Buyer Pages
import BuyerDashboard from "./pages/buyer/BuyerDashboard";
import BuyerMarketplace from "./pages/buyer/BuyerMarketplace";
import BuyerCart from "./pages/buyer/BuyerCart";
import BuyerMyorders from "./pages/buyer/BuyerMyorders";
import Buyerbulkorder from "./pages/buyer/Buyerbulkorder";
import BuyerProfile from "./pages/buyer/BuyerProfile";

// Farmer Pages
import Dashboard from "./pages/farmer/Dashboard";
import Mycrops from "./pages/farmer/Mycrops";
import Orders from "./pages/farmer/Orders";
import BulkRequests from "./pages/farmer/BulkRequests";
import Earnings from "./pages/farmer/Earnings";
import Profile from "./pages/farmer/Profile";
import FarmerPolicies from "./pages/farmer/FarmerPolicies"; // <-- New Policies Page

// Traceability Details
import TraceabilityDetail from "./pages/TraceabilityDetail"; 

// Shared Context
import { OrdersProvider } from "./Context/Orderscontext";

function App() {

  // 1. Load the Google Translate script globally when the App loads
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: "en" },
        "google_translate_element"
      );
    };

    const scriptId = "google-translate-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // 2. Global function to toggle the translation cookie
  const toggleMarathi = () => {
    const isMarathi = document.cookie.includes("googtrans=/en/mr");

    if (isMarathi) {
      document.cookie = "googtrans=/en/en; path=/";
      document.cookie = "googtrans=/en/en; path=/; domain=" + window.location.hostname;
    } else {
      document.cookie = "googtrans=/en/mr; path=/";
      document.cookie = "googtrans=/en/mr; path=/; domain=" + window.location.hostname;
    }
    
    // Reload page to apply translation
    window.location.reload();
  };

  return (
    <Router>
      
      {/* --- GLOBAL TRANSLATE BUTTON --- */}
      <button className="global-translate-btn" onClick={toggleMarathi}>
        मराठी / EN
      </button>
      <div id="google_translate_element" style={{ display: "none" }}></div>
      {/* ------------------------------- */}

      <Routes>

        {/* Main Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginRegister />} />

        {/* Buyer Routes */}
        <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
        <Route path="/buyer/marketplace" element={<BuyerMarketplace />} />
        <Route path="/buyer/cart" element={<BuyerCart />} />
        <Route path="/buyer/orders" element={<BuyerMyorders />} />
        <Route path="/buyer/bulk-order" element={<Buyerbulkorder />} />
        <Route path="/buyer/profile" element={<BuyerProfile />} />

        {/* Farmer Routes — all share the same OrdersProvider instance */}
        <Route
          path="/farmer/*"
          element={
            <OrdersProvider>
              <Routes>
                <Route path="dashboard"      element={<Dashboard />} />
                <Route path="crops"          element={<Mycrops />} />
                <Route path="orders"         element={<Orders />} />
                <Route path="bulk-requests"  element={<BulkRequests />} />
                <Route path="earnings"       element={<Earnings />} />
                <Route path="profile"        element={<Profile />} />
                <Route path="policies"       element={<FarmerPolicies />} />
              </Routes>
            </OrdersProvider>
          }
        />
        
        {/* Traceability Route */}
        <Route path="/trace/:batchId" element={<TraceabilityDetail />} />

      </Routes>
    </Router>
  );
}

export default App;