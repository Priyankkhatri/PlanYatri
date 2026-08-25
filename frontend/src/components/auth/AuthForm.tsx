'use client';
import React from 'react';

export const AuthForm = () => {
  return (
    <form className="p-8 bg-white rounded-xl border border-[#EFEAE2] max-w-sm w-full space-y-4">
      <h2 className="text-2xl font-bold">Sign In</h2>
      <input className="w-full p-3 border rounded-lg" type="email" placeholder="alex@planyatri.com" />
      <button className="w-full p-3 bg-[#18181B] text-white rounded-lg font-bold">Log In</button>
    </form>
  );
};
