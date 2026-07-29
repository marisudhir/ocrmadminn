// src/context/UserContext.js
import React, { createContext, useState, useEffect } from "react";
import { ENDPOINTS } from "../api/constraints";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState(null);

  const getCompanyId = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(atob(base64));
      return payload.company_id;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const fetchUsersFromAPI = async () => {
    const companyId = getCompanyId();
    if (!companyId) {
      console.warn("No company ID found in token. Cannot fetch users.");
      return;
    }
    try {
      const response = await fetch(ENDPOINTS.USER_GET, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch users: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      // Filter users by companyId as in your UserPage
      const companyUsers = data.filter(user => user.iCompany_id === companyId);

      setUsers(companyUsers);
      localStorage.setItem("users", JSON.stringify(companyUsers));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      fetchUsersFromAPI();
    }
  }, []);

  // Sync users to localStorage on changes
  useEffect(() => {
    if (users) {
      localStorage.setItem("users", JSON.stringify(users));
    } else {
      localStorage.removeItem("users");
    }
  }, [users]);

  return (
    <UserContext.Provider value={{ users, setUsers }}>
      {children}
    </UserContext.Provider>
  );
};
