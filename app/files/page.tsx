'use client';

import { useState } from 'react';

export default function FilesPage() {
  const [files, setFiles] = useState([
    { id: 1, name: 'Biology_Chapter_5.pdf', size: '2.4 MB', type: 'pdf', uploadDate: '2024-01-15', enabled: true },
    { id: 2, name: 'History_Notes.txt', size: '145 KB', type: 'text', uploadDate: '2024-01-14', enabled: true },
    { id: 3, name: 'Chemistry_Formulas.pdf', size: '1.8 MB', type: 'pdf', uploadDate: '2024-01-13', enabled: false },
    { id: 4, name: 'Literature_Analysis.pdf', size: '3.2 MB', type: 'pdf', uploadDate: '2024-01-12', enabled: true },
    { id: 5, name: 'Physics_Problems.txt', size: '89 KB', type: 'text', uploadDate: '2024-01-11', enabled: true },
    { id: 6, name: 'Math_Equations.pdf', size: '1.1 MB', type: 'pdf', uploadDate: '2024-01-10', enabled: false },
    { id: 7, name: 'Geography_Maps.pdf', size: '4.5 MB', type: 'pdf', uploadDate: '2024-01-09', enabled: true },
    { id: 8, name: 'Economics_Study_Guide.txt', size: '234 KB', type: 'text', uploadDate: '2024-01-08', enabled: true }
  ]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleFile = (id: number) => {
    setFiles(prev => prev.map(file => 
      file.id === id ? { ...file, enabled: !file.enabled } : file
    ));
  };

  const handleDeleteFile = (id: number) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const enabledCount = files.filter(file => file.enabled).length;
  const totalSize = files.reduce((sum, file) => sum + parseFloat(file.size), 0);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <i className="ri-book-open-line text-white text-lg"></i>
            </div>
            <span className="text-xl font-bold text-gray-900 font-pacifico">LearnMate</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
          >
            <i className={`ri-${sidebarOpen ? 'sidebar-fold-line' : 'sidebar-unfold-line'} text-xl`}></i>
          </button>
        </div>
        
        <nav className="p-4 space-y-2">
          <a href="/" className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors">
            <i className="ri-home-line"></i>
            <span>Home</span>
          </a>
          <a href="/solve" className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors">
            <i className="ri-question-line"></i>
            <span>Ask Questions</span>
          </a>
          <a href="/files" className="flex items-center space-x-3 text-blue-600 bg-blue-50 p-2 rounded-lg">
            <i className="ri-folder-line"></i>
            <span>My Files</span>
          </a>
          <a href="/profile" className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors">
            <i className="ri-user-line"></i>
            <span>Profile</span>
          </a>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">File Statistics</h4>
            <p className="text-sm text-blue-800">Enabled: {enabledCount}/{files.length}</p>
            <p className="text-sm text-blue-800">Total Size: {totalSize.toFixed(1)} MB</p>
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
      <div className="flex-1 lg:ml-0">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
          >
            <i className={`ri-${sidebarOpen ? 'sidebar-fold-line' : 'sidebar-unfold-line'} text-xl`}></i>
          </button>
          <h1 className="text-xl font-semibold text-gray-900">My Files</h1>
          <div className="w-8 h-8"></div>
        </div>

        <main className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">File Management</h2>
                  <a href="/solve" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <i className="ri-add-line"></i>
                    Upload New File
                  </a>
                </div>
                <p className="text-gray-600 text-sm">
                  Manage your uploaded files and control which ones the AI considers when answering questions. 
                  Enabled files will be used for context in your conversations.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">All Files ({files.length})</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        File
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Upload Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {files.map((file) => (
                      <tr key={file.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                              <i className={`${file.type === 'pdf' ? 'ri-file-pdf-line' : 'ri-file-text-line'} text-blue-600`}></i>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{file.name}</div>
                              <div className="text-sm text-gray-500">{file.type.toUpperCase()}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {file.size}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {file.uploadDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={file.enabled}
                              onChange={() => handleToggleFile(file.id)}
                              className="sr-only"
                            />
                            <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${file.enabled ? 'bg-blue-600' : 'bg-gray-200'}`}>
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${file.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                            </div>
                            <span className={`ml-3 text-sm font-medium ${file.enabled ? 'text-green-800' : 'text-gray-500'}`}>
                              {file.enabled ? 'Enabled' : 'Disabled'}
                            </span>
                          </label>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors">
                              <i className="ri-eye-line"></i>
                            </button>
                            <button className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50 transition-colors">
                              <i className="ri-download-line"></i>
                            </button>
                            <button 
                              onClick={() => handleDeleteFile(file.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                            >
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}