'use client';

import React, { createContext, useContext } from 'react';

const ToastContext = createContext({ showToast: (msg: string) => {} });

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const showToast = (msg: string) => alert(msg);
  return <ToastContext.Provider value={{ showToast }}>{children}</ToastContext.Provider>;
};

export const useToast = () => useContext(ToastContext);
