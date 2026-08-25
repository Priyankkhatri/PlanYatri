import React from 'react';
import { EmergencyContact } from '@/types';

export const EmergencyContactCard: React.FC<{ contact: EmergencyContact }> = ({ contact }) => {
  return (
    <div style={{ background: '#FFF', padding: 20, borderRadius: 12, border: '1px solid #EFEAE2' }}>
      <h4>{contact.name}</h4>
      <p style={{ color: '#8C867A', fontSize: 13 }}>{contact.relation}</p>
      <p style={{ fontWeight: 700, marginTop: 8 }}>{contact.phone}</p>
    </div>
  );
};
