'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '@/services/axios/axiosInstance';
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  role: string | null;
  login: (username: string, password: string) => Promise<void>;
  userName: string | null;
  logout: () => void;
  refreshTokenFn: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();
  const [userName, setUserName] = useState('')
  const [lastActivity, setLastActivity] = useState(Date.now());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAccessToken(localStorage.getItem('access_token'));
      setRefreshToken(localStorage.getItem('refresh_token'));
      setRole(localStorage.getItem('role'));
    }
  }, []);

  const login = async (username: string, password: string) => {
    const response = await axiosInstance.post(`${API_URL}/login/`, { username, password });
    console.log("After successful login",response)
    const { access, refresh } = response.data;
    setAccessToken(access);
    setRefreshToken(refresh);
    console.log("Role is ::",response.data.user.role)
    setRole(response.data.user.role);
    setUserName(username)
    setLastActivity(Date.now());

    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('role', response.data.user.role);
    }
    console.log("response::",response,role)
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setRole(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('role');
    }
    console.log("*************Logout called:")
    router.push('/login');
  };

  const refreshTokenFn = async () => {
    if (!refreshToken) throw new Error('No refresh token');
    const response = await axios.post(`${API_URL}/token/refresh/`, { refresh: refreshToken });

    setAccessToken(response.data.access);

    setLastActivity(Date.now());
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', response.data.access);
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const now = Date.now();
      const idleTime = (now - lastActivity) / 1000 / 60; // Minutes
      if (idleTime >= 30) {
        logout();
      } else if (idleTime >= 5 && refreshToken) {
        try {
          await refreshTokenFn();
        } catch {
          logout();
        }
      }
    }, 60000); // Check every minute

    const updateActivity = () => setLastActivity(Date.now());
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
    };
  }, [lastActivity, refreshToken]);

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, role, login, logout, userName, refreshTokenFn: refreshTokenFn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};