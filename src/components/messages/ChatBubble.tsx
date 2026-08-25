import React from 'react';
export const ChatBubble: React.FC<{ text: string; senderType: 'user' | 'contact' }> = ({ text, senderType }) => {
  return <div className={`chat-bubble ${senderType}`}>{text}</div>;
};
