'use client';

import React, { useState } from 'react';
import { ChatBubble } from '@/components/messages/ChatBubble';
import { ChatInput } from '@/components/messages/ChatInput';

interface ChatMsg {
  id: string;
  text: string;
  senderType: 'user' | 'contact';
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: '1', text: 'Hello! I am your PlanYatri Travel Concierge.', senderType: 'contact' }
  ]);

  const handleSend = (text: string) => {
    setMessages((prev) => [...prev, { id: Date.now().toString(), text, senderType: 'user' }]);
  };

  return (
    <div className="messages-container">
      <div className="chat-main">
        <div className="messages-list">
          {messages.map((m) => (
            <ChatBubble key={m.id} text={m.text} senderType={m.senderType} />
          ))}
        </div>
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
