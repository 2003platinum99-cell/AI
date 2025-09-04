
import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import Message from './Message';
import ChatInput from './ChatInput';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  error: string | null;
  isChatDisabled?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, isLoading, onSendMessage, error, isChatDisabled }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, index) => (
          <Message key={index} message={msg} isStreaming={isLoading && index === messages.length -1} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-gray-800/50 border-t border-gray-700">
        {error && <div className="text-red-400 text-center mb-2 text-sm">{error}</div>}
        <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} isDisabled={isChatDisabled} />
      </div>
    </div>
  );
};

export default ChatInterface;
