
import React, { useState, useRef, useEffect } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  isDisabled?: boolean;
}

const SendIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
);

const MicIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
        <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.75 6.75 0 11-13.5 0v-1.5A.75.75 0 016 10.5zM12 21a.75.75 0 01-.75-.75v-2.546a4.5 4.5 0 01-3.375-4.163.75.75 0 011.5 0 3 3 0 006 0 .75.75 0 011.5 0 4.5 4.5 0 01-3.375 4.163V20.25a.75.75 0 01-.75.75z" />
    </svg>
);


const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, isDisabled }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { 
    isListening, 
    transcript, 
    toggleListening, 
    isSpeechRecognitionSupported 
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
        setMessage(prevMessage => prevMessage ? `${prevMessage} ${transcript}`.trim() : transcript);
    }
  }, [transcript]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (message.trim() && !isLoading && !isDisabled) {
      if (isListening) {
        toggleListening();
      }
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleMicClick = () => {
    if (isLoading || isDisabled) return;
    toggleListening();
    textareaRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3 max-w-4xl mx-auto">
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isDisabled ? "Chat is disabled due to a configuration error." : "Type your message, or use the microphone..."}
          rows={1}
          className="w-full bg-gray-700 text-gray-200 rounded-xl py-3 pl-4 pr-12 resize-none border border-transparent focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow duration-200 max-h-40"
          disabled={isLoading || isDisabled}
        />
        {isSpeechRecognitionSupported && (
          <button
            type="button"
            onClick={handleMicClick}
            disabled={isLoading || isDisabled}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors duration-200 disabled:text-gray-500 ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-white'}`}
            aria-label={isListening ? 'Stop listening' : 'Start listening'}
          >
            <MicIcon className="w-6 h-6" />
          </button>
        )}
      </div>
      <button
        type="submit"
        disabled={isLoading || !message.trim() || isDisabled}
        className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center text-white flex-shrink-0 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-800"
        aria-label="Send message"
      >
        {isLoading ? (
            <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
        ) : (
            <SendIcon className="w-6 h-6" />
        )}
      </button>
    </form>
  );
};

export default ChatInput;
