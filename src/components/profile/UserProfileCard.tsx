import React from 'react';
import { UserProfile } from '@/types';
export const UserProfileCard: React.FC<{ user: UserProfile }> = ({ user }) => {
  return (
    <div className="profile-card">
      <div>
        <h2>{user.name}</h2>
        <p style={{ color: '#8C867A' }}>{user.email}</p>
      </div>
    </div>
  );
};
