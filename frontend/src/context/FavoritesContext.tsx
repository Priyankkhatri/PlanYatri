'use client';

import React, { createContext, useContext, useState } from 'react';

const FavoritesContext = createContext({ favorites: [] as string[], toggle: (id: string) => {} });

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const toggle = (id: string) => setFavorites((prev) => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  return <FavoritesContext.Provider value={{ favorites, toggle }}>{children}</FavoritesContext.Provider>;
};

export const useFavorites = () => useContext(FavoritesContext);
