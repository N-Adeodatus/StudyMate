
'use client';

import { useState } from 'react';
import ProblemInput from './ProblemInput';
import FileUpload from '../../components/FileUpload';
import QuestionInterface from '../../components/QuestionInterface';

type Solution = {
  problem: string;
  steps: { step: number; description: string; content: string }[];
  answer: string;
  explanation: string;
};

export default function SolvePage() {
  const [currentProblem, setCurrentProblem] = useState('');
  const [solution, setSolution] = useState<Solution | null>(null);
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

  const handleSolve = async (problem: string) => {
    setIsLoading(true);
    setCurrentProblem(problem);
    
    // Add to history
    const newHistoryItem = {
      id: Date.now(),
      question: problem,
      timestamp: new Date().toLocaleString()
    };
    setHistory(prev => [newHistoryItem, ...prev]);
    
    // Simulate API call
    setTimeout(() => {
      setSolution({
        problem: problem,
        steps: [
          { step: 1, description: 'Analyze the question', content: problem },
          { step: 2, description: 'Identify key concepts', content: 'Break down the main components and relationships' },
          { step: 3, description: 'Apply relevant knowledge', content: 'Use appropriate principles and methods' },
          { step: 4, description: 'Provide detailed explanation', content: 'Explain the reasoning and final answer' }
        ],
        answer: 'Here is the comprehensive answer to your question.',
        explanation: 'This question can be answered by applying fundamental principles and logical reasoning.'
      });
      setIsLoading(false);
    }, 2000);
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
            <ProblemInput 
              onSolve={handleSolve} 
              isLoading={isLoading} 
              onAttachClick={handleAttachClick}
              onCameraClick={handleCameraClick}
            />
            
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {selectedFile && (
                <QuestionInterface selectedFile={selectedFile} />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
