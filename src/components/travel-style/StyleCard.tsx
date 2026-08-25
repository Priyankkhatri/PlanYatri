import React from 'react';
export const StyleCard: React.FC<{ title: string; selected: boolean; onSelect: () => void }> = ({
  title,
  selected,
  onSelect
}) => {
  return (
    <div className={`style-card ${selected ? 'selected' : ''}`} onClick={onSelect}>
      <h3>{title}</h3>
    </div>
  );
};
