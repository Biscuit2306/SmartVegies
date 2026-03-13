import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BuyerFarmMap from "../../components/BuyerFarmMap";

// ─── Inline Map Icon (Moved OUTSIDE of the CSS string) ────────────────────────
const MapPinIcon = ({ size = 20 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

.svbd__layout{display:flex;min-height:100vh;background:#f4faf2;font-family:'Nunito',sans-serif;}

/* ── SIDEBAR & MAIN CSS ── */
.svbd__sidebar{width:222px;min-width:222px;height:100vh;background:linear-gradient(170deg,#56d828 0%,#3cba22 45%,#2b9215 100%);display:flex;flex-direction:column;position:sticky;top:0;overflow:hidden;font-family:'Nunito',sans-serif;box-shadow:3px 0 20px rgba(50,170,20,0.30);flex-shrink:0;}
.svbd__sidebar::before{content:'';position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 80% 8%,rgba(255,255,255,0.12) 0%,transparent 55%),radial-gradient(circle at 10% 92%,rgba(0,0,0,0.06) 0%,transparent 50%);}
.svbd__brand{display:flex;align-items:center;gap:10px;padding:20px 18px 16px;cursor:pointer;position:relative;z-index:1;}
.svbd__brand-logo{width:34px;height:34px;border-radius:9px;background:rgba(255,255,255,0.22);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;}
.svbd__brand-name{font-size:17px;font-weight:900;color:white;letter-spacing:-0.3px;}
.svbd__nav{display:flex;flex-direction:column;gap:2px;padding:6px 10px;position:relative;z-index:1;}
.svbd__nav-btn{display:flex;align-items:center;gap:11px;padding:11px 13px;border-radius:13px;border:none;background:transparent;color:rgba(255,255,255,0.72);cursor:pointer;width:100%;text-align:left;font-family:'Nunito',sans-serif;font-size:14px;font-weight:700;transition:all 0.15s ease;}
.svbd__nav-btn:hover{background:rgba(255,255,255,0.16);color:white;}
.svbd__nav-btn.svbd__active{background:rgba(255,255,255,0.24)!important;color:white!important;box-shadow:0 2px 12px rgba(0,0,0,0.10);}
.svbd__nav-icon{width:19px;height:19px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.svbd__nav-icon svg{width:19px;height:19px;}
.svbd__nav-label{font-size:14px;font-weight:700;line-height:1;}
.svbd__nav-badge{margin-left:auto;background:white;color:#3cba22;font-size:10px;font-weight:900;min-width:18px;height:18px;border-radius:9px;padding:0 5px;display:flex;align-items:center;justify-content:center;}
.svbd__spacer{flex:1;}
.svbd__wallet{margin:0 12px 20px;background:rgba(0,0,0,0.20);border-radius:16px;padding:16px 18px;border:1px solid rgba(255,255,255,0.20);position:relative;z-index:1;}
.svbd__wallet-lbl{font-size:10px;font-weight:800;letter-spacing:1.1px;text-transform:uppercase;color:rgba(255,255,255,0.65);margin-bottom:5px;}
.svbd__wallet-amt{font-size:24px;font-weight:900;color:white;letter-spacing:-0.5px;margin-bottom:13px;}
.svbd__wallet-btn{width:100%;padding:9px;border-radius:10px;border:none;background:white;color:#2a8a14;font-family:'Nunito',sans-serif;font-size:13px;font-weight:800;cursor:pointer;transition:all 0.18s;}
.svbd__wallet-btn:hover{background:#f0fff0;transform:translateY(-1px);box-shadow:0 4px 14px rgba(0,0,0,0.14);}

.svbd__main{flex:1;display:flex;flex-direction:column;min-width:0;overflow-x:hidden;}
.svbd__topbar{display:flex;align-items:center;justify-content:space-between;padding:12px 28px;background:#fff;border-bottom:1px solid #e4f0e0;position:sticky;top:0;z-index:100;gap:14px;}
.svbd__search-wrap{position:relative;flex:1;max-width:420px;}
.svbd__search-ic{position:absolute;left:13px;top:50%;transform:translateY(-50%);width:15px;height:15px;color:#a0c4a0;pointer-events:none;}
.svbd__search-ic svg{width:15px;height:15px;}
.svbd__search{width:100%;padding:9px 16px 9px 38px;border:1.5px solid #ddeeda;border-radius:24px;font-family:'Nunito',sans-serif;font-size:13.5px;font-weight:500;color:#2c4a2c;background:#f4faf2;outline:none;transition:border-color 0.18s,box-shadow 0.18s;}
.svbd__search::placeholder{color:#a8c8a8;}
.svbd__search:focus{border-color:#4cd626;background:white;box-shadow:0 0 0 3px rgba(76,214,38,0.12);}
.svbd__topbar-right{display:flex;align-items:center;gap:12px;}
.svbd__notif-btn{position:relative;width:38px;height:38px;border-radius:12px;border:1.5px solid #ddeeda;background:white;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#5a8a5a;transition:all 0.18s;}
.svbd__notif-btn:hover{border-color:#4cd626;background:#f0fff0;}
.svbd__notif-dot{position:absolute;top:7px;right:7px;width:7px;height:7px;background:#e05252;border-radius:50%;border:1.5px solid white;}
.svbd__avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#4cd626,#2e9918);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:900;color:white;border:2px solid #c8ecc0;cursor:pointer;}
.svbd__content{flex:1;padding:24px 28px 28px;display:flex;flex-direction:column;gap:22px;}
.svbd__welcome-row{display:flex;align-items:center;justify-content:space-between;gap:16px;animation:svbd-up 0.35s ease both;}
.svbd__welcome-h{font-size:26px;font-weight:900;color:#1a3a1a;margin-bottom:4px;letter-spacing:-0.5px;}
.svbd__welcome-sub{font-size:13.5px;color:#7aaa7a;font-weight:600;}
.svbd__points-pill{display:flex;align-items:center;gap:8px;padding:10px 18px;border-radius:24px;background:#fffbe6;border:1.5px solid #f0d060;font-size:14px;font-weight:900;color:#8a6a10;white-space:nowrap;cursor:pointer;transition:transform 0.18s,box-shadow 0.18s;}
.svbd__points-pill:hover{transform:translateY(-2px);box-shadow:0 4px 14px rgba(240,200,0,0.22);}
.svbd__points-coin{width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,#f5c518,#e0a000);display:flex;align-items:center;justify-content:center;font-size:12px;}

.svbd__two-col{display:grid;grid-template-columns:1fr 284px;gap:20px;align-items:start;}
.svbd__left{display:flex;flex-direction:column;gap:22px;}
.svbd__right{display:flex;flex-direction:column;gap:16px;}

.svbd__sec-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;}
.svbd__sec-title{display:flex;align-items:center;gap:8px;font-size:15.5px;font-weight:900;color:#1a3a1a;}
.svbd__sec-title svg{width:18px;height:18px;}
.svbd__view-all{font-family:'Nunito',sans-serif;font-size:13.5px;font-weight:800;color:#3cba22;background:none;border:none;cursor:pointer;padding:0;transition:color 0.15s;}
.svbd__view-all:hover{color:#2a8a14;}

.svbd__products-section{animation:svbd-up 0.4s ease 0.05s both;}
.svbd__products-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
.svbd__product-card{background:white;border-radius:18px;border:1.5px solid #e4f0e0;overflow:hidden;transition:transform 0.2s,box-shadow 0.2s;cursor:pointer;}
.svbd__product-card:hover{transform:translateY(-3px);box-shadow:0 10px 28px rgba(60,185,33,0.14);}
.svbd__product-img{position:relative;height:150px;background:linear-gradient(135deg,#f0f9ec,#e4f4de);display:flex;align-items:center;justify-content:center;font-size:64px;}
.svbd__wish-btn{position:absolute;top:10px;right:10px;width:30px;height:30px;border-radius:50%;border:none;background:white;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.12);transition:transform 0.18s;font-size:15px;}
.svbd__wish-btn:hover{transform:scale(1.18);}
.svbd__product-info{padding:12px 14px 14px;}
.svbd__product-name{font-size:14.5px;font-weight:900;color:#1a3a1a;margin-bottom:2px;line-height:1.3;}
.svbd__product-farm{font-size:11.5px;color:#9aaa9a;font-weight:600;margin-bottom:10px;}
.svbd__product-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;}
.svbd__product-price{font-size:15.5px;font-weight:900;color:#3cba22;}
.svbd__cart-btn{width:36px;height:36px;border-radius:50%;border:none;background:linear-gradient(135deg,#5ae030,#3cba22);color:white;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.18s;box-shadow:0 3px 10px rgba(60,185,33,0.38);flex-shrink:0;}
.svbd__cart-btn:hover{transform:scale(1.12);box-shadow:0 5px 16px rgba(60,185,33,0.52);}
.svbd__cart-btn svg{width:16px;height:16px;}
.svbd__cart-btn.svbd__done{background:linear-gradient(135deg,#1a8a00,#0f6600)!important;}

.svbd__orders-section{animation:svbd-up 0.4s ease 0.1s both;}
.svbd__orders-card{background:white;border-radius:16px;border:1.5px solid #e4f0e0;overflow:hidden;}
.svbd__otable{width:100%;border-collapse:collapse;}
.svbd__otable thead tr{border-bottom:1.5px solid #eaf4e6;background:#fafdf8;}
.svbd__otable thead th{padding:11px 16px;text-align:left;font-size:10.5px;font-weight:800;letter-spacing:0.7px;text-transform:uppercase;color:#9aaa9a;}
.svbd__otable thead th:first-child{padding-left:20px;}
.svbd__otable thead th:last-child{padding-right:20px;}
.svbd__otable tbody tr{border-bottom:1px solid #f0f8ec;transition:background 0.15s;}
.svbd__otable tbody tr:last-child{border-bottom:none;}
.svbd__otable tbody tr:hover{background:#fafdf8;}
.svbd__otable tbody td{padding:14px 16px;font-size:13px;color:#3a5a3a;vertical-align:middle;}
.svbd__otable tbody td:first-child{padding-left:20px;}
.svbd__otable tbody td:last-child{padding-right:20px;}
.svbd__oid{font-size:12.5px;font-weight:800;color:#1a3a1a;}
.svbd__ovendor{font-weight:700;}
.svbd__odate{font-size:12.5px;color:#9aaa9a;}
.svbd__oamt{font-weight:900;color:#1a3a1a;}
.svbd__ostatus{display:inline-flex;align-items:center;gap:5px;padding:4px 11px;border-radius:20px;font-size:11px;font-weight:800;}
.svbd__ostatus.svbd__delivered{background:#eef7ec;color:#2a7a18;}
.svbd__ostatus.svbd__transit{background:#e8f0fb;color:#3d72d4;}
.svbd__ostatus.svbd__processing{background:#fef5e7;color:#c07a20;}
.svbd__ostatus.svbd__cancelled{background:#f4f4f4;color:#888;}
.svbd__sdot{width:6px;height:6px;border-radius:50%;}
.svbd__ostatus.svbd__delivered .svbd__sdot{background:#2a7a18;}
.svbd__ostatus.svbd__transit .svbd__sdot{background:#3d72d4;}
.svbd__ostatus.svbd__processing .svbd__sdot{background:#c07a20;}
.svbd__ostatus.svbd__cancelled .svbd__sdot{background:#888;}
.svbd__orders-foot{display:flex;align-items:center;justify-content:center;padding:14px 20px;border-top:1px solid #eaf4e6;}
.svbd__dl-btn{display:flex;align-items:center;gap:7px;font-family:'Nunito',sans-serif;font-size:13.5px;font-weight:800;color:#3cba22;background:none;border:none;cursor:pointer;transition:color 0.15s;}
.svbd__dl-btn:hover{color:#2a8a14;}
.svbd__dl-btn svg{width:15px;height:15px;}

.svbd__delivery-card{background:white;border-radius:16px;border:1.5px solid #e4f0e0;padding:16px;animation:svbd-up 0.4s ease 0.08s both;}
.svbd__delivery-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
.svbd__delivery-title{display:flex;align-items:center;gap:7px;font-size:14px;font-weight:900;color:#1a3a1a;}
.svbd__delivery-title svg{width:17px;height:17px;color:#3cba22;}
.svbd__arriving-tag{font-size:10px;font-weight:800;letter-spacing:0.5px;text-transform:uppercase;color:#3cba22;background:#eef7ec;padding:3px 9px;border-radius:20px;}
.svbd__map-area{width:100%;height:112px;border-radius:12px;background:linear-gradient(135deg,#c8e0c4,#b8d4b0,#d8ecd4);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;margin-bottom:14px;}
.svbd__map-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.3) 1px,transparent 1px);background-size:22px 22px;}
.svbd__map-pin{position:absolute;top:50%;left:55%;transform:translate(-50%,-50%);width:30px;height:30px;border-radius:50%;background:white;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(0,0,0,0.2);font-size:15px;z-index:1;}
.svbd__delivery-row{display:flex;align-items:center;justify-content:space-between;gap:10px;}
.svbd__est-label{font-size:10px;color:#9aaa9a;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;margin-bottom:3px;}
.svbd__est-time{font-size:14px;font-weight:900;color:#1a3a1a;}
.svbd__track-btn{padding:9px 20px;border:none;border-radius:10px;background:linear-gradient(135deg,#55d626,#3cba22);font-family:'Nunito',sans-serif;font-size:13px;font-weight:800;color:white;cursor:pointer;transition:all 0.18s;box-shadow:0 3px 10px rgba(60,185,33,0.32);white-space:nowrap;}
.svbd__track-btn:hover{transform:translateY(-1px);box-shadow:0 5px 14px rgba(60,185,33,0.45);}

.svbd__vendors-card{background:white;border-radius:16px;border:1.5px solid #e4f0e0;padding:16px;animation:svbd-up 0.4s ease 0.13s both;}
.svbd__vendors-title{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:900;color:#1a3a1a;margin-bottom:12px;}
.svbd__vendors-title svg{width:16px;height:16px;color:#3cba22;}
.svbd__vendor-row{display:flex;align-items:center;gap:11px;padding:10px 8px;border-radius:12px;cursor:pointer;transition:background 0.15s;border-bottom:1px solid #f0f8ec;}
.svbd__vendor-row:last-child{border-bottom:none;}
.svbd__vendor-row:hover{background:#f5fdf2;}
.svbd__vendor-thumb{width:42px;height:42px;border-radius:12px;background:#eef7ec;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;border:1.5px solid #d4ecd0;}
.svbd__vendor-info{flex:1;min-width:0;}
.svbd__vendor-name{font-size:13px;font-weight:800;color:#1a3a1a;margin-bottom:2px;}
.svbd__vendor-meta{display:flex;align-items:center;gap:5px;font-size:11.5px;color:#9aaa9a;font-weight:600;}
.svbd__vrating{color:#f0b020;font-weight:800;}
.svbd__varrow{width:18px;height:18px;color:#c8dcc8;flex-shrink:0;}

.svbd__eco-card{border-radius:16px;padding:20px;position:relative;overflow:hidden;background:linear-gradient(145deg,#55d626 0%,#3cba22 55%,#2a8a14 100%);animation:svbd-up 0.4s ease 0.18s both;}
.svbd__eco-card::before{content:'';position:absolute;bottom:-25px;right:-25px;width:110px;height:110px;border-radius:50%;background:rgba(255,255,255,0.10);}
.svbd__eco-card::after{content:'';position:absolute;top:-35px;right:15px;width:90px;height:90px;border-radius:50%;background:rgba(255,255,255,0.07);}
.svbd__eco-icon{width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,0.22);display:flex;align-items:center;justify-content:center;font-size:20px;margin-bottom:10px;position:relative;z-index:1;}
.svbd__eco-title{font-size:20px;font-weight:900;color:white;margin-bottom:8px;position:relative;z-index:1;}
.svbd__eco-text{font-size:13px;color:rgba(255,255,255,0.88);font-weight:600;line-height:1.55;margin-bottom:16px;position:relative;z-index:1;}
.svbd__eco-btn{width:100%;padding:11px;border-radius:11px;border:2px solid rgba(255,255,255,0.65);background:white;font-family:'Nunito',sans-serif;font-size:13.5px;font-weight:800;color:#2a7a14;cursor:pointer;transition:all 0.18s;position:relative;z-index:1;}
.svbd__eco-btn:hover{background:#f0fff0;transform:translateY(-1px);}

.svbd__footer{display:flex;align-items:center;justify-content:space-between;padding:14px 28px;border-top:1px solid #e4f0e0;background:white;flex-wrap:wrap;gap:8px;}
.svbd__footer-copy{font-size:12px;color:#9aaa9a;font-weight:600;}
.svbd__footer-links{display:flex;gap:20px;}
.svbd__flink{font-family:'Nunito',sans-serif;font-size:11.5px;font-weight:800;letter-spacing:0.5px;text-transform:uppercase;color:#7a9a7a;background:none;border:none;cursor:pointer;transition:color 0.15s;padding:0;}
.svbd__flink:hover{color:#3cba22;}

.svbd__toast{position:fixed;bottom:28px;right:28px;background:#2a6a14;color:white;padding:12px 18px;border-radius:12px;font-size:13.5px;font-weight:700;box-shadow:0 8px 24px rgba(0,0,0,0.18);display:flex;align-items:center;gap:8px;z-index:10000;animation:svbd-slide-r 0.3s ease;font-family:'Nunito',sans-serif;}
.svbd__toast svg{width:15px;height:15px;}

@keyframes svbd-up{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes svbd-slide-r{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
@media(max-width:1100px){.svbd__two-col{grid-template-columns:1fr}}
@media(max-width:700px){.svbd__content{padding:16px}.svbd__products-grid{grid-template-columns:1fr 1fr}}

/* ========================================================
   MAP MODAL & FLOATING BUTTON CSS
   ======================================================== */
.svbd__floating-map-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;          /* Equal width and height for a circle */
  height: 50px;         /* Equal width and height for a circle */
  border-radius: 50%;   /* Makes it a perfect circle */
  background: #d4f5d4;  /* Light green background */
  color: #2a8a14;       /* Dark green color for the icon */
  border: 2px solid #b1e8b1; /* Soft green border */
  box-shadow: 0 6px 20px rgba(42, 138, 20, 0.25);
  cursor: pointer;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;
}

.svbd__floating-map-btn:hover {
  transform: translateY(-4px) scale(1.05);
  background: #c0f0c0;  /* Slightly darker light-green on hover */
  box-shadow: 0 8px 25px rgba(42, 138, 20, 0.4);
  color: #1a5c0b;
}

.map-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.85);
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.map-modal-content {
  background: white;
  width: 90%;
  max-width: 900px;
  height: 85vh;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.map-modal-header {
  padding: 15px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fcf8;
  border-bottom: 1px solid #ddd;
}

.dashboard-leaflet-container {
  flex-grow: 1;
  width: 100%;
  min-height: 500px; /* REQUIRED FOR LEAFLET TO BE VISIBLE */
  height: 100%;
}

.close-map-btn {
  font-size: 30px;
  border: none;
  background: none;
  cursor: pointer;
}

.filter-group select {
  margin-left: 10px;
  padding: 5px;
  border-radius: 5px;
}
`;

const PRODUCTS = [
  { id:1, name:"Organic Broccoli", vendor:"Green Valley Farms", price:"$3.99/kg", emoji:"🥦", liked:false },
  { id:2, name:"Sweet Carrots",    vendor:"Sunshine Acres",     price:"$2.49/lb", emoji:"🥕", liked:true  },
  { id:3, name:"Cherry Tomatoes",  vendor:"Hillside Organic",   price:"$4.50/pk", emoji:"🍅", liked:false },
];
const ORDERS = [
  { id:"#SV-84920", vendor:"Green Valley Farms", date:"Oct 24, 2023", status:"delivered",  amt:"$32.40" },
  { id:"#SV-84811", vendor:"Sunshine Acres",     date:"Oct 21, 2023", status:"transit",    amt:"$18.90" },
  { id:"#SV-84790", vendor:"Hillside Organic",   date:"Oct 18, 2023", status:"delivered",  amt:"$51.20" },
  { id:"#SV-84750", vendor:"Root & Vine Co.",    date:"Oct 14, 2023", status:"processing", amt:"$22.00" },
];
const STATUS_LABEL = { delivered:"Delivered", transit:"In Transit", processing:"Processing", cancelled:"Cancelled" };
const VENDORS = [
  { name:"Green Valley Farms", rating:"4.9", dist:"12 mins away", emoji:"🌾" },
  { name:"Sunshine Acres",     rating:"4.7", dist:"5 miles away",  emoji:"☀️" },
];
const NAV_ITEMS = [
  { label:"Dashboard",    path:"/buyer/dashboard" },
  { label:"Marketplace",  path:"/buyer/marketplace" },
  { label:"Cart",         path:"/buyer/cart", badge:3 },
  { label:"My Orders",    path:"/buyer/orders" },
  { label:"Bulk Order",   path:"/buyer/bulk-order" },
  { label:"Profile",      path:"/buyer/profile" },
];

const Toast = ({ msg, onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="svbd__toast">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      {msg}
    </div>
  );
};

export default function BuyerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState(PRODUCTS);
  const [cartDone, setCartDone] = useState({});
  const [toast,    setToast]    = useState(null);
  const [search,   setSearch]   = useState("");
  
  // --- STATE FOR MAP ---
  const [showMap, setShowMap] = useState(false);

  const fire = (msg) => setToast(msg);
  const toggleLike = (id) => setProducts(p => p.map(x => x.id===id ? {...x,liked:!x.liked} : x));
  const addCart = (p) => {
    if (cartDone[p.id]) return;
    setCartDone(prev => ({...prev,[p.id]:true}));
    fire(`${p.name} added to cart!`);
    setTimeout(() => setCartDone(prev => ({...prev,[p.id]:false})), 2000);
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="svbd__layout">
        <aside className="svbd__sidebar">
          <div className="svbd__brand" onClick={() => navigate("/buyer/dashboard")}>
            <div className="svbd__brand-logo">🌿</div>
            <span className="svbd__brand-name">SmartVegies</span>
          </div>

          <nav className="svbd__nav">
            {NAV_ITEMS.map(item => (
              <button
                key={item.label}
                className={`svbd__nav-btn ${location.pathname===item.path ? "svbd__active" : ""}`}
                onClick={() => navigate(item.path)}
              >
                <span className="svbd__nav-icon">
                  {item.label==="Dashboard"    && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>}
                  {item.label==="Marketplace"  && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
                  {item.label==="Cart"         && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>}
                  {item.label==="My Orders"    && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>}
                  {item.label==="Bulk Order"   && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>}
                  {item.label==="Profile"      && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
                </span>
                <span className="svbd__nav-label">{item.label}</span>
                {item.badge && <span className="svbd__nav-badge">{item.badge}</span>}
              </button>
            ))}
          </nav>
          <div className="svbd__spacer"/>
          <div className="svbd__wallet">
            <div className="svbd__wallet-lbl">Current Balance</div>
            <div className="svbd__wallet-amt">$142.50</div>
            <button className="svbd__wallet-btn" onClick={() => fire("Top Up opened!")}>Top Up Wallet</button>
          </div>
        </aside>

        <div className="svbd__main">
          <header className="svbd__topbar">
            <div className="svbd__search-wrap">
              <span className="svbd__search-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
              <input className="svbd__search" placeholder="Search fresh produce, vendors, or recipes..." value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
            <div className="svbd__topbar-right">
              <button className="svbd__notif-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                <span className="svbd__notif-dot"/>
              </button>
              <div className="svbd__avatar">AL</div>
            </div>
          </header>

          <main className="svbd__content">
            <div className="svbd__welcome-row">
              <div>
                <h1 className="svbd__welcome-h">Welcome back, Alex! 👋</h1>
                <p className="svbd__welcome-sub">Ready for some fresh greens today?</p>
              </div>
              <div className="svbd__points-pill">
                <div className="svbd__points-coin">⭐</div>
                2,840 Points
              </div>
            </div>

            <div className="svbd__two-col">
              <div className="svbd__left">
                <div className="svbd__products-section">
                  <div className="svbd__sec-hd">
                    <div className="svbd__sec-title">
                      <svg viewBox="0 0 24 24" fill="#e05252" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                      Recommended for You
                    </div>
                    <button className="svbd__view-all" onClick={() => fire("Opening Marketplace...")}>View All</button>
                  </div>
                  <div className="svbd__products-grid">
                    {products.map(p => (
                      <div key={p.id} className="svbd__product-card">
                        <div className="svbd__product-img">
                          {p.emoji}
                          <button className="svbd__wish-btn" onClick={()=>toggleLike(p.id)}>{p.liked?"❤️":"🤍"}</button>
                        </div>
                        <div className="svbd__product-info">
                          <div className="svbd__product-name">{p.name}</div>
                          <div className="svbd__product-farm">{p.vendor}</div>
                          <div className="svbd__product-foot">
                            <span className="svbd__product-price">{p.price}</span>
                            <button className={`svbd__cart-btn ${cartDone[p.id]?"svbd__done":""}`} onClick={()=>addCart(p)}>
                              {cartDone[p.id]
                                ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                                : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="svbd__orders-section">
                  <div className="svbd__sec-hd">
                    <div className="svbd__sec-title">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#3cba22" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                      Recent Orders
                    </div>
                  </div>
                  <div className="svbd__orders-card">
                    <table className="svbd__otable">
                      <thead><tr><th>Order ID</th><th>Vendor</th><th>Date</th><th>Status</th><th>Total</th></tr></thead>
                      <tbody>
                        {ORDERS.map(o => (
                          <tr key={o.id}>
                            <td><span className="svbd__oid">{o.id}</span></td>
                            <td><span className="svbd__ovendor">{o.vendor}</span></td>
                            <td><span className="svbd__odate">{o.date}</span></td>
                            <td><span className={`svbd__ostatus svbd__${o.status}`}><span className="svbd__sdot"/>{STATUS_LABEL[o.status]}</span></td>
                            <td><span className="svbd__oamt">{o.amt}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="svbd__orders-foot">
                      <button className="svbd__dl-btn" onClick={()=>fire("Downloading invoices...")}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        Download All Invoices
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="svbd__right">
                <div className="svbd__delivery-card">
                  <div className="svbd__delivery-hd">
                    <div className="svbd__delivery-title">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                      Next Delivery
                    </div>
                    <span className="svbd__arriving-tag">Arriving Today</span>
                  </div>
                  <div className="svbd__map-area">
                    <div className="svbd__map-grid"/>
                    <div className="svbd__map-pin">📍</div>
                  </div>
                  <div className="svbd__delivery-row">
                    <div>
                      <div className="svbd__est-label">Estimated Time</div>
                      <div className="svbd__est-time">4:30 PM – 5:00 PM</div>
                    </div>
                    <button className="svbd__track-btn" onClick={()=>fire("Opening live tracker...")}>Track</button>
                  </div>
                </div>

                <div className="svbd__vendors-card">
                  <div className="svbd__vendors-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    Top Vendors
                  </div>
                  {VENDORS.map(v => (
                    <div key={v.name} className="svbd__vendor-row" onClick={()=>fire(`Opening ${v.name}...`)}>
                      <div className="svbd__vendor-thumb">{v.emoji}</div>
                      <div className="svbd__vendor-info">
                        <div className="svbd__vendor-name">{v.name}</div>
                        <div className="svbd__vendor-meta"><span className="svbd__vrating">⭐ {v.rating}</span><span>•</span><span>{v.dist}</span></div>
                      </div>
                      <svg className="svbd__varrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  ))}
                </div>

                <div className="svbd__eco-card">
                  <div className="svbd__eco-icon">🌱</div>
                  <div className="svbd__eco-title">Eco Hero!</div>
                  <p className="svbd__eco-text">You've reduced 45kg of CO₂ this month by opting for local produce. Keep it up!</p>
                  <button className="svbd__eco-btn" onClick={()=>fire("Loading Impact Report...")}>View Impact Report</button>
                </div>
              </div>
            </div>

            <footer className="svbd__footer">
              <span className="svbd__footer-copy">© 2024 SmartVegies. Healthy earth, healthy you.</span>
              <div className="svbd__footer-links">
                {["Help","Privacy","Terms"].map(l=><button key={l} className="svbd__flink">{l}</button>)}
              </div>
            </footer>
          </main>
        </div>
      </div>

      {/* --- CORRECTED SMALL CIRCULAR FLOATING BUTTON --- */}
      <button 
        className="svbd__floating-map-btn" 
        onClick={() => setShowMap(true)} 
        title="View Map"
      >
        <MapPinIcon />
      </button>
      
      {/* The Map Component Call */}
      {showMap && <BuyerFarmMap onClose={() => setShowMap(false)} />}
      
      {toast && <Toast msg={toast} onDone={()=>setToast(null)}/>}
    </>
  );
}