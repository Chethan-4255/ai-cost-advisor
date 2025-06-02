import React from 'react';
import { PlusCircle, X, MessageSquare } from 'lucide-react';
import { SidebarProps } from '../types';

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onNewChat }) => {
  return (
    <div
      className={`fixed inset-y-0 left-0 z-30 w-72 bg-white border-r border-neutral-200 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}
    >
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-neutral-900">Enterprise AI Cost Optimiser</h1>
          <button
            className="p-1 text-neutral-500 hover:text-neutral-700 md:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>
        
        <button
          onClick={onNewChat}
          className="flex items-center justify-center gap-2 py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors mb-6"
        >
          <PlusCircle size={18} />
          <span>New Chat</span>
        </button>
        
        <div className="flex-grow overflow-y-auto">
          {/* Placeholder for future chat history */}
          <div className="py-8 flex flex-col items-center justify-center text-neutral-500 h-full">
            <MessageSquare size={48} className="mb-4 opacity-30" />
            <p className="text-center text-sm">
              Your conversation history will appear here in future versions
            </p>
          </div>
        </div>
        
        <div className="mt-auto pt-4 border-t border-neutral-200">
          <div className="text-xs text-neutral-500">
            <p className="mb-1">Built by team YANTRAKSH</p>
            <p>© 2025 YANTRAKSH</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;