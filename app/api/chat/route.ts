import { generateStreamingResponse } from '@/app/solve/mistralClient';

export async function POST(request: Request) {
  try {
    const { query, selectedFileId } = await request.json();
    
    // Create a TransformStream to convert the async generator to a ReadableStream
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();
    
    // Start streaming the response
    (async () => {
      try {
        // Generate streaming response from Mistral AI
        for await (const chunk of generateStreamingResponse(query, selectedFileId)) {
          // Encode the chunk and enqueue it
          const chunkData = `data: ${JSON.stringify({ content: chunk })}\n\n`;
          writer.write(encoder.encode(chunkData));
        }
        
        // Close the stream
        writer.close();
      } catch (error) {
        console.error('Streaming error:', error);
        const errorData = `data: ${JSON.stringify({ error: 'An error occurred while processing your request' })}\n\n`;
        writer.write(encoder.encode(errorData));
        writer.close();
      }
    })();
    
    // Return the stream with proper headers for SSE
    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      }
    });
  } catch (error) {
    console.error('API route error:', error);
    return new Response(
      `data: ${JSON.stringify({ error: 'Failed to process request' })}\n\n`,
      {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        }
      }
    );
  }
}
