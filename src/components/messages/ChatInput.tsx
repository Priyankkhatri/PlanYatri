'use client';

import React, { useState } from 'react';

export const ChatInput: React.FC<{ onSend: (msg: string) => void }> = ({ onSend }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, padding: 16, borderTop: '1px solid #EFEAE2' }}>
      <input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ flex: 1, padding: 10, borderRadius: 20, border: '1px solid #EFEAE2' }}
      />
      <button type="submit" style={{ padding: '10px 20px', borderRadius: 20, background: '#18181B', color: '#FFF', border: 'none' }}>Send</button>
    </form>
  );
};
