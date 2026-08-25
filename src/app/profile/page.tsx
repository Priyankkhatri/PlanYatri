'use client';

import React from 'react';
import { UserProfileCard } from '@/components/profile/UserProfileCard';
export default function ProfilePage() {
  return (
    <div className="profile-container">
      <UserProfileCard user={{ id: '1', name: 'Alex Rivera', email: 'alex@planyatri.com' }} />
    </div>
  );
}
