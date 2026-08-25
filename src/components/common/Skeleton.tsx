import React from 'react';
import '@/styles/Skeleton.css';

export const Skeleton: React.FC<{ width?: string; height?: string; style?: React.CSSProperties }> = ({
  width = '100%',
  height = '20px',
  style
}) => {
  return <div className="skeleton-box" style={{ width, height, ...style }} />;
};
