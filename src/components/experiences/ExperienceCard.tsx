import React from 'react';
import { Experience } from '@/types';

export const ExperienceCard: React.FC<{ experience: Experience }> = ({ experience }) => {
  return (
    <div style={{ background: '#FFF', padding: 16, borderRadius: 12, border: '1px solid #EFEAE2' }}>
      <h4>{experience.title}</h4>
      <p>{experience.location}</p>
    </div>
  );
};
