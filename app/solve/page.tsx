
'use client';

import { useState, useEffect, useRef } from 'react';
import ProblemInput from './ProblemInput';
import FileUpload from '../../components/FileUpload';
import QuestionInterface from '../../components/QuestionInterface';
import ConversationDisplay from './ConversationDisplay';
import { getConversationHistoryAction, clearConversationHistoryAction } from './actions';

export default function SolvePage() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant' | 'tool'; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [history, setHistory] = useState([
    { id: 1, question: 'Explain photosynthesis', timestamp: '2024-01-15 10:30' },
    { id: 2, question: 'What causes World War I?', timestamp: '2024-01-15 09:45' },
    { id: 3, question: 'How to solve quadratic equations?', timestamp: '2024-01-14 16:20' },
    { id: 4, question: 'Explain DNA structure', timestamp: '2024-01-14 14:15' },
    { id: 5, question: 'What is machine learning?', timestamp: '2024-01-13 11:30' },
    { id: 6, question: 'History of ancient Rome', timestamp: '2024-01-13 09:10' },
    { id: 7, question: 'Chemical bonding types', timestamp: '2024-01-12 15:45' },
    { id: 8, question: 'Shakespeare sonnets analysis', timestamp: '2024-01-12 13:20' }
  ]);
  
  const currentAssistantMessageRef = useRef('');

  // Load conversation history on component mount
  useEffect(() => {
    loadConversationHistory();
  }, []);

  const loadConversationHistory = async () => {
    try {
      const history = await getConversationHistoryAction();
      setMessages(history);
    } catch (error) {
      console.error('Error loading conversation history:', error);
    }
  };

  const handleSolve = async (problem: string) => {
    setIsLoading(true);
    
    // Add user message to conversation
    const userMessage = { role: 'user' as const, content: problem };
    setMessages(prev => [...prev, userMessage]);
    
    // Add to history
    const newHistoryItem = {
      id: Date.now(),
      question: problem,
      timestamp: new Date().toLocaleString()
    };
    setHistory(prev => [newHistoryItem, ...prev]);
    
    try {
      // Create a new assistant message placeholder
      const assistantMessage = { role: 'assistant' as const, content: '' };
      setMessages(prev => [...prev, assistantMessage]);
      currentAssistantMessageRef.current = '';
      
      // Make a POST request to the streaming API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: problem,
          selectedFileId: selectedFile?.id
        })
      });
      
      if (!response.body) {
        throw new Error('ReadableStream not supported');
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      // Read the stream
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }
        
        // Decode the chunk
        const chunk = decoder.decode(value, { stream: true });
        
        // Parse the SSE format
        const lines = chunk.split('\n\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.error) {
                // Handle error
                setMessages(prev => {
                  const newMessages = [...prev];
                  const lastMessage = newMessages[newMessages.length - 1];
                  if (lastMessage.role === 'assistant') {
                    lastMessage.content = 'Sorry, I encountered an error while processing your question. Please try again.';
                  }
                  return newMessages;
                });
                break;
              }
              
              // Update the assistant message with the new chunk
              currentAssistantMessageRef.current += data.content;
              setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage.role === 'assistant') {
                  lastMessage.content = currentAssistantMessageRef.current;
                }
                return newMessages;
              });
            } catch (e) {
              console.error('Error parsing JSON:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error generating response:', error);
      // Add error message to conversation
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage.role === 'assistant') {
          lastMessage.content = 'Sorry, I encountered an error while processing your question. Please try again.';
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearConversation = async () => {
    try {
      await clearConversationHistoryAction();
      setMessages([]);
      currentAssistantMessageRef.current = '';
    } catch (error) {
      console.error('Error clearing conversation:', error);
    }
  };

  const handleFileUpload = (files: any[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
    setShowFileUpload(false);
  };

  const handleAttachClick = () => {
    setShowFileUpload(!showFileUpload);
  };

  const handleCameraClick = () => {
    // Trigger camera capture
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const mockFile = {
          id: Date.now(),
          name: file.name,
          type: 'image',
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          status: 'processed'
        };
        setUploadedFiles(prev => [...prev, mockFile]);
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${sidebarOpen ? 'w-64' : 'w-16'} ${!sidebarOpen ? 'max-sm:hidden' : ''}`}> 
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            {sidebarOpen && (
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <i className="ri-book-open-line text-white text-lg"></i>
              </div>
            )}
            {sidebarOpen && (
              <span className="text-xl font-bold text-gray-900 font-pacifico">LearnMate</span>
            )}
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
          >
            <i className={`ri-${sidebarOpen ? 'sidebar-fold-line' : 'sidebar-unfold-line'} text-xl`}></i>
          </button>
        </div>
        <div className="flex flex-col flex-1">
          <nav className="p-4 space-y-2">
            <a href="/" className={`flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors ${sidebarOpen ? 'justify-start' : 'justify-center'}`}> 
              <i className="ri-home-line text-lg"></i>
              {sidebarOpen && <span>Home</span>}
            </a>
            <a href="/solve" className={`flex items-center space-x-3 text-blue-600 bg-blue-50 p-2 rounded-lg ${sidebarOpen ? 'justify-start' : 'justify-center'}`}> 
              <i className="ri-question-line text-lg"></i>
              {sidebarOpen && <span>Ask Questions</span>}
            </a>
            <a href="/files" className={`flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors ${sidebarOpen ? 'justify-start' : 'justify-center'}`}> 
              <i className="ri-folder-line text-lg"></i>
              {sidebarOpen && <span>My Files</span>}
            </a>
          </nav>
          {sidebarOpen && (
            <div className="p-4 border-t border-gray-200 flex-1">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent History</h3>
              <div className="space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 380px)' }}>
                {history.map((item) => (
                  <div key={item.id} className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer group">
                    <p className="text-sm text-gray-900 line-clamp-2 group-hover:text-blue-600">{item.question}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.timestamp}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="p-4 border-t border-gray-200 mt-auto mb-12">
            <button 
              onClick={handleClearConversation}
              className="w-full flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors justify-center mb-2"
            >
              <i className="ri-delete-bin-line"></i>
              {sidebarOpen && <span>Clear Chat</span>}
            </button>
            <button className="w-full flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors justify-center">
              <i className="ri-logout-box-line"></i>
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div className={`flex-1 lg:ml-0 flex flex-col ${sidebarOpen ? 'lg:ml-64' : ''} ${!sidebarOpen ? 'md:ml-14' : ''} ${!sidebarOpen ? 'sm:ml-24' : ''}`}>
        <button 
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-30 w-8 h-8  rounded-lg flex items-center justify-center hover:bg-gray-100"
          // bg-white border border-gray-200 shadow-md
        >
          <i className="ri-sidebar-unfold-line text-xl"></i>
        </button>

        {/* Logo in main content when sidebar is collapsed */}
        {!sidebarOpen && (
          <div className="flex items-center space-x-2 ml-20 mt-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <i className="ri-book-open-line text-white text-base"></i>
            </div>
            <span className="text-xl font-bold text-gray-900 font-pacifico">LearnMate</span>
          </div>
        )}

        <main className="p-6 flex items-center justify-center min-h-screen">
          <div className={`w-full space-y-6 ${sidebarOpen ? 'max-w-5xl' : 'max-w-4xl'}`}>
            {showFileUpload && (
              <FileUpload onUpload={handleFileUpload} />
            )}
            
            {uploadedFiles.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Files</h3>
                <div className="space-y-3">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                        selectedFile?.id === file.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedFile(file)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <i className={`${file.type === 'pdf' ? 'ri-file-pdf-line' : file.type === 'image' ? 'ri-image-line' : 'ri-file-text-line'} text-blue-600 text-xl`}></i>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{file.name}</h4>
                          <p className="text-sm text-gray-600">{file.size} • {file.type.toUpperCase()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Processed
                          </span>
                          <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">
                            <i className="ri-more-2-line text-gray-600"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <ConversationDisplay 
              messages={messages} 
              isLoading={isLoading} 
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {selectedFile && (
                <QuestionInterface selectedFile={selectedFile} />
              )}
            </div>

            <ProblemInput 
              onSolve={handleSolve} 
              isLoading={isLoading} 
              onAttachClick={handleAttachClick}
              onCameraClick={handleCameraClick}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
