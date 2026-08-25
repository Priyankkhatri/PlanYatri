'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { AuthProvider } from '@/context/AuthContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { StorageProvider } from '@/context/StorageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <FavoritesProvider>
            <StorageProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </StorageProvider>
          </FavoritesProvider>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
};
