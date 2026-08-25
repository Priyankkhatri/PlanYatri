'use client';

import React, { createContext, useContext, useState } from 'react';
import { UserProfile } from '@/types';

interface AuthContextType {
  user: UserProfile | null;
  login: (userData: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType>({ user: null, login: () => {} });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const login = (u: UserProfile) => setUser(u);
  return <AuthContext.Provider value={{ user, login }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
