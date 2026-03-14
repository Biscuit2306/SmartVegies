import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
.svbd__layout{display:flex;min-height:100vh;background:#f4faf2;font-family:'Nunito',sans-serif;}
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
.svbd__two-col{display:grid;grid-template-columns:1fr 284px;gap:20px;align-items:start;}
.svbd__left{display:flex;flex-direction:column;gap:22px;}
.svbd__right{display:flex;flex-direction:column;gap:16px;}
.svbd__sec-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;}
.svbd__sec-title{display:flex;align-items:center;gap:8px;font-size:15.5px;font-weight:900;color:#1a3a1a;}
.svbd__sec-title svg{width:18px;height:18px;}
.svbd__view-all{font-family:'Nunito',sans-serif;font-size:13.5px;font-weight:800;color:#3cba22;background:none;border:none;cursor:pointer;padding:0;transition:color 0.15s;}
.svbd__view-all:hover{color:#2a8a14;}
.svbd__products-section{animation:svbd-up 0.4s ease 0.05s both;}
.svbd__products-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
.svbd__product-card{background:white;border-radius:16px;border:1.5px solid #e4f0e0;overflow:hidden;transition:transform 0.2s,box-shadow 0.2s;cursor:pointer;position:relative;}
.svbd__product-card:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(60,185,33,0.14);}
.svbd__product-img{position:relative;height:160px;background:linear-gradient(135deg,#f0f9ec,#e0f0d8);display:flex;align-items:center;justify-content:center;font-size:72px;overflow:hidden;}
.svbd__wish-btn{position:absolute;top:10px;right:10px;width:32px;height:32px;border-radius:50%;border:none;background:white;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.14);transition:transform 0.18s;font-size:15px;z-index:2;}
.svbd__wish-btn:hover{transform:scale(1.15);}
.svbd__product-badge{position:absolute;bottom:10px;left:10px;background:#3cba22;color:white;font-size:10px;font-weight:800;padding:3px 10px;border-radius:20px;letter-spacing:0.3px;text-transform:uppercase;z-index:2;}
.svbd__product-info{padding:13px 14px 15px;}
.svbd__product-name{font-size:14px;font-weight:900;color:#1a3a1a;margin-bottom:5px;line-height:1.3;}
.svbd__product-farm{font-size:11.5px;color:#9aaa9a;font-weight:600;margin-bottom:10px;display:flex;align-items:center;gap:5px;}
.svbd__product-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px;}
.svbd__product-price{font-size:16px;font-weight:900;color:#3cba22;}
.svbd__price-unit{font-size:11.5px;font-weight:600;color:#9aaa9a;}
.svbd__product-actions{border-top:1px solid #eaf0e0;padding-top:8px;display:flex;flex-direction:column;gap:8px;}
.svbd__cart-btn-full{width:100%;height:38px;border-radius:10px;border:none;background:#3cba22;color:white;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:7px;font-family:'Nunito',sans-serif;font-size:13px;font-weight:800;transition:all 0.18s;box-shadow:0 3px 10px rgba(60,185,33,0.34);}
.svbd__cart-btn-full:hover{background:#2a8a14;box-shadow:0 5px 16px rgba(60,185,33,0.50);}
.svbd__cart-btn-full.svbd__done{background:#1a6a08!important;}
.svbd__cart-btn-full svg{width:16px;height:16px;}
.svbd__detail-btn{width:100%;padding:9px 0;border:1.5px solid #ddeeda;border-radius:10px;background:white;font-family:'Nunito',sans-serif;font-size:12.5px;font-weight:700;color:#3cba22;cursor:pointer;text-align:center;transition:border-color 0.15s,background 0.15s,color 0.15s;display:flex;align-items:center;justify-content:center;gap:6px;}
.svbd__detail-btn:hover{border-color:#3cba22;background:#f5fff3;color:#2a8a14;}
.svbd__detail-btn svg{width:14px;height:14px;}
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
.svbd__toast{position:fixed;bottom:28px;right:28px;background:#2a6a14;color:white;padding:12px 18px;border-radius:12px;font-size:13.5px;font-weight:700;box-shadow:0 8px 24px rgba(0,0,0,0.18);display:flex;align-items:center;gap:8px;z-index:1000;animation:svbd-slide-r 0.3s ease;font-family:'Nunito',sans-serif;}
.svbd__toast svg{width:15px;height:15px;}
.svbd__modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:500;display:flex;align-items:center;justify-content:center;padding:20px;}
.svbd__modal{background:white;border-radius:20px;padding:28px;max-width:480px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.2);animation:svbd-up 0.25s ease;}
.svbd__modal-title{font-size:18px;font-weight:900;color:#1a3a1a;margin-bottom:6px;}
.svbd__modal-sub{font-size:13px;color:#7aaa7a;font-weight:600;margin-bottom:20px;}
.svbd__modal-stat{display:flex;align-items:center;gap:14px;padding:14px;background:#f4faf2;border-radius:14px;margin-bottom:10px;}
.svbd__modal-stat-icon{width:42px;height:42px;border-radius:12px;background:linear-gradient(135deg,#55d626,#3cba22);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;}
.svbd__modal-stat-info{}
.svbd__modal-stat-val{font-size:18px;font-weight:900;color:#1a3a1a;}
.svbd__modal-stat-lbl{font-size:12px;color:#7aaa7a;font-weight:700;}
.svbd__modal-close{width:100%;margin-top:18px;padding:12px;border-radius:12px;border:none;background:linear-gradient(135deg,#55d626,#3cba22);font-family:'Nunito',sans-serif;font-size:14px;font-weight:800;color:white;cursor:pointer;}
.svbd__modal-close:hover{opacity:0.9;}
.svbd__otable tbody tr.svbd__new-row{animation:svbd-highlight 2s ease forwards;}
@keyframes svbd-highlight{0%{background:#fffbe6;}100%{background:transparent;}}
@keyframes svbd-up{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes svbd-slide-r{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
@media(max-width:1100px){.svbd__two-col{grid-template-columns:1fr}}
@media(max-width:700px){.svbd__content{padding:16px}.svbd__products-grid{grid-template-columns:1fr 1fr}}
`;

/* ─── Read cart from localStorage ─────────────────── */
const readCart = () => { try { return JSON.parse(localStorage.getItem("sv_cart") || "[]"); } catch { return []; } };
const saveCart = (items) => { try { localStorage.setItem("sv_cart", JSON.stringify(items)); } catch {} };

/* ─── Read orders from localStorage ───────────────── */
const readLiveOrders = () => {
  try {
    const raw = JSON.parse(localStorage.getItem("sv_orders") || "[]");
    if (!Array.isArray(raw)) return [];
    return raw.map(o => ({
      id:     String(o.id || ""),
      vendor: String(o.products?.[0]?.name || o.name || "SmartVegies Order"),
      date:   String(o.date || ""),
      status: o.status === "shipped" ? "transit" : String(o.status || "processing"),
      amt:    `₹${parseFloat(o.price || 0).toFixed(2)}`,
      isNew:  false,
    }));
  } catch { return []; }
};

const DEMO_ORDERS = [
  { id:"#SV-84920", vendor:"Green Valley Farms", date:"Oct 24, 2023", status:"delivered",  amt:"₹32.40",  isNew:false },
  { id:"#SV-84811", vendor:"Sunshine Acres",     date:"Oct 21, 2023", status:"transit",    amt:"₹18.90",  isNew:false },
  { id:"#SV-84790", vendor:"Hillside Organic",   date:"Oct 18, 2023", status:"delivered",  amt:"₹51.20",  isNew:false },
  { id:"#SV-84750", vendor:"Root & Vine Co.",    date:"Oct 14, 2023", status:"processing", amt:"₹22.00",  isNew:false },
];

const STATUS_LABEL = { delivered:"Delivered", transit:"In Transit", processing:"Processing", cancelled:"Cancelled" };

const FALLBACK_PRODUCTS = [
  { id:1,  name:"Organic Broccoli",  vendor:"Green Valley Farms", price:39.9,  emoji:"🥦", unit:"kg",  liked:false },
  { id:2,  name:"Sweet Carrots",     vendor:"Sunshine Acres",     price:24.9,  emoji:"🥕", unit:"kg",  liked:true  },
  { id:3,  name:"Cherry Tomatoes",   vendor:"Hillside Organic",   price:45.0,  emoji:"🍅", unit:"pack",liked:false },
  { id:4,  name:"Fresh Spinach",     vendor:"Root & Vine Co.",    price:29.9,  emoji:"🥬", unit:"kg",  liked:false },
  { id:5,  name:"Yellow Corn",       vendor:"Sunshine Acres",     price:18.5,  emoji:"🌽", unit:"pc",  liked:false },
  { id:6,  name:"Purple Eggplant",   vendor:"Green Valley Farms", price:32.0,  emoji:"🍆", unit:"kg",  liked:true  },
];

const NAV_ITEMS = [
  { label:"Dashboard",   path:"/buyer/dashboard" },
  { label:"Marketplace", path:"/buyer/marketplace" },
  { label:"Cart",        path:"/buyer/cart" },
  { label:"My Orders",   path:"/buyer/orders" },
  { label:"Bulk Order",  path:"/buyer/bulk-order" },
  { label:"Profile",     path:"/buyer/profile" },
];

const VENDORS = [
  { name:"Green Valley Farms", rating:"4.9", dist:"12 mins away", emoji:"🌾" },
  { name:"Sunshine Acres",     rating:"4.7", dist:"5 miles away",  emoji:"☀️" },
];

/* ─── Toast ─────────────────────────────────────────── */
const Toast = ({ msg, onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="svbd__toast">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      {msg}
    </div>
  );
};

/* ─── Impact Report Modal ────────────────────────────── */
const ImpactModal = ({ onClose }) => (
  <div className="svbd__modal-overlay" onClick={onClose}>
    <div className="svbd__modal" onClick={e => e.stopPropagation()}>
      <div className="svbd__modal-title">🌱 Your Eco Impact Report</div>
      <div className="svbd__modal-sub">March 2024 — You're making a difference!</div>
      {[
        { icon:"🌿", val:"45 kg",   lbl:"CO₂ Emissions Reduced" },
        { icon:"💧", val:"320 L",   lbl:"Water Saved" },
        { icon:"🚜", val:"12",      lbl:"Local Farmers Supported" },
        { icon:"♻️", val:"8 kg",   lbl:"Packaging Waste Avoided" },
      ].map(s => (
        <div key={s.lbl} className="svbd__modal-stat">
          <div className="svbd__modal-stat-icon">{s.icon}</div>
          <div className="svbd__modal-stat-info">
            <div className="svbd__modal-stat-val">{s.val}</div>
            <div className="svbd__modal-stat-lbl">{s.lbl}</div>
          </div>
        </div>
      ))}
      <button className="svbd__modal-close" onClick={onClose}>Close Report</button>
    </div>
  </div>
);

/* ─── Main ────────────────────────────────────────────── */
export default function BuyerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [products,    setProducts]    = useState(FALLBACK_PRODUCTS);
  const [cartDone,    setCartDone]    = useState({});
  const [toast,       setToast]       = useState(null);
  const [search,      setSearch]      = useState("");
  const [showImpact,  setShowImpact]  = useState(false);

  /* Build order rows merging live + demo */
  const buildOrders = () => {
    const live = readLiveOrders();
    const mapped = live.map((o, idx) => ({ ...o, isNew: idx === 0 }));
    return mapped.length ? [...mapped, ...DEMO_ORDERS] : DEMO_ORDERS;
  };
  const [orderRows, setOrderRows] = useState(buildOrders);

  useEffect(() => {
    setOrderRows(buildOrders());
    const onFocus = () => setOrderRows(buildOrders());
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  /* Cart count badge */
  const [cartCount, setCartCount] = useState(() => readCart().reduce((s, i) => s + (i.qty || 1), 0));
  useEffect(() => {
    const update = () => setCartCount(readCart().reduce((s, i) => s + (i.qty || 1), 0));
    window.addEventListener("focus", update);
    return () => window.removeEventListener("focus", update);
  }, []);

  const fire = (msg) => setToast(msg);

  const toggleLike = (id) => setProducts(p => p.map(x => x.id === id ? { ...x, liked: !x.liked } : x));

  const addCart = (p) => {
    if (cartDone[p.id]) return;
    const cart = readCart();
    const existing = cart.find(i => i.id === p.id);
    if (existing) {
      saveCart(cart.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      saveCart([...cart, { id: p.id, name: p.name, emoji: p.emoji, price: p.price, unitLabel: p.unit, qty: 1 }]);
    }
    setCartCount(readCart().reduce((s, i) => s + (i.qty || 1), 0));
    setCartDone(prev => ({ ...prev, [p.id]: true }));
    fire(`${p.name} added to cart!`);
    setTimeout(() => setCartDone(prev => ({ ...prev, [p.id]: false })), 2000);
  };

  /* Download invoices — generates a simple text blob */
  const handleDownloadInvoices = () => {
    const live = JSON.parse(localStorage.getItem("sv_orders") || "[]");
    const all  = [...live, ...DEMO_ORDERS];
    if (all.length === 0) { fire("No orders to download."); return; }
    const lines = ["SmartVegies — Invoice Summary", "=".repeat(40), ""];
    all.forEach((o, idx) => {
      lines.push(`Order ${idx + 1}: ${o.id || o.id}`);
      lines.push(`  Date   : ${o.date}`);
      lines.push(`  Item   : ${o.vendor || o.name}`);
      lines.push(`  Amount : ${o.amt || "₹" + parseFloat(o.price || 0).toFixed(2)}`);
      lines.push(`  Status : ${o.status}`);
      lines.push("");
    });
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = "smartvegies_invoices.txt";
    a.click();
    URL.revokeObjectURL(url);
    fire("Invoices downloaded!");
  };

  /* Filtered products by search */
  const visibleProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.vendor.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 3);

  const visibleOrders = orderRows.slice(0, 5);

  return (
    <>
      <style>{STYLES}</style>
      <div className="svbd__layout">

        {/* ════ SIDEBAR ════ */}
        <aside className="svbd__sidebar">
          <div className="svbd__brand" onClick={() => navigate("/buyer/dashboard")}>
            <div className="svbd__brand-logo">🌿</div>
            <span className="svbd__brand-name">SmartVegies</span>
          </div>

          <nav className="svbd__nav">
            {NAV_ITEMS.map(item => (
              <button
                key={item.label}
                className={`svbd__nav-btn ${location.pathname === item.path ? "svbd__active" : ""}`}
                onClick={() => navigate(item.path)}
              >
                <span className="svbd__nav-icon">
                  {item.label==="Dashboard"   && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>}
                  {item.label==="Marketplace" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
                  {item.label==="Cart"        && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>}
                  {item.label==="My Orders"   && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>}
                  {item.label==="Bulk Order"  && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>}
                  {item.label==="Profile"     && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
                </span>
                <span className="svbd__nav-label">{item.label}</span>
                {item.label === "Cart" && cartCount > 0 && (
                  <span className="svbd__nav-badge">{cartCount}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="svbd__spacer"/>

          <div className="svbd__wallet">
            <div className="svbd__wallet-lbl">Current Balance</div>
            <div className="svbd__wallet-amt">₹142.50</div>
            <button className="svbd__wallet-btn" onClick={() => fire("Top Up opened!")}>Top Up Wallet</button>
          </div>
        </aside>

        {/* ════ MAIN ════ */}
        <div className="svbd__main">
          <header className="svbd__topbar">
            <div className="svbd__search-wrap">
              <span className="svbd__search-ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </span>
              <input className="svbd__search" placeholder="Search fresh produce, vendors..." value={search} onChange={e => setSearch(e.target.value)}/>
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
            {/* Welcome */}
            <div className="svbd__welcome-row">
              <div>
                <h1 className="svbd__welcome-h">Welcome back, Alex! 👋</h1>
                <p className="svbd__welcome-sub">Ready for some fresh greens today?</p>
              </div>
            </div>

            <div className="svbd__two-col">
              <div className="svbd__left">

                {/* Products from Marketplace */}
                <div className="svbd__products-section">
                  <div className="svbd__sec-hd">
                    <div className="svbd__sec-title">
                      <svg viewBox="0 0 24 24" fill="#e05252" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                      Fresh From Marketplace
                    </div>
                    <button className="svbd__view-all" onClick={() => navigate("/buyer/marketplace")}>View All</button>
                  </div>
                  <div className="svbd__products-grid">
                    {visibleProducts.map(p => (
                      <div key={p.id} className="svbd__product-card">
                        <div className="svbd__product-img">
                          {p.emoji}
                          <button className="svbd__wish-btn" onClick={() => toggleLike(p.id)}>{p.liked ? "❤️" : "🤍"}</button>
                          <span className="svbd__product-badge">fresh</span>
                        </div>
                        <div className="svbd__product-info">
                          <div className="svbd__product-name">{p.name}</div>
                          <div className="svbd__product-farm">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="11" height="11"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                            {p.vendor}
                          </div>
                          <div className="svbd__product-foot">
                            <div>
                              <div className="svbd__product-price">₹{p.price}</div>
                              <div className="svbd__price-unit">per {p.unit}</div>
                            </div>
                          </div>
                          <div className="svbd__product-actions">
                            <button
                              className={`svbd__cart-btn-full ${cartDone[p.id] ? "svbd__done" : ""}`}
                              onClick={() => addCart(p)}
                            >
                              {cartDone[p.id] ? (
                                <>
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                                  Added to Cart
                                </>
                              ) : (
                                <>
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
                                  Add to Cart
                                </>
                              )}
                            </button>
                            <button
                              className="svbd__detail-btn"
                              onClick={() => navigate("/buyer/marketplace")}
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="svbd__orders-section">
                  <div className="svbd__sec-hd">
                    <div className="svbd__sec-title">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#3cba22" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                      Recent Orders
                    </div>
                    <button className="svbd__view-all" onClick={() => navigate("/buyer/orders")}>View All</button>
                  </div>
                  <div className="svbd__orders-card">
                    <table className="svbd__otable">
                      <thead><tr><th>Order ID</th><th>Item / Vendor</th><th>Date</th><th>Status</th><th>Total</th></tr></thead>
                      <tbody>
                        {visibleOrders.map(o => (
                          <tr key={o.id} className={o.isNew ? "svbd__new-row" : ""}>
                            <td><span className="svbd__oid">{o.id}</span></td>
                            <td><span className="svbd__ovendor">{o.vendor}</span></td>
                            <td><span className="svbd__odate">{o.date}</span></td>
                            <td><span className={`svbd__ostatus svbd__${o.status}`}><span className="svbd__sdot"/>{STATUS_LABEL[o.status] || o.status}</span></td>
                            <td><span className="svbd__oamt">{o.amt}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="svbd__orders-foot">
                      <button className="svbd__dl-btn" onClick={handleDownloadInvoices}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        Download All Invoices
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
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
                    <button className="svbd__track-btn" onClick={() => fire("Opening live tracker...")}>Track</button>
                  </div>
                </div>

                <div className="svbd__vendors-card">
                  <div className="svbd__vendors-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    Top Vendors
                  </div>
                  {VENDORS.map(v => (
                    <div key={v.name} className="svbd__vendor-row" onClick={() => navigate("/buyer/marketplace")}>
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
                  <button className="svbd__eco-btn" onClick={() => setShowImpact(true)}>View Impact Report</button>
                </div>
              </div>
            </div>

            <footer className="svbd__footer">
              <span className="svbd__footer-copy">© 2024 SmartVegies. Healthy earth, healthy you.</span>
              <div className="svbd__footer-links">
                {["Help","Privacy","Terms"].map(l => <button key={l} className="svbd__flink">{l}</button>)}
              </div>
            </footer>
          </main>
        </div>
      </div>

      {toast && <Toast msg={toast} onDone={() => setToast(null)}/>}
      {showImpact && <ImpactModal onClose={() => setShowImpact(false)} />}
    </>
  );
} 