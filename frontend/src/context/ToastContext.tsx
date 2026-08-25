'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface ToastContextType {
  success: (msg: string) => void;
  error: (msg: string) => void;
  info: (msg: string) => void;
  warning: (msg: string) => void;
  showToast?: (msg: string) => void;
}

const ToastCtx = createContext<any>(null);

function ToastItem({ toast, onRemove }: { toast: ToastMessage; onRemove: (id: string) => void }) {
  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️',
  };

  return (
    <div className={`toast toast--${toast.type}`}>
      <span className="toast-ico">{icons[toast.type] || icons.info}</span>
      <span className="toast-msg">{toast.message}</span>
      <button className="toast-close" onClick={() => onRemove(toast.id)}>×</button>
    </div>
  );
}

export function ToastContainer() {
  const ctx = useContext(ToastCtx);
  if (!ctx) return null;
  return (
    <div className="toast-container">
      {ctx.toasts.map((t: ToastMessage) => (
        <ToastItem key={t.id} toast={t} onRemove={ctx.remove} />
      ))}
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const add = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration = 3500) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t: any) => t.id !== id)), duration);
  }, []);

  const remove = useCallback((id: string) => {
    setToasts((p) => p.filter((t: any) => t.id !== id));
  }, []);

  const toast: ToastContextType = {
    success: (msg: string) => add(msg, 'success'),
    error: (msg: string) => add(msg, 'error'),
    info: (msg: string) => add(msg, 'info'),
    warning: (msg: string) => add(msg, 'warning'),
    showToast: (msg: string) => add(msg, 'info'),
  };

  return (
    <ToastCtx.Provider value={{ toasts, add, remove, toast }}>
      {children}
      <ToastContainer />
    </ToastCtx.Provider>
  );
}

export function useToast(): ToastContextType {
  const ctx = useContext(ToastCtx);
  if (!ctx) return {
    success: (msg: string) => {},
    error: (msg: string) => {},
    info: (msg: string) => {},
    warning: (msg: string) => {},
    showToast: (msg: string) => {}
  };
  return ctx.toast;
}
