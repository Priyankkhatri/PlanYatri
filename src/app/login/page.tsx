'use client';

import React from 'react';
import { AuthHero } from '@/components/auth/AuthHero';
import { AuthForm } from '@/components/auth/AuthForm';
import '@/styles/LoginPage.css';

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
