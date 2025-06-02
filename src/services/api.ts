import { EnterpriseAICostOptimiserApiResponse } from '../types';

// Use a relative path for API calls so it works on Vercel and locally
const API_BASE_URL = '/api/chat';

export const sendMessageToEnterpriseAICostOptimiser = async (
  message: string,
  regenerate: boolean = false
): Promise<EnterpriseAICostOptimiserApiResponse> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        context: {
          action: regenerate ? 'regenerate' : 'normal',
        },
      }),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = {};
      }
      throw new Error(errorData.error || 'Failed to get response from Enterprise AI Cost Optimiser');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    let errorMessage = 'An unknown error occurred';
    
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      errorMessage = 'Unable to connect to the server. Please make sure the backend server is running.';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return {
      message: '',
      error: errorMessage,
    };
  }
};