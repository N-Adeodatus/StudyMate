'use server';

import { generateResponse, getConversationHistory, clearConversationHistory } from './mistralClient';

export async function getAIResponse(query: string, selectedFileId?: number) {
  try {
    const response = await generateResponse(query, selectedFileId);
    return { success: true, data: response };
  } catch (error) {
    console.error('Error generating response:', error);
    return { success: false, error: 'Failed to generate response' };
  }
}

export async function getConversationHistoryAction() {
  return getConversationHistory();
}

export async function clearConversationHistoryAction() {
  clearConversationHistory();
  return { success: true };
}
