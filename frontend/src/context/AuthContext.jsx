// frontend/src/context/AuthContext.jsx 

import { createContext, useContext, useState } from "react";
import api from "../lib/axios.js"; 

const AuthContext = createContext();

const getInitialUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getInitialUser);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);

  const isLoggedIn = !!user; 
  const authToken = user ? user.token : null; 

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/users/login", { username, password });
      
      const loggedInUser = response.data;
      
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      
      return true; // Success
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed.";
      setError(errorMessage);
      return false; // Failure
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null); 
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isLoggedIn,
    authToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);