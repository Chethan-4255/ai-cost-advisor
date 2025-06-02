import { ChatState } from '../types';

const STORAGE_KEY = 'enterprise-ai-cost-optimiser-chat-history';

export const saveChat = (chatState: ChatState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chatState));
  } catch (error) {
    console.error('Error saving chat to localStorage:', error);
  }
};

export const loadChat = (): ChatState | null => {
  try {
    const savedChat = localStorage.getItem(STORAGE_KEY);
    if (savedChat) {
      return JSON.parse(savedChat);
    }
    return null;
  } catch (error) {
    console.error('Error loading chat from localStorage:', error);
    return null;
  }
};

export const clearChatHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing chat history:', error);
  }
};