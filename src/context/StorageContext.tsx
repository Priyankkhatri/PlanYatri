'use client';

import React, { createContext, useContext } from 'react';

interface StorageContextType {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
}

const StorageContext = createContext<StorageContextType>({
  getItem: () => null,
  setItem: () => {}
});

export const StorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getItem = (key: string) => (typeof window !== 'undefined' ? localStorage.getItem(key) : null);
  const setItem = (key: string, value: string) => {
    if (typeof window !== 'undefined') localStorage.setItem(key, value);
  };

  return (
    <StorageContext.Provider value={{ getItem, setItem }}>
      {children}
    </StorageContext.Provider>
  );
};

export const useStorageContext = () => useContext(StorageContext);
