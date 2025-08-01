'use client';

import { useState, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant' | 'tool';
  content: string;
}

interface ConversationDisplayProps {
  messages: Message[];
  isLoading: boolean;
}

export default function ConversationDisplay({ messages, isLoading }: ConversationDisplayProps) {
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);

  useEffect(() => {
    setDisplayedMessages(messages);
  }, [messages]);

  if (displayedMessages.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-question-line text-2xl text-gray-400"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ask a Question</h3>
          <p className="text-gray-600">Type your question and get a detailed explanation</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="space-y-6">
        {displayedMessages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user' 
                  ? 'bg-blue-500 text-white rounded-br-none' 
                  : message.role === 'assistant'
                  ? 'bg-gray-100 text-gray-800 rounded-bl-none'
                  : 'bg-green-100 text-green-800 rounded-bl-none'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {message.role === 'user' ? (
                  <i className="ri-user-line text-sm"></i>
                ) : message.role === 'assistant' ? (
                  <i className="ri-robot-line text-sm"></i>
                ) : (
                  <i className="ri-tools-line text-sm"></i>
                )}
                <span className="text-xs font-medium">
                  {message.role === 'user' ? 'You' : message.role === 'assistant' ? 'AI Assistant' : 'Tool'}
                </span>
              </div>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-4 bg-gray-100 text-gray-800 rounded-bl-none">
              <div className="flex items-center gap-2 mb-1">
                <i className="ri-robot-line text-sm"></i>
                <span className="text-xs font-medium">AI Assistant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
