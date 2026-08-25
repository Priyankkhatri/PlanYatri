import React from 'react';

export const DestinationSearch: React.FC<{ value: string; onChange: (val: string) => void }> = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Search destinations by name or country..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: '100%', padding: '12px 20px', borderRadius: 24, border: '1px solid #EFEAE2' }}
    />
  );
};
