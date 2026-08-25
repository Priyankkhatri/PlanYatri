import { useState } from 'react';

export function useStorage<T>(key: string, initialValue: T) {
  const [stored, setStored] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  const setValue = (val: T) => {
    setStored(val);
    if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(val));
  };

  return [stored, setValue] as const;
}
