// Mock data for file information
const mockFiles = [
  { id: 1, name: 'Biology_Chapter_5.pdf', content: 'This is the content of the biology chapter 5 PDF file. It contains information about photosynthesis and cellular respiration.' },
  { id: 2, name: 'History_Notes.txt', content: 'These are history notes covering World War I and II, including key dates, figures, and events.' },
  { id: 3, name: 'Chemistry_Formulas.pdf', content: 'This PDF contains important chemistry formulas and equations for organic and inorganic chemistry.' },
  { id: 4, name: 'Literature_Analysis.pdf', content: 'Literary analysis of Shakespeare\'s Hamlet, including themes, characters, and plot summary.' },
  { id: 5, name: 'Physics_Problems.txt', content: 'Collection of physics problems and solutions covering mechanics, thermodynamics, and electromagnetism.' },
  { id: 6, name: 'Math_Equations.pdf', content: 'Comprehensive guide to mathematical equations including algebra, calculus, and geometry formulas.' },
  { id: 7, name: 'Geography_Maps.pdf', content: 'Geographical maps and information about world continents, countries, and major cities.' },
  { id: 8, name: 'Economics_Study_Guide.txt', content: 'Economics study guide covering supply and demand, market structures, and economic indicators.' }
];

// Function to get file content by file ID
export async function getFileContent({ fileId }: { fileId: number }) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const file = mockFiles.find(f => f.id === fileId);
  if (file) {
    return JSON.stringify({ content: file.content });
  }
  return JSON.stringify({ error: 'File not found.' });
}

// Function to list available files
export async function listFiles() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return JSON.stringify({ 
    files: mockFiles.map(f => ({ id: f.id, name: f.name })) 
  });
}

// Function to search within files
export async function searchInFiles({ query }: { query: string }) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const results = mockFiles
    .filter(f => f.content.toLowerCase().includes(query.toLowerCase()))
    .map(f => ({ id: f.id, name: f.name, excerpt: f.content.substring(0, 100) + '...' }));
  
  return JSON.stringify({ results });
}

// Tools definition for Mistral AI
export const tools = [
  {
    type: "function",
    function: {
      name: "getFileContent",
      description: "Get the content of a specific file by its ID",
      parameters: {
        type: "object",
        properties: {
          fileId: {
            type: "number",
            description: "The ID of the file to retrieve content for.",
          }
        },
        required: ["fileId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "listFiles",
      description: "List all available files with their IDs and names",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "searchInFiles",
      description: "Search for a query across all files and return relevant excerpts",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The search query to look for in files.",
          }
        },
        required: ["query"],
      },
    },
  }
];
