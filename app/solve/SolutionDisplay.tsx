
'use client';

import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

interface SolutionDisplayProps {
  solution: any;
  isLoading: boolean;
  currentProblem: string;
}

export default function SolutionDisplay({ solution, isLoading, currentProblem }: SolutionDisplayProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <h2 className="text-xl font-semibold text-gray-900">Processing your question...</h2>
        </div>
        <div className="space-y-4">
          <div className="bg-gray-100 h-4 rounded animate-pulse"></div>
          <div className="bg-gray-100 h-4 rounded animate-pulse w-3/4"></div>
          <div className="bg-gray-100 h-4 rounded animate-pulse w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!solution) {
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
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Answer</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Your question:</p>
          <p className="font-medium text-gray-900">{solution.problem}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mt-0.5">
              <i className="ri-check-line text-white text-sm"></i>
            </div>
            <div>
              <h3 className="font-semibold text-green-900 mb-2">Answer</h3>
              <BlockMath math={solution.answer} />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Explanation</h3>
          <div className="space-y-4">
            {solution.steps.map((step: any, index: number) => (
              <div key={index} className="flex gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600 mt-1">
                  {step.step}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">{step.description}</h4>
                  <BlockMath math={step.content} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-information-line text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 text-sm mb-1">Additional Context</h4>
              <BlockMath math={solution.explanation} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm whitespace-nowrap">
            <i className="ri-thumb-up-line mr-1"></i>
            Helpful
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm whitespace-nowrap">
            <i className="ri-thumb-down-line mr-1"></i>
            Not Helpful
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm whitespace-nowrap">
            <i className="ri-share-line mr-1"></i>
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
