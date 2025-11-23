// Placeholder API service
// In a real app, this would handle all API calls to the backend

const API_BASE_URL = 'https://api.aura.example.com';

export interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isUser: boolean;
}

export const api = {
  sendMessage: async (text: string): Promise<Message> => {
    // Placeholder for sending a message
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: Date.now().toString(),
      text: `Echo: ${text}`,
      timestamp: new Date(),
      isUser: false,
    };
  },

  getDevices: async (): Promise<any[]> => {
    // Placeholder for fetching devices
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      { id: '1', name: 'Living Room Light', type: 'light', status: 'on' },
      { id: '2', name: 'Bedroom AC', type: 'ac', status: 'off' },
    ];
  },
};
