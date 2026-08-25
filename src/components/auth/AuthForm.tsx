'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { GoogleIcon } from '../icons/AuthIcons';
export const AuthForm: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      id: 'usr-1',
      email: email || 'alex@planyatri.com',
      name: 'Alex Rivera',
      isDemo: false
    });
  };

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <h2>Welcome Back</h2>
      <p style={{ color: '#8C867A', marginBottom: 20 }}>Sign in to plan your luxury journey.</p>
      
      <label>Email Address</label>
      <input
        className="auth-input"
        type="email"
        placeholder="alex@planyatri.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label>Password</label>
      <input
        className="auth-input"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="auth-submit-btn" type="submit">Sign In</button>
    </form>
  );
};
