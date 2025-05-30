import axios from 'axios';
import { getAccessToken } from '@/services/amadeusAuth';

const API_BASE_URL = 'https://test.api.amadeus.com/v1';

export interface FlightSearchParams {
  origin?: string;
  departureDate?: string;
  oneWay?: boolean;
  duration?: number;
  nonStop?: boolean;
  maxPrice?: number;
  viewBy?: 'COUNTRY' | 'DESTINATION' | 'DATE';
}

export interface FlightDetails {
  type: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  price: {
    total: string;
  };
  links: {
    flightDates: string;
    flightOffers: string;
  };
  dictionaries?: {
    currencies: Record<string, string>;
    locations: Record<string, {
      subType: string;
      detailedName: string;
    }>;
  };
}

export interface FlightSearchResponse {
  data: FlightDetails[];
  dictionaries: {
    currencies: Record<string, string>;
    locations: Record<string, {
      subType: string;
      detailedName: string;
    }>;
  };
  meta: {
    currency: string;
    links: {
      self: string;
    };
    defaults: {
      departureDate: string;
      oneWay: boolean;
      duration: string;
      nonStop: boolean;
      viewBy: string;
    };
  };
  warnings: any[];
}

export const searchFlights = async (params: FlightSearchParams): Promise<FlightSearchResponse> => {
  try {
    const accessToken = await getAccessToken();
    
    // Validate origin IATA code
    if (params.origin && !/^[A-Z]{3}$/.test(params.origin)) {
      throw new Error('Invalid origin airport code. Please use a valid 3-letter IATA code.');
    }
   
    // Add retry logic for 500 errors
    let retries = 3;
    let lastError;

    while (retries > 0) {
      try {
        const response = await axios.get<FlightSearchResponse>(`${API_BASE_URL}/shopping/flight-destinations`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          params: {
            origin: params.origin,
            departureDate: params.departureDate,
            oneWay: params.oneWay ?? false,
            duration: params.duration ?? 10,
            nonStop: params.nonStop ?? false,
            maxPrice: params.maxPrice,
            viewBy: params.viewBy ?? 'COUNTRY',
          },
        });

        if (!response.data?.data) {
          console.warn('No flight data in response:', response.data);
          return response.data; // Return the full response, even if data is empty
        }

        return response.data; // Return the full response
      } catch (error) {
        lastError = error;
        if (axios.isAxiosError(error) && error.response?.status === 500) {
          console.warn(`Retrying after 500 error. Attempts left: ${retries - 1}`);
          retries--;
          if (retries > 0) {
            // Wait for 1 second before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }
        }
        throw error;
      }
    }

    throw lastError;
  } catch (error) {
    if (axios.isAxiosError(error)) {
     
      if (error.response?.status === 400) {
        throw new Error('Invalid search parameters. Please check your input.');
      }
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please try again.');
      }
      if (error.response?.status === 429) {
        throw new Error('Too many requests. Please try again later.');
      }
      if (error.response?.status === 500) {
        throw new Error('Amadeus API is temporarily unavailable. Please try again in a few minutes.');
      }
      throw new Error('Failed to fetch flight data. Please try again later.');
    }
    throw error;
  }
};

export const getAllFlights = async (): Promise<FlightDetails[]> => {
  try {
    const accessToken = await getAccessToken();
    
    console.log('Fetching all flights');
    
    // Add retry logic for 500 errors
    let retries = 3;
    let lastError;

    while (retries > 0) {
      try {
        const response = await axios.get<FlightSearchResponse>(`${API_BASE_URL}/shopping/flight-destinations`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          params: {
            origin: 'MAD', // Default to Madrid as origin
            departureDate: new Date().toISOString().split('T')[0], // Today's date
            oneWay: false,
            duration: 10,
            nonStop: false,
            viewBy: 'COUNTRY',
          },
        });

        console.log('All flights response:', response.data);

        if (!response.data?.data) {
          console.warn('No flight data in response:', response.data);
          return [];
        }

        return response.data.data;
      } catch (error) {
        lastError = error;
        if (axios.isAxiosError(error) && error.response?.status === 500) {
          console.warn(`Retrying after 500 error. Attempts left: ${retries - 1}`);
          retries--;
          if (retries > 0) {
            // Wait for 1 second before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }
        }
        throw error;
      }
    }

    throw lastError;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.warn('Get all flights error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please try again.');
      }
      if (error.response?.status === 429) {
        throw new Error('Too many requests. Please try again later.');
      }
      if (error.response?.status === 500) {
        throw new Error('Amadeus API is temporarily unavailable. Please try again in a few minutes.');
      }
      throw new Error('Failed to fetch flights. Please try again later.');
    }
    throw error;
  }
}; 