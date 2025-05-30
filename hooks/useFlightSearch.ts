import { useQuery } from '@tanstack/react-query';
import { searchFlights, FlightSearchParams, FlightSearchResponse } from '@/services/flightService';

export const useFlightSearch = (params: FlightSearchParams) => {
  return useQuery<FlightSearchResponse, Error>({
    queryKey: ['flights', params],
    queryFn: () => searchFlights(params),
    enabled: Boolean(params.origin || params.departureDate),
  });
}; 