import React, { useState, useCallback } from 'react';
import { ChatMessage, MessageRole } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import { userAvatar } from '../assets';

interface MessageProps {
  message: ChatMessage;
  isStreaming: boolean;
}

const UserIcon: React.FC = () => (
    <div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden">
        <img src={userAvatar} alt="User Icon" className="w-full h-full object-cover" />
    </div>
);

const AIIcon: React.FC = () => (
    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
        <img src="/icon.png" alt="AI Icon" className="w-full h-full object-cover" />
    </div>
);

const TypingIndicator: React.FC = () => (
    <span className="inline-block w-2 h-5 bg-cyan-400 animate-pulse align-bottom ml-1"></span>
);

const CopyIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const CheckIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);


const Message: React.FC<MessageProps> = ({ message, isStreaming }) => {
  const isUser = message.role === MessageRole.USER;
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (isCopied || !message.content) return;
    navigator.clipboard.writeText(message.content).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  }, [message.content, isCopied]);

  const containerClasses = `flex items-start gap-4 max-w-4xl mx-auto ${isUser ? 'flex-row-reverse' : ''}`;
  const bubbleClasses = `px-5 py-3 rounded-2xl ${isUser ? 'bg-blue-600 rounded-br-none' : 'bg-gray-700 rounded-bl-none'}`;
  const contentClasses = "prose prose-invert prose-sm max-w-none";

  return (
    <div className={containerClasses}>
      {isUser ? <UserIcon /> : <AIIcon />}
      <div className={`relative group ${bubbleClasses}`}>
         {!isUser && message.content && !isStreaming && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-1 rounded-md bg-gray-800 text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-gray-900 hover:text-white focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            aria-label="Copy message to clipboard"
          >
            {isCopied ? 
                <CheckIcon className="w-4 h-4 text-green-400" /> : 
                <CopyIcon className="w-4 h-4" />
            }
          </button>
        )}
        <div className={contentClasses}>
          {isUser ? (
            <div className="whitespace-pre-wrap">{message.content}</div>
          ) : (
            <>
              <MarkdownRenderer content={message.content} />
              {isStreaming && <TypingIndicator />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;