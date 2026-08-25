import { useState, useEffect } from 'react';

export function useFetch<T>(fetchFn: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFn().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  return { data, loading };
}
