// API client for communicating with the backend

// Read from environment variable (can be configured in .env)
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export type ChatResponse = {
  reply: string;
  type: 'chat' | 'code' | 'device';
  intent?: any;
};

export async function sendChatMessage(userId: string, message: string): Promise<ChatResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        message,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();

    // Validate response structure
    if (!data.reply || !data.type) {
      throw new Error('Invalid response from server');
    }

    return {
      reply: data.reply,
      type: data.type,
      intent: data.intent,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Network request failed') || error.message.includes('fetch')) {
        throw new Error('Unable to connect to the server. Please check your internet connection.');
      }
      throw error;
    }
    throw new Error('An unexpected error occurred while sending your message.');
  }
}
