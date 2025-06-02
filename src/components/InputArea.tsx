import React, { useState, useRef, useEffect } from 'react';
import { Send, Square } from 'lucide-react';
import { InputAreaProps } from '../types';

const InputArea: React.FC<InputAreaProps> = ({
  onSendMessage,
  isLoading,
  inputValue,
  setInputValue,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  const resizeTextarea = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto';
    
    // Set new height based on scrollHeight (clamped between min and max height)
    const newHeight = Math.min(Math.max(textarea.scrollHeight, 56), 200);
    textarea.style.height = `${newHeight}px`;
  };

  // Resize textarea when input value changes
  useEffect(() => {
    resizeTextarea();
  }, [inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send message on Enter (but not with Shift+Enter)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() && !isLoading) {
      await onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="sticky bottom-0 w-full bg-white border-t border-neutral-200 py-4 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="relative flex items-end bg-white rounded-lg border border-neutral-300 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500 transition-all">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Message Enterprise AI Cost Optimiser..."
            className="w-full py-3 pl-4 pr-12 resize-none outline-none bg-transparent text-neutral-800 max-h-[200px] min-h-[56px]"
            rows={1}
            disabled={isLoading}
          />
          
          <div className="absolute right-2 bottom-2 flex">
            {isLoading ? (
              <button
                onClick={() => {/* TODO: Implement stop generation */}}
                className="p-2 text-error-600 hover:text-error-800 rounded-full transition-colors"
                aria-label="Stop generating"
              >
                <Square size={20} />
              </button>
            ) : (
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className={`p-2 rounded-full transition-colors ${
                  inputValue.trim()
                    ? 'text-primary-600 hover:text-primary-800'
                    : 'text-neutral-400 cursor-not-allowed'
                }`}
                aria-label="Send message"
              >
                <Send size={20} />
              </button>
            )}
          </div>
        </div>
        
        <div className="flex justify-between text-xs text-neutral-500 mt-2 px-1">
          <div>Press Enter to send, Shift+Enter for new line</div>
          {isLoading && <div className="text-primary-600 animate-pulse">Enterprise AI Cost Optimiser is thinking...</div>}
        </div>
      </div>
    </div>
  );
};

export default InputArea;