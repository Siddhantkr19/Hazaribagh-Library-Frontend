import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api'; // [IMPORTANT] Import your API helper


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        // 1. Try to fetch the user from the Backend (using the Cookie)
        const { data } = await api.get('/auth/current-user');
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data)); // Sync localStorage
      } catch (error) {
        // 2. If Backend fails (cookie expired/missing), check localStorage as backup
        // or just clear everything.
        console.log("No active session found.");
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // Do NOT use window.location.href. 
    // Since AuthContext wraps the app, setting user to null 
    // will trigger the useEffect in Login.js or ProtectedRoutes to handle redirection.
};

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);