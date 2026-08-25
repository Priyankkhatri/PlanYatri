'use client';

import React, { createContext, useContext, useState } from 'react';
import { UserProfile } from '@/types';

interface AuthContextType {
  user: UserProfile | null;
  login: (userData: UserProfile) => void;
  logout?: () => void;
  signInWithOAuth?: (provider: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  signInWithOAuth: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const login = (u: UserProfile) => setUser(u);
  const logout = () => setUser(null);
  const signInWithOAuth = async (provider: string) => {
    console.log('OAuth login with:', provider);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signInWithOAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
