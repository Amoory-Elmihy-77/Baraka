'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import api from '@/lib/api';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const storedToken = Cookies.get('token');
    if (storedToken) {
      setToken(storedToken);
      // Fetch user data
      fetchUser(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (authToken) => {
    try {
      // Try different possible endpoints
      let response;
      try {
        response = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${authToken}` }
        });
      } catch (e) {
        // Try alternative endpoint
        response = await api.get('/auth/user', {
          headers: { Authorization: `Bearer ${authToken}` }
        });
      }
      
      const userData = response.data?.user || response.data?.data || response.data;
      setUser(userData);
      setToken(authToken);
    } catch (error) {
      // Token invalid, clear it
      console.warn('Failed to fetch user:', error.message);
      Cookies.remove('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Handle different response structures
      const authToken = response.data?.token || response.data?.data?.token;
      const userData = response.data?.user || response.data?.data?.user || response.data?.data;
      
      if (!authToken) {
        return { 
          success: false, 
          error: 'Invalid response from server' 
        };
      }
      
      Cookies.set('token', authToken, { expires: 7 }); // 7 days
      setToken(authToken);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || 'Login failed. Please check your connection.';
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const register = async (userData) => {
    try {
      // Map to API contract: Postman shows { username, email, password }
      const payload = {
        username: userData.username || userData.name || userData.email?.split('@')[0],
        email: userData.email,
        password: userData.password,
      };
      const response = await api.post('/auth/register', payload);
      
      // Handle different response structures
      const authToken = response.data?.token || response.data?.data?.token;
      const newUser = response.data?.user || response.data?.data?.user || response.data?.data;
      
      // Some APIs don't return a token on register; handle both
      if (authToken) {
        Cookies.set('token', authToken, { expires: 7 });
        setToken(authToken);
        setUser(newUser);
        return { success: true };
      }

      return { success: true, needsLogin: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || 'Registration failed. Please check your connection.';
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

