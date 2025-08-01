// Move the Mistral client initialization inside the functions to avoid client-side issues
import { Mistral } from '@mistralai/mistralai';
import { tools, getFileContent, listFiles, searchInFiles } from './tools';

// Object to store available functions
const availableFunctions = {
  getFileContent,
  listFiles,
  searchInFiles
};

// Function to interact with Mistral AI as an agent
export async function agent(query: string, selectedFileId?: number) {
  // Initialize Mistral client with API key from environment variables
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    throw new Error('MISTRAL_API_KEY is not set in environment variables');
  }

  const client = new Mistral({ apiKey });

  // Messages array to store the conversation
  const messages: any[] = [
    { 
      role: "user", 
      content: selectedFileId 
        ? `Answer this question based on the file with ID ${selectedFileId}: ${query}` 
        : query 
    }
  ];

  // Loop to keep calling tools if needed (max 5 iterations)
  for (let i = 0; i < 5; i++) {
    try {
      // Get response from AI model
      const response = await client.chat.stream({
        model: 'mistral-large-latest',
        messages: messages,
        tools: tools as any
      });

      let fullResponse = '';
      
      for await (const chunk of response) {
        // If AI is done responding, return the final response
        if (chunk.data.choices[0].finishReason === 'stop') {
          console.log('Final response:', fullResponse);
          return fullResponse;
        }
        
        // If AI is generating content, accumulate it
        if (chunk.data.choices[0].finishReason !== 'tool_calls' && chunk.data.choices[0].delta.content) {
          console.log(chunk.data.choices[0].delta.content);
          fullResponse += chunk.data.choices[0].delta.content || '';
        } 
        // If AI is calling a tool, execute it
        else if (chunk.data.choices[0].finishReason === 'tool_calls' && chunk.data.choices[0].delta.toolCalls) {
          console.log("Tool was called");
          
          // Get the function name and arguments
          const toolCall = chunk.data.choices[0].delta.toolCalls[0];
          const functionName = toolCall.function.name;
          console.log('Function name:', functionName);
          
          const functionArgs = JSON.parse(toolCall.function.arguments);
          const toolCallId = toolCall.id;
          
          // Execute the tool function
          const result = await availableFunctions[functionName as keyof typeof availableFunctions](functionArgs);
          console.log('Result from tool:', result);
          
          // Add the tool result to the conversation
          messages.push({ 
            role: 'tool', 
            content: result,
            tool_call_id: toolCallId 
          } as any);
          
          // Break to continue the loop and get next AI response
          break;
        }
      }
    } catch (err) {
      console.error("An error occurred:", err);
      throw new Error("Failed to get response from AI");
    }
  }
  
  throw new Error("Max iterations reached without final response");
}

// Function to generate a response for a user query
export async function generateResponse(query: string, selectedFileId?: number) {
  try {
    const response = await agent(query, selectedFileId);
    return response;
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
}
