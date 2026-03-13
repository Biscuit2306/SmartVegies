import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    id: null,
    name: "",
    email: "",
    type: null, // 'farmer' or 'buyer'
    phone: "",
    avatar: "",
    verified: false,
  });

  const [profile, setProfile] = useState({});

  const updateUserData = (data) => {
    setUserData((prev) => ({ ...prev, ...data }));
  };

  const updateProfile = (profileData) => {
    setProfile((prev) => ({ ...prev, ...profileData }));
  };

  return (
    <UserContext.Provider value={{ userData, profile, updateUserData, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
};
