import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, RefreshCw, Edit } from 'lucide-react';
import { MessageBubbleProps } from '../types';
import CodeBlock from './CodeBlock';

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isLastUserMessage,
  onRegenerate,
  onCopy,
  onEdit,
}) => {
  const isUser = message.role === 'user';
  
  // Format the timestamp
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleCopy = () => {
    onCopy(message.content);
  };

  const handleEdit = () => {
    onEdit(message.id);
  };

  const handleRegenerate = () => {
    onRegenerate();
  };

  return (
    <div
      className={`flex flex-col mb-6 animate-fade-in ${
        isUser ? 'items-end' : 'items-start'
      }`}
    >
      <div className="flex items-center mb-1 text-xs text-neutral-500">
        <span className="font-medium">
          {isUser ? 'You' : 'Enterprise AI Cost Optimiser'}
        </span>
        <span className="mx-2">•</span>
        <span>{formattedTime}</span>
      </div>
      
      <div
        className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 ${
          isUser
            ? 'bg-primary-600 text-white rounded-tr-none'
            : 'bg-neutral-100 text-neutral-800 rounded-tl-none'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="markdown-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <CodeBlock
                      language={match[1]}
                      value={String(children).replace(/\n$/, '')}
                    />
                  ) : (
                    <code
                      className={`${className} font-mono text-sm px-1 py-0.5 rounded ${
                        !inline ? 'block bg-neutral-200 p-4 overflow-x-auto' : 'bg-neutral-200'
                      }`}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                p({ children }) {
                  return <p className="mb-4 last:mb-0">{children}</p>;
                },
                ul({ children }) {
                  return <ul className="list-disc pl-6 mb-4">{children}</ul>;
                },
                ol({ children }) {
                  return <ol className="list-decimal pl-6 mb-4">{children}</ol>;
                },
                li({ children }) {
                  return <li className="mb-1">{children}</li>;
                },
                h1({ children }) {
                  return <h1 className="text-2xl font-bold mb-4">{children}</h1>;
                },
                h2({ children }) {
                  return <h2 className="text-xl font-bold mb-3">{children}</h2>;
                },
                h3({ children }) {
                  return <h3 className="text-lg font-bold mb-2">{children}</h3>;
                },
                a({ href, children }) {
                  return (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      {children}
                    </a>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
      
      {/* Action buttons for message */}
      <div className="flex mt-1 space-x-2">
        {!isUser && (
          <button
            onClick={handleCopy}
            className="text-neutral-500 hover:text-neutral-700 p-1 rounded-full transition-colors flex items-center text-xs"
            aria-label="Copy response"
          >
            <Copy size={14} className="mr-1" />
            <span>Copy</span>
          </button>
        )}
        
        {!isUser && (
          <button
            onClick={handleRegenerate}
            className="text-neutral-500 hover:text-neutral-700 p-1 rounded-full transition-colors flex items-center text-xs"
            aria-label="Regenerate response"
          >
            <RefreshCw size={14} className="mr-1" />
            <span>Regenerate</span>
          </button>
        )}
        
        {isUser && isLastUserMessage && (
          <button
            onClick={handleEdit}
            className="text-neutral-500 hover:text-neutral-700 p-1 rounded-full transition-colors flex items-center text-xs"
            aria-label="Edit message"
          >
            <Edit size={14} className="mr-1" />
            <span>Edit</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;