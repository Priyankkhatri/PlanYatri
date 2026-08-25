'use client';

import React from 'react';
import { AuthHero } from '@/components/auth/AuthHero';
import { AuthForm } from '@/components/auth/AuthForm';
export default function LoginPage() {
  return (
    <div className="auth-page">
      <AuthHero />
      <div className="auth-form-container">
        <AuthForm />
      </div>
    </div>
  );
}
