import React from 'react';

export const StatCards: React.FC = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
      <div style={{ background: '#FFF', padding: 20, borderRadius: 10, border: '1px solid #EFEAE2' }}>
        <span style={{ fontSize: 12, color: '#8C867A', textTransform: 'uppercase' }}>Active Trips</span>
        <h3 style={{ fontSize: 28, fontWeight: 800, marginTop: 4 }}>02</h3>
      </div>
      <div style={{ background: '#FFF', padding: 20, borderRadius: 10, border: '1px solid #EFEAE2' }}>
        <span style={{ fontSize: 12, color: '#8C867A', textTransform: 'uppercase' }}>Saved Destinations</span>
        <h3 style={{ fontSize: 28, fontWeight: 800, marginTop: 4 }}>14</h3>
      </div>
      <div style={{ background: '#FFF', padding: 20, borderRadius: 10, border: '1px solid #EFEAE2' }}>
        <span style={{ fontSize: 12, color: '#8C867A', textTransform: 'uppercase' }}>Total Spent</span>
        <h3 style={{ fontSize: 28, fontWeight: 800, marginTop: 4 }}>$3,050</h3>
      </div>
    </div>
  );
};
