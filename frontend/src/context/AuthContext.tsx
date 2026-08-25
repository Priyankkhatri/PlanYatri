'use client';

import React, { createContext, useContext, useState } from 'react';
import { UserProfile } from '@/types';

interface AuthContextType {
  user: UserProfile | null;
  login: (userData: UserProfile) => void;
  logout?: () => void;
  signIn?: (credentials: any) => Promise<any>;
  signUp?: (data: any) => Promise<any>;
  register?: (data: any) => Promise<any>;
  signInWithOAuth?: (provider: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  signIn: async () => {},
  signUp: async () => {},
  register: async () => {},
  signInWithOAuth: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const login = (u: UserProfile) => setUser(u);
  const logout = () => setUser(null);
  const signIn = async (creds: any) => { setUser({ id: '1', name: creds.email?.split('@')[0] || 'User', email: creds.email }); };
  const signUp = async (data: any) => { setUser({ id: '1', name: data.name || 'User', email: data.email }); };
  const register = signUp;
  const signInWithOAuth = async (provider: string) => {
    setUser({ id: '1', name: `${provider} User`, email: `user@${provider.toLowerCase()}.com` });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signIn, signUp, register, signInWithOAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
