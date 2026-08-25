import React from 'react';

export const TripFilter: React.FC<{ filter: string; setFilter: (f: string) => void }> = ({ filter, setFilter }) => {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {['all', 'upcoming', 'ongoing', 'completed'].map((f) => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          style={{
            padding: '6px 16px',
            borderRadius: 20,
            border: 'none',
            background: filter === f ? '#18181B' : '#F4F4F5',
            color: filter === f ? '#FFF' : '#18181B',
            cursor: 'pointer'
          }}
        >
          {f.toUpperCase()}
        </button>
      ))}
    </div>
  );
};
