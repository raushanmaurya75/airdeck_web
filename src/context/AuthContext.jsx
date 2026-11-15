import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const AUTH_STORAGE_KEY = 'airdeck_authenticated_operator';

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [operator, setOperator] = useState(() => {
    try {
      const saved = localStorage.getItem('airdeck_operator_meta');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = (email, _password) => {
    const operatorData = {
      email: email || 'operator@airdeck.studio',
      name: (email && email.split('@')[0]) || 'Studio Operator',
      authenticatedAt: new Date().toISOString(),
      role: 'Broadcast Administrator',
    };
    setIsAuthenticated(true);
    setOperator(operatorData);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
      localStorage.setItem('airdeck_operator_meta', JSON.stringify(operatorData));
    } catch (e) {
      console.warn('Failed to store auth session', e);
    }
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setOperator(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem('airdeck_operator_meta');
    } catch (e) {
      console.warn('Failed to remove auth session', e);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, operator, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
