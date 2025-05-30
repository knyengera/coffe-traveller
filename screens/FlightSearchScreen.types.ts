export interface FlightSearchScreenProps {
  // Add any props if needed
}

interface Location {
  subType: string;
  detailedName: string;
}

interface Dictionaries {
  locations: {
    [key: string]: Location;
  };
  currencies: {
    [key: string]: string;
  };
}

export interface FlightDetails {
  type: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  price: {
    total: string;
  };
  links: {
    flightDates: string;
    flightOffers: string;
  };
  dictionaries?: Dictionaries;
} 