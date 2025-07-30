'use client';

import { useState } from 'react';

interface QuestionInterfaceProps {
  selectedFile: any;
}

export default function QuestionInterface({ selectedFile }: QuestionInterfaceProps) {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setAnswer(`Based on the content in "${selectedFile.name}", here's the answer to your question: ${question}\n\nThis is a detailed explanation that would be generated based on the uploaded file content. The system would analyze the document and provide relevant information to answer your specific question.`);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Ask About This File</h3>
      
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <i className={`${selectedFile.type === 'pdf' ? 'ri-file-pdf-line' : 'ri-file-text-line'} text-blue-600`}></i>
          </div>
          <div>
            <p className="font-medium text-gray-900">{selectedFile.name}</p>
            <p className="text-sm text-gray-600">{selectedFile.size}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="file-question" className="block text-sm font-medium text-gray-700 mb-2">
            Your Question
          </label>
          <textarea
            id="file-question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about this file..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            maxLength={500}
          />
          <p className="text-xs text-gray-500 mt-1">{question.length}/500 characters</p>
        </div>

        <button
          type="submit"
          disabled={!question.trim() || isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </>
          ) : (
            <>
              <i className="ri-send-plane-line"></i>
              Send
            </>
          )}
        </button>
      </form>

      {answer && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-900 mb-2">Answer</h4>
          <p className="text-green-800 whitespace-pre-line">{answer}</p>
        </div>
      )}
    </div>
  );
}