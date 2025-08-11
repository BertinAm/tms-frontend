"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { axiosApiCall } from '../utils/api';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (access_token: string, refresh_token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Public routes that don't require authentication
  const publicRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/verify-otp',
    '/reset-password'
  ];

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    // Redirect logic
    if (!loading) {
      if (!user && !isPublicRoute) {
        // User not authenticated and trying to access protected route
        router.push('/login');
      } else if (user && isPublicRoute) {
        // User authenticated and trying to access public route
        router.push('/');
      }
    }
  }, [user, loading, pathname, isPublicRoute, router]);

  const checkAuthStatus = async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');
      const userData = localStorage.getItem('user');

      if (!accessToken || !refreshToken || !userData) {
        setLoading(false);
        return;
      }

      // Verify token by getting user profile
      try {
        const response = await axiosApiCall('/api/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        setUser(response);
      } catch (error: any) {
        if (error.message?.includes('401') || error.status === 401) {
          // Token expired, try to refresh
          try {
            const refreshResponse = await axiosApiCall('/api/auth/token/refresh/', {
              method: 'POST',
              data: {
                refresh: refreshToken
              }
            });
            
            const newAccessToken = refreshResponse.access;
            localStorage.setItem('access_token', newAccessToken);
            
            // Try to get profile again with new token
            const profileResponse = await axiosApiCall('/api/auth/profile', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${newAccessToken}`
              }
            });
            setUser(profileResponse);
          } catch (refreshError) {
            // Refresh failed, clear everything
            logout();
          }
        } else {
          // Other error, clear auth
          logout();
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = (access_token: string, refresh_token: string, userData: User) => {
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('user', JSON.stringify(userData));
    
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('otp_token');
    localStorage.removeItem('reset_token');
    localStorage.removeItem('user_id');
    
    setUser(null);
  };

  const isAuthenticated = !!user;

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
