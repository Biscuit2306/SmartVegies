import React from "react";
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

// Shared Context
import { OrdersProvider } from "./Context/Orderscontext";

function App() {
  return (
    <Router>
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
              </Routes>
            </OrdersProvider>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;