import 'react-native-reanimated';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Colors } from '@/theme/colors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? Colors.grey1 : Colors.backgroundPrimary,
          },
          headerTintColor: colorScheme === 'dark' ? Colors.backgroundPrimary : Colors.textPrimary,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          // Hide header by default
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            // Hide header for onboarding
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="search-flights"
          options={{
            // Show header for search flights screen
            headerShown: false,
            title: 'Search Flights',
          }}
        />
      </Stack>
    </QueryClientProvider>
  );
} 