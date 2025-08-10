'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  checkAuthStatus: () => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data?.user) {
          setUser(data.user);
          return true;
        }
      }
      setUser(null);
      return false;
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setUser(null);
        router.push('/auth/login');
        router.refresh();
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to log out. Please try again.');
    }
  };

  // Check auth status when the component mounts
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const isAuthenticated = await checkAuthStatus();
        
        // If we're on the login/signup page but already authenticated, redirect to home
        if (typeof window !== 'undefined') {
          const isAuthPage = ['/auth/login', '/auth/signup', '/auth/reset-password'].includes(window.location.pathname);
          if (isAuthPage && isAuthenticated) {
            router.push('/');
          } else if (!isAuthPage && !isAuthenticated) {
            // If not on auth page and not authenticated, redirect to login
            router.push('/auth/login');
          }
        }
      } catch (error) {
        console.error('Authentication verification error:', error);
        setUser(null);
        if (typeof window !== 'undefined' && !['/auth/login', '/auth/signup'].includes(window.location.pathname)) {
          router.push('/auth/login');
        }
      }
    };
    
    verifyAuth();
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, isLoading, checkAuthStatus, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
