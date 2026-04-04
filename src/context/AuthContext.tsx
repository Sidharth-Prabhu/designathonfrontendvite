import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    isAuthenticated: false,
    role: null,
    username: null,
  });

  useEffect(() => {
    const token = authService.getToken();
    const role = authService.getRole();
    const username = authService.getUsername();
    
    if (token && role && username) {
      setUser({
        isAuthenticated: true,
        role,
        username,
      });
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('role', userData.role);
    localStorage.setItem('username', userData.username);
    
    setUser({
      isAuthenticated: true,
      role: userData.role,
      username: userData.username,
    });
  };

  const logout = () => {
    authService.logout();
    setUser({
      isAuthenticated: false,
      role: null,
      username: null,
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
