import React, { useState, useCallback, useEffect } from 'react';
import { ChatMessage, MessageRole } from './types';
import { streamChatResponse, initError as geminiInitError } from './services/geminiService';
import ChatInterface from './components/ChatInterface';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: MessageRole.AI,
      content: "Hello, Somali Programmer! I'm your personal AI assistant. How can I help you today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (geminiInitError) {
      setError(`Initialization Error: ${geminiInitError}`);
    }
  }, []);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    if (geminiInitError) {
      setError(`Initialization Error: ${geminiInitError}`);
      return;
    }

    setError(null);
    const userMessage: ChatMessage = { role: MessageRole.USER, content: message };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);

    // Add a placeholder for the AI response
    setMessages(prevMessages => [...prevMessages, { role: MessageRole.AI, content: '' }]);

    try {
      const stream = await streamChatResponse(message);

      for await (const chunk of stream) {
        const chunkText = chunk.text;
        setMessages(prevMessages => {
          const newMessages = [...prevMessages];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.role === MessageRole.AI) {
            lastMessage.content += chunkText;
          }
          return newMessages;
        });
      }
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        setError(errorMessage);
        setMessages(prevMessages => {
            const newMessages = [...prevMessages];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage.role === MessageRole.AI) {
                lastMessage.content = errorMessage; // Display the specific error message directly
            }
            return newMessages;
        });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
      <header className="bg-gray-800 shadow-md p-4 flex items-center">
        <img src="/icon.png" alt="Somali Programmer AI Bot Icon" className="h-8 w-8 rounded-full mr-3" />
        <h1 className="text-xl font-bold text-gray-100">Somali Programmer AI Bot</h1>
      </header>
      <ChatInterface
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
        error={error}
        isChatDisabled={!!geminiInitError}
      />
    </div>
  );
};

export default App;
