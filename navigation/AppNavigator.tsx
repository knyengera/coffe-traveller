import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FlightSearchScreen } from '@/screens/FlightSearchScreen';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="FlightSearch" component={FlightSearchScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 