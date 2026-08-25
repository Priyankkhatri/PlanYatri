'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import VelocityPulse from '@/components/VelocityPulse';

interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  time: string;
  isSelf?: boolean;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: '1', sender: 'Elena Rostova', avatar: '👩‍✈️', text: 'Hey team! Driver confirmed the Innova SUV for 8:00 AM Khardung La pass departure.', time: '10:14 AM' },
  { id: '2', sender: 'Alex Rivera', avatar: '👨‍💻', text: 'Awesome! Did we pack the oxygen canisters & thermal jackets?', time: '10:16 AM', isSelf: true },
  { id: '3', sender: 'Sovereign Concierge', avatar: '⚡', text: 'PlanYatri Telemetry: Weather forecast for Khardung La is clear (4°C).', time: '10:17 AM' }
];

export default function MessagesPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'Alex Rivera',
      avatar: '👨‍💻',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#18181B] p-8 space-y-8 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-[#EFEAE2] shadow-sm">
        <div>
          <span className="text-xs font-mono font-bold text-[#4D41DF] uppercase">
            💬 Realtime Companion Network
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#18181B] mt-1">
            Expedition Chat &amp; Travel Buddies
          </h1>
        </div>

        <Link
          href="/dashboard"
          className="px-6 py-2.5 border border-gray-300 font-bold text-sm rounded-full hover:bg-gray-50 transition-all"
        >
          ← Dashboard
        </Link>
      </div>

      {/* Main Chat Box */}
      <div className="flex-1 bg-white rounded-2xl border border-[#EFEAE2] shadow-sm flex flex-col overflow-hidden max-w-4xl w-full mx-auto">
        
        {/* Channel Banner */}
        <div className="p-4 bg-[#18181B] text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            <div>
              <h3 className="font-bold text-sm">Leh Ladakh Expedition Group</h3>
              <p className="text-[11px] text-gray-400">3 Members Online • Supabase Realtime Active</p>
            </div>
          </div>
          <span className="text-xs font-mono text-[#D4A843]">CHANNEL #EXPEDITION-01</span>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto min-h-[350px] bg-[#FAF8F5]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 items-start ${msg.isSelf ? 'flex-row-reverse' : ''}`}
            >
              <div className="w-10 h-10 rounded-full bg-white border border-[#EFEAE2] flex items-center justify-center text-lg shadow-sm">
                {msg.avatar}
              </div>
              
              <div className={`max-w-md p-4 rounded-2xl space-y-1 ${
                msg.isSelf
                  ? 'bg-[#18181B] text-white rounded-tr-none'
                  : 'bg-white text-[#18181B] border border-[#EFEAE2] rounded-tl-none shadow-sm'
              }`}>
                <div className="flex justify-between items-center gap-4 text-xs">
                  <span className={`font-bold ${msg.isSelf ? 'text-[#D4A843]' : 'text-[#4D41DF]'}`}>
                    {msg.sender}
                  </span>
                  <span className="text-[10px] opacity-60 font-mono">{msg.time}</span>
                </div>
                <p className="text-sm font-sans">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-[#EFEAE2] flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message to your travel companions..."
            className="flex-1 p-3.5 border border-[#EFEAE2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4D41DF]"
          />
          <button
            type="submit"
            className="px-8 py-3.5 bg-[#4D41DF] text-white font-bold rounded-xl hover:bg-[#3622CA] transition-all shadow-md"
          >
            Send ✨
          </button>
        </form>
      </div>

      <VelocityPulse size="sm" label="REALTIME SYNC ACTIVE" />
    </div>
  );
}
