import React, { createContext, useContext, useState } from "react";

const INITIAL_ORDERS = [
  { id: "#SV-9021", customer: "Sarah Jenkins",  initials: "SJ", date: "Oct 24, 2023", total: "$124.50", status: "completed" },
  { id: "#SV-9022", customer: "Marco Rivera",   initials: "MR", date: "Oct 24, 2023", total: "$87.00",  status: "processing" },
  { id: "#SV-9023", customer: "Aisha Patel",    initials: "AP", date: "Oct 23, 2023", total: "$203.75", status: "pending" },
  { id: "#SV-9024", customer: "Tom Nguyen",     initials: "TN", date: "Oct 23, 2023", total: "$55.20",  status: "completed" },
  { id: "#SV-9025", customer: "Linda Osei",     initials: "LO", date: "Oct 22, 2023", total: "$310.00", status: "cancelled" },
];

const OrdersContext = createContext(null);

export const OrdersProvider = ({ children }) => {
  const [orders, setOrdersState] = useState(() => {
    try {
      const saved = localStorage.getItem("sv_orders");
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const setOrders = (value) => {
    setOrdersState((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      try { localStorage.setItem("sv_orders", JSON.stringify(next)); } catch {}
      return next;
    });
  };

  return (
    <OrdersContext.Provider value={{ orders, setOrders }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used inside <OrdersProvider>");
  return ctx;
};