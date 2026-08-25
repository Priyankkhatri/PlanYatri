'use client';
import React from 'react';
import { AuthHero } from '@/components/auth/AuthHero';
import { AuthForm } from '@/components/auth/AuthForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      <AuthHero />
      <div className="flex-1 flex items-center justify-center p-8">
        <AuthForm />
      </div>
    </div>
  );
}
