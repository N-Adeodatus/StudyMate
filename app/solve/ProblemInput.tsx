
'use client';

import { useState } from 'react';

interface ProblemInputProps {
  onSolve: (problem: string) => void;
  isLoading: boolean;
  onAttachClick: () => void;
  onCameraClick: () => void;
}

export default function ProblemInput({ onSolve, isLoading, onAttachClick, onCameraClick }: ProblemInputProps) {
  const [problem, setProblem] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (problem.trim()) {
      onSolve(problem.trim());
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Ask a Question</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="Ask any question about any subject..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
            rows={4}
            maxLength={500}
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {problem.length}/500 characters
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!problem.trim() || isLoading}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
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
          
          <button
            type="button"
            onClick={onAttachClick}
            className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <i className="ri-attachment-line text-gray-600"></i>
          </button>
          
          <button
            type="button"
            onClick={onCameraClick}
            className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <i className="ri-camera-line text-gray-600"></i>
          </button>
          
          <button
            type="button"
            onClick={() => setProblem('')}
            className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <i className="ri-delete-bin-line text-gray-600"></i>
          </button>
        </div>
      </form>
    </div>
  );
}