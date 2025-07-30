
'use client';

import QuickActionCard from '../components/QuickActionCard';
import FeatureCard from '../components/FeatureCard';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple header for homepage */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <i className="ri-book-open-line text-white text-lg"></i>
            </div>
            <span className="text-xl font-bold text-gray-900 font-pacifico">LearnMate</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</Link>
            <Link href="/solve" className="text-gray-700 hover:text-blue-600 transition-colors">Ask Questions</Link>
            <Link href="/files" className="text-gray-700 hover:text-blue-600 transition-colors">My Files</Link>
          </nav>
          <Link href="/solve" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
            Get Started
          </Link>
        </div>
      </header>
      
      <main>
        <section className="relative bg-gradient-to-br from-blue-600 to-purple-700 text-white min-h-[600px] flex items-center">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage: `url('https://readdy.ai/api/search-image?query=Modern%20educational%20technology%20workspace%20with%20books%2C%20notebooks%2C%20digital%20learning%20tools%20and%20study%20materials%20floating%20in%20space%2C%20clean%20minimalist%20background%20with%20soft%20blue%20and%20purple%20gradients%2C%20futuristic%20academic%20atmosphere%2C%20high-tech%20learning%20environment%2C%203D%20rendered%20educational%20symbols%20and%20knowledge%20icons%2C%20professional%20educational%20design&width=1200&height=600&seq=learnmate-hero&orientation=landscape')`
            }}
          ></div>
          
          <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Learn Anything with
                <span className="text-yellow-300"> AI Power</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Upload your textbooks, ask questions, and get detailed explanations instantly. Perfect for students and teachers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/solve" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap">
                  Start Learning
                </Link>
                <Link href="/solve" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors whitespace-nowrap">
                  Ask Questions
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link href="/solve">
                <QuickActionCard
                  title="Ask Questions"
                  description="Type your questions and get instant detailed answers"
                  icon="ri-question-line"
                  href="/solve"
                  color="bg-blue-600"
                />
              </Link>
              <Link href="/solve">
                <QuickActionCard
                  title="Upload Files"
                  description="Upload textbooks, worksheets, or documents for analysis"
                  icon="ri-upload-cloud-2-line"
                  href="/solve"
                  color="bg-green-600"
                />
              </Link>
              <Link href="/files">
                <QuickActionCard
                  title="Manage Files"
                  description="View and manage your uploaded files and settings"
                  icon="ri-folder-line"
                  href="/files"
                  color="bg-purple-600"
                />
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Why Choose LearnMate?</h2>
            <p className="text-center text-gray-600 mb-12 text-lg">Powerful features designed for modern learning</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                title="AI-Powered Answers"
                description="Get detailed step-by-step explanations for any subject or topic"
                icon="ri-brain-line"
              />
              <FeatureCard
                title="File Upload Support"
                description="Upload textbooks, PDFs, and documents to ask questions about specific content"
                icon="ri-file-upload-line"
              />
              <FeatureCard
                title="Interactive Learning"
                description="Visualize concepts with diagrams, charts, and interactive explanations"
                icon="ri-line-chart-line"
              />
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-100 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Learn Better?</h2>
            <p className="text-lg text-gray-600 mb-8">Join thousands of students and teachers using LearnMate to improve their learning experience</p>
            <Link href="/solve" className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-lg whitespace-nowrap">
              Get Started Now
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
