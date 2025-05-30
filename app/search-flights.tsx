import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ImageBackground, Modal, ScrollView, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { Colors } from '@/theme/colors';
import { useQuery } from '@tanstack/react-query';
import { getAllFlights, searchFlights } from '@/services/flightService';

export default function SearchFlightsScreen() {
  const [origin, setOrigin] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [dateError, setDateError] = useState('');

  const { data: flights, isLoading, error } = useQuery({
    queryKey: ['flights', origin, departureDate],
    queryFn: () => searchFlights({
      origin: origin || 'LON',
      departureDate: departureDate || new Date().toISOString().split('T')[0],
      oneWay: false,
      duration: 10,
      nonStop: false,
      viewBy: 'COUNTRY'
    }),
    enabled: showResults,
  });

  const validateAndFormatDate = (text: string) => {
    // Remove any non-digit characters
    const cleaned = text.replace(/\D/g, '');
    
    // Format the date as user types
    let formatted = cleaned;
    if (cleaned.length > 4) {
      formatted = `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}`;
    }
    if (cleaned.length > 6) {
      formatted = `${formatted}-${cleaned.slice(6, 8)}`;
    }

    // Validate the date
    if (cleaned.length === 8) {
      const year = parseInt(cleaned.slice(0, 4));
      const month = parseInt(cleaned.slice(4, 6));
      const day = parseInt(cleaned.slice(6, 8));
      
      const date = new Date(year, month - 1, day);
      const isValid = date.getFullYear() === year && 
                     date.getMonth() === month - 1 && 
                     date.getDate() === day;
      
      if (!isValid) {
        setDateError('Please enter a valid date');
      } else {
        setDateError('');
      }
    } else {
      setDateError('');
    }

    setDepartureDate(formatted);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Search Flights',
          headerStyle: {
            backgroundColor: Colors.backgroundPrimary,
          },
          headerTintColor: Colors.textPrimary,
        }} 
      />
      
      <ImageBackground
        source={require('../assets/coffee-onboarding.png')}
        style={styles.backgroundImage}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.overlay} />
        <View style={styles.content}>
          <View style={styles.searchContainer}>
            <Text style={styles.title}>Find Your Next Coffee Destination</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Origin Airport (IATA Code)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter airport code (e.g., MAD)"
                placeholderTextColor={Colors.textSecondary}
                value={origin}
                onChangeText={(text) => setOrigin(text.toUpperCase())}
                autoCapitalize="characters"
                maxLength={3}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Departure Date</Text>
              <TextInput
                style={[styles.input, dateError && styles.inputError]}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={Colors.textSecondary}
                value={departureDate}
                onChangeText={validateAndFormatDate}
                keyboardType="numeric"
                maxLength={10}
              />
              {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}
            </View>

            <TouchableOpacity 
              style={styles.button}
              onPress={() => setShowResults(true)}
            >
              <Text style={styles.buttonText}>View Destinations</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      <Modal
        visible={showResults}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowResults(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {origin ? `Flights from ${origin}` : 'Popular Destinations'}
              </Text>
              <TouchableOpacity onPress={() => setShowResults(false)}>
                <Text style={styles.closeButton}>Close</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.resultsContainer}>
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={Colors.brandPrimary} />
                  <Text style={styles.loadingText}>Loading destinations...</Text>
                </View>
              ) : !flights?.length ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    {origin || departureDate 
                      ? 'No destinations found for your search criteria' 
                      : 'No destinations available'}
                  </Text>
                </View>
              ) : (
                flights.map((flight, index) => (
                  <View 
                    key={`${flight.origin}-${flight.destination}-${index}`} 
                    style={styles.flightCard}
                  >
                    <View style={styles.flightHeader}>
                      <Text style={styles.flightNumber}>
                        {flight.origin} → {flight.destination}
                      </Text>
                      <Text style={styles.flightPrice}>
                        EUR {flight.price.total}
                      </Text>
                    </View>
                    <View style={styles.flightDetails}>
                      <View style={styles.flightRoute}>
                        <Text style={styles.flightCity}>
                          {flight.origin}
                        </Text>
                        <Text style={styles.flightCity}>
                          {flight.destination}
                        </Text>
                      </View>
                      <View style={styles.flightDates}>
                        <Text style={styles.dateText}>
                          Departure: {flight.departureDate}
                        </Text>
                        {flight.returnDate && (
                          <Text style={styles.dateText}>
                            Return: {flight.returnDate}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  imageStyle: {
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  searchContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    padding: 12,
    color: Colors.textPrimary,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#c97a4b',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.backgroundPrimary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    height: '80%',
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  closeButton: {
    fontSize: 16,
    color: '#c97a4b',
    fontWeight: 'bold',
  },
  resultsContainer: {
    flex: 1,
  },
  flightCard: {
    backgroundColor: '#c97a4b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  flightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  flightNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  flightPrice: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  flightDetails: {
    flexDirection: 'column',
  },
  flightRoute: {
    marginBottom: 8,
  },
  flightCity: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
  },
  flightDates: {
    marginTop: 8,
  },
  dateText: {
    fontSize: 12,
    color: '#fff',
    marginBottom: 4,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
}); 