'use client';

import React, { createContext, useContext } from 'react';

const StorageContext = createContext({});

export const StorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <StorageContext.Provider value={{}}>{children}</StorageContext.Provider>;
};
