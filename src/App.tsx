import React from 'react';
import { Menu } from 'lucide-react';
import useChat from './hooks/useChat';
import Sidebar from './components/Sidebar';
import ChatPanel from './components/ChatPanel';
import FeedbackToast from './components/FeedbackToast';

function App() {
  const {
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
  } = useChat();

  return (
    <div className="flex h-screen overflow-hidden bg-white text-neutral-900 font-sans">
      {/* Mobile sidebar toggle */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 left-4 z-40 md:hidden p-2 bg-white rounded-md shadow-md transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        aria-label="Toggle sidebar"
      >
        <Menu size={20} />
      </button>
      
      {/* Sidebar overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onNewChat={clearChat} />
      
      {/* Chat Panel */}
      <ChatPanel
        chatState={chatState}
        sendMessage={sendMessage}
        regenerateResponse={regenerateResponse}
        copyToClipboard={copyToClipboard}
        editMessage={editMessage}
        isSidebarOpen={isSidebarOpen}
      />
      
      {/* Feedback Toast */}
      {feedbackToast && (
        <FeedbackToast
          message={feedbackToast.message}
          type={feedbackToast.type}
          onClose={() => setFeedbackToast(null)}
        />
      )}
    </div>
  );
}

export default App;