import React, { useRef, useEffect, useState } from 'react';
import MessageBubble from './MessageBubble';
import InputArea from './InputArea';
import { ChatState, Message } from '../types';

interface ChatPanelProps {
  chatState: ChatState;
  sendMessage: (message: string) => Promise<void>;
  regenerateResponse: () => Promise<void>;
  copyToClipboard: (text: string) => void;
  editMessage: (messageId: string) => void;
  isSidebarOpen: boolean;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
  chatState,
  sendMessage,
  regenerateResponse,
  copyToClipboard,
  editMessage,
  isSidebarOpen,
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading } = chatState;

  // Scroll to bottom when messages change or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle message editing
  const handleEditMessage = (messageId: string) => {
    const content = editMessage(messageId);
    if (content) {
      setInputValue(content);
    }
  };

  const getLastUserMessageIndex = (): number => {
    return [...messages].reverse().findIndex((msg) => msg.role === 'user');
  };

  const isLastUserMessage = (message: Message): boolean => {
    if (message.role !== 'user') return false;
    
    const lastUserMsgIndex = getLastUserMessageIndex();
    if (lastUserMsgIndex === -1) return false;
    
    const lastUserMsg = messages[messages.length - 1 - lastUserMsgIndex];
    return message.id === lastUserMsg.id;
  };

  const renderWelcomeScreen = () => (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto px-4 text-center">
      <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-neutral-900 mb-3">
        Welcome to Enterprise AI Cost Optimiser
      </h1>
      <p className="text-neutral-600 mb-8 max-w-md">
        Get expert advice and assistance from Enterprise AI Cost Optimiser, built by team YANTRAKSH. Ask a question or describe what you need help with.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-xl">
        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
          <h3 className="font-medium mb-2 text-neutral-800">Ask about data analysis</h3>
          <p className="text-sm text-neutral-600">
            "How can I analyze customer churn in my SaaS business?"
          </p>
        </div>
        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
          <h3 className="font-medium mb-2 text-neutral-800">Get recommendations</h3>
          <p className="text-sm text-neutral-600">
            "What marketing strategies work best for B2B startups?"
          </p>
        </div>
        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
          <h3 className="font-medium mb-2 text-neutral-800">Request explanations</h3>
          <p className="text-sm text-neutral-600">
            "Explain the impact of AI on healthcare in simple terms."
          </p>
        </div>
        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
          <h3 className="font-medium mb-2 text-neutral-800">Solve problems</h3>
          <p className="text-sm text-neutral-600">
            "How can I improve my team's productivity while working remotely?"
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`flex flex-col h-screen ${
        isSidebarOpen ? 'md:pl-72' : 'pl-0'
      } transition-all duration-300`}
    >
      <main className="flex-1 overflow-y-auto bg-white">
        {messages.length === 0 ? (
          renderWelcomeScreen()
        ) : (
          <div className="py-8 px-4 md:px-48">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isLastUserMessage={isLastUserMessage(message)}
                onRegenerate={regenerateResponse}
                onCopy={copyToClipboard}
                onEdit={handleEditMessage}
              />
            ))}
            
            {chatState.error && (
              <div className="flex items-start mb-6">
                <div className="flex flex-col">
                  <div className="flex items-center mb-1 text-xs text-neutral-500">
                    <span className="font-medium">Error</span>
                    <span className="mx-2">•</span>
                    <span>Now</span>
                  </div>
                  <div className="bg-red-50 text-red-800 rounded-2xl rounded-tl-none p-4 max-w-[85%] md:max-w-[75%] border border-red-200">
                    {chatState.error}
                  </div>
                </div>
              </div>
            )}
            
            {isLoading && (
              <div className="flex items-start mb-6 animate-pulse-slow">
                <div className="flex flex-col">
                  <div className="flex items-center mb-1 text-xs text-neutral-500">
                    <span className="font-medium">Enterprise AI Cost Optimiser</span>
                    <span className="mx-2">•</span>
                    <span>Now</span>
                  </div>
                  <div className="bg-neutral-100 text-neutral-800 rounded-2xl rounded-tl-none p-4 max-w-[85%] md:max-w-[75%]">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>
      
      <InputArea
        onSendMessage={sendMessage}
        isLoading={isLoading}
        inputValue={inputValue}
        setInputValue={setInputValue}
      />
    </div>
  );
};

export default ChatPanel;