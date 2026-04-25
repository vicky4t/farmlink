import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('farmlink_token');
    if (!token) { setLoading(false); return; }
    try {
      const { data } = await api.get('/api/auth/me');
      if (data.success) setUser(data.user);
    } catch {
      localStorage.removeItem('farmlink_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refreshUser(); }, [refreshUser]);

  const login = (token) => {
    localStorage.setItem('farmlink_token', token);
  };

  const logout = () => {
    localStorage.removeItem('farmlink_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, isAuthenticated: !!user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
