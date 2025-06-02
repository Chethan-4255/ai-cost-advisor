export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface ChatContextType {
  chatState: ChatState;
  sendMessage: (message: string) => Promise<void>;
  regenerateResponse: () => Promise<void>;
  copyToClipboard: (text: string) => void;
  editMessage: (messageId: string) => void;
  clearChat: () => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export interface EnterpriseAICostOptimiserApiResponse {
  message: string;
  error?: string;
}

export interface MessageBubbleProps {
  message: Message;
  isLastUserMessage: boolean;
  onRegenerate: () => Promise<void>;
  onCopy: (text: string) => void;
  onEdit: (messageId: string) => void;
}

export interface InputAreaProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
  inputValue: string;
  setInputValue: (value: string) => void;
}

export interface CodeBlockProps {
  language: string;
  value: string;
}

export interface SidebarProps {
  isOpen: boolean;
  onNewChat: () => void;
}

export interface FeedbackToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}