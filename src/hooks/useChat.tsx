import { useState, useEffect, useCallback } from 'react';
import { ChatState, Message } from '../types';
import { sendMessageToEnterpriseAICostOptimiser } from '../services/api';
import { saveChat, loadChat, clearChatHistory } from '../utils/localStorage';

export const useChat = () => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [feedbackToast, setFeedbackToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  // Load chat history from localStorage on initial render
  useEffect(() => {
    const savedChat = loadChat();
    if (savedChat) {
      setChatState(savedChat);
    }
  }, []);

  // Save chat to localStorage whenever messages change
  useEffect(() => {
    if (chatState.messages.length > 0) {
      saveChat(chatState);
    }
  }, [chatState.messages]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Generate a unique ID for the new message
    const newUserMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    // Update state with the new user message
    setChatState((prev) => ({
      ...prev,
      messages: [...prev.messages, newUserMessage],
      isLoading: true,
      error: null,
    }));

    try {
      const response = await sendMessageToEnterpriseAICostOptimiser(content);

      if (response.error) {
        setChatState((prev) => ({
          ...prev,
          isLoading: false,
          error: response.error ?? null,
        }));
        return;
      }

      // Add the assistant's response
      const newAssistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.message,
        timestamp: Date.now(),
      };

      setChatState((prev) => ({
        ...prev,
        messages: [...prev.messages, newAssistantMessage],
        isLoading: false,
      }));
    } catch (error) {
      setChatState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      }));
    }
  }, []);

  const regenerateResponse = useCallback(async () => {
    // Find the last user message to regenerate a response for
    const lastUserMessageIndex = [...chatState.messages].reverse().findIndex(
      (msg) => msg.role === 'user'
    );

    if (lastUserMessageIndex === -1) return;

    const lastUserMessage = 
      chatState.messages[chatState.messages.length - 1 - lastUserMessageIndex];

    // Remove the last assistant message (if it exists)
    let updatedMessages = [...chatState.messages];
    if (
      updatedMessages.length > 0 &&
      updatedMessages[updatedMessages.length - 1].role === 'assistant'
    ) {
      updatedMessages = updatedMessages.slice(0, -1);
    }

    setChatState((prev) => ({
      ...prev,
      messages: updatedMessages,
      isLoading: true,
      error: null,
    }));

    try {
      const response = await sendMessageToEnterpriseAICostOptimiser(lastUserMessage.content, true);

      if (response.error) {
        setChatState((prev) => ({
          ...prev,
          isLoading: false,
          error: response.error ?? null,
        }));
        return;
      }

      // Add the new assistant response
      const newAssistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.message,
        timestamp: Date.now(),
      };

      setChatState((prev) => ({
        ...prev,
        messages: [...prev.messages, newAssistantMessage],
        isLoading: false,
      }));
    } catch (error) {
      setChatState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      }));
    }
  }, [chatState.messages]);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setFeedbackToast({
          message: 'Copied to clipboard!',
          type: 'success',
        });
        
        // Auto-dismiss after 2 seconds
        setTimeout(() => {
          setFeedbackToast(null);
        }, 2000);
      })
      .catch((error) => {
        console.error('Failed to copy text:', error);
        setFeedbackToast({
          message: 'Failed to copy text',
          type: 'error',
        });
        
        // Auto-dismiss after 2 seconds
        setTimeout(() => {
          setFeedbackToast(null);
        }, 2000);
      });
  }, []);

  const editMessage = useCallback((messageId: string) => {
    const messageToEdit = chatState.messages.find((msg) => msg.id === messageId);
    if (!messageToEdit) return;

    // Remove this message and all subsequent messages
    const messageIndex = chatState.messages.findIndex((msg) => msg.id === messageId);
    
    if (messageIndex !== -1) {
      setChatState((prev) => ({
        ...prev,
        messages: prev.messages.slice(0, messageIndex),
      }));
      
      // Return the content of the message for editing
      return messageToEdit.content;
    }
    
    return '';
  }, [chatState.messages]);

  const clearChat = useCallback(() => {
    setChatState({
      messages: [],
      isLoading: false,
      error: null,
    });
    clearChatHistory();
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  return {
    chatState,
    sendMessage,
    regenerateResponse,
    copyToClipboard,
    editMessage,
    clearChat,
    isSidebarOpen,
    toggleSidebar,
    feedbackToast,
    setFeedbackToast,
  };
};

export default useChat;