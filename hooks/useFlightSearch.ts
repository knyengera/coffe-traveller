import { useQuery } from '@tanstack/react-query';
import { searchFlights, FlightSearchParams, FlightDetails } from '@/services/flightService';

export const useFlightSearch = (params: FlightSearchParams) => {
  return useQuery<FlightDetails[], Error>({
    queryKey: ['flights', params],
    queryFn: () => searchFlights(params),
    enabled: Boolean(params.origin || params.departureDate),
  });
}; 