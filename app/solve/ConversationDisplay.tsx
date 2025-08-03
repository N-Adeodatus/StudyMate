'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface Message {
  role: 'user' | 'assistant' | 'tool';
  content: string;
}

interface ConversationDisplayProps {
  messages: Message[];
  isLoading: boolean;
}

function robustLatexPreprocess(content: string): string {
  // 1. Remove $...$ inside $$...$$ blocks
  content = content.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
    let cleaned = math.replace(/\$([^\$]+)\$/g, '$1');
    cleaned = cleaned.replace(/\$/g, '');
    return `$$${cleaned}$$`;
  });

  // 2. Fix \left\frac and \right| mistakes
  content = content.replace(/\\left\\frac/g, '\\left.\\frac');
  content = content.replace(/\\right\$/g, '\\right.');
  content = content.replace(/\\right\|/g, '\\right|');

  // 3. Ensure all \frac have two arguments
  content = content.replace(/\\frac\{([^}]*)\}([^{])/g, '\\frac{$1}{}$2'); // Add empty braces if missing
  content = content.replace(/\\frac\{([^}]*)\}$/g, '\\frac{$1}{}'); // End of string

  // 4. Remove unmatched $ at end of lines
  content = content.replace(/\$(\s*[\n\r])/g, '$1');

  // 5. Optionally, close any unclosed $$ or $ blocks (very basic)
  const numInline = (content.match(/\$/g) || []).length;
  if (numInline % 2 !== 0) content += '$';
  const numBlock = (content.match(/\$\$/g) || []).length;
  if (numBlock % 2 !== 0) content += '$$';

  // 6. Log for debugging
  if (typeof window !== 'undefined') {
    console.log('Robust processed AI content:', content);
  }

  return content;
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
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-4 mb-2" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-lg font-bold mt-3 mb-2" {...props} />,
                    h3: ({node, ...props}) => <h3 className="font-bold mt-2 mb-1" {...props} />,
                    p: ({node, ...props}) => <p className="mb-2" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2" {...props} />,
                    li: ({node, ...props}) => <li className="mb-1" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                    em: ({node, ...props}) => <em className="italic" {...props} />,
                  }}
                >
                  {robustLatexPreprocess(message.content)}
                </ReactMarkdown>
              </div>
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
