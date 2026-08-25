import React from 'react';
import '@/styles/Settings.css';

export const SettingsToggle: React.FC<{ label: string; checked: boolean; onChange: () => void }> = ({
  label,
  checked,
  onChange
}) => {
  return (
    <div className="settings-row">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={onChange} />
    </div>
  );
};
