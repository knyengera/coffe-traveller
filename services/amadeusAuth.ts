import axios from 'axios';

const API_BASE_URL = 'https://test.api.amadeus.com/v1';
const AUTH_URL = 'https://test.api.amadeus.com/v1/security/oauth2/token';

let accessToken: string | null = null;
let tokenExpiry: number | null = null;

export const getAccessToken = async (): Promise<string> => {
  // Check if we have a valid token
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  const clientId = process.env.EXPO_PUBLIC_AMADEUS_API_KEY;
  const clientSecret = process.env.EXPO_PUBLIC_AMADEUS_API_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Amadeus API credentials not found in environment variables');
  }

  try {
    const response = await axios.post(
      AUTH_URL,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    if (!response.data.access_token) {
      throw new Error('No access token received from Amadeus API');
    }

    accessToken = response.data.access_token;
    // Set token expiry to 25 minutes (token is valid for 30 minutes)
    tokenExpiry = Date.now() + 25 * 60 * 1000;

    return accessToken as string;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Amadeus API Error:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with Amadeus API. Please check your credentials.');
    }
    throw error;
  }
}; 