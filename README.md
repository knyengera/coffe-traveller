# Coffee Traveller

A mobile application for travel enthusiasts that helps users discover and book flights to destinations around the world.

## Overview

Coffee Traveller is a React Native application built with Expo that allows users to search for flights, view flight details, and plan their travel adventures. The app integrates with the Amadeus API for accessing flight information and offers a beautiful user interface for a seamless travel planning experience.

## Features

- Search for flights based on origin, destination, and dates
- View flight prices and details
- Filter flights by price, duration, and more
- Interactive calendar for date selection
- Beautiful UI with smooth animations

## Technologies Used

- React Native
- Expo
- TypeScript
- Zustand (State Management)
- React Query (Data Fetching)
- Amadeus API
- React Navigation

## Resources

### Smoke Video

The app includes a smoke video effect for the background. You can download the smoke video file from:
[Download Smoke Video](https://drive.google.com/file/d/1LJSDdya8NwXXAjoxIpWaIB30Q7yzPOy8/view?usp=sharing)

After downloading, place the video file in the appropriate assets directory.

## Amadeus API Integration

This project uses the Amadeus API for flight data. The Amadeus API provides access to flight search, booking, and other travel-related services.

### API Features Used

- **Flight Destinations API**: Searches for flight destinations based on origin, date, and other parameters
- **OAuth 2.0 Authentication**: Secure token-based authentication

### Implementation Details

The app uses the Amadeus Test API environment. The integration is implemented in:
- `services/amadeusAuth.ts`: Handles authentication and token management
- `services/flightService.ts`: Provides methods for searching flights and processing flight data

### API Configuration

To use the Amadeus API, you need to:

1. Register for an account at [Amadeus for Developers](https://developers.amadeus.com/)
2. Create an API key in the Amadeus Developer Portal
3. Add your API credentials to the `.env` file:
   ```
   EXPO_PUBLIC_AMADEUS_API_KEY=your_api_key
   EXPO_PUBLIC_AMADEUS_API_SECRET=your_api_secret
   ```

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```

## Running on a Device

- Use Expo Go app on your mobile device
- Scan the QR code from the terminal
- Or run on a simulator/emulator:
  ```
  npm run ios
  npm run android
  ```

## Building for Production

```
npm run prebuild
npm run ios
npm run android
```
