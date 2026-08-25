'use client';
import React from 'react';
import Header from './Header';

export default function Topbar({ title, subtitle }: { title?: string; subtitle?: string }) {
  return <Header title={title} subtitle={subtitle} />;
}
