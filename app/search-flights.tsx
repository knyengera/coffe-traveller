import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ImageBackground, Modal, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import { Stack } from 'expo-router';
import { Colors } from '@/theme/colors';
import { useQuery } from '@tanstack/react-query';
import { getAllFlights, searchFlights } from '@/services/flightService';

export default function SearchFlightsScreen() {
  const [origin, setOrigin] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [dateError, setDateError] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [displayedMonth, setDisplayedMonth] = useState(new Date().getMonth());
  const [displayedYear, setDisplayedYear] = useState(new Date().getFullYear());

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

  const locations = flights?.dictionaries?.locations || {};

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

  // Generate calendar data
  const generateCalendarData = useCallback((year: number, month: number) => {
    const today = new Date();
    const currentDate = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Get days in specified month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    // Create calendar grid with empty cells for days before the 1st of the month
    const calendarDays = [];
    
    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push({ day: '', date: null, disabled: true });
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateString = date.toISOString().split('T')[0];
      const isToday = i === currentDate && month === currentMonth && year === currentYear;
      const isPastDate = date < new Date(today.setHours(0, 0, 0, 0));
      
      calendarDays.push({
        day: i.toString(),
        date: dateString,
        isToday,
        disabled: isPastDate,
      });
    }
    
    return calendarDays;
  }, []);
  
  const calendarData = useMemo(() => generateCalendarData(displayedYear, displayedMonth), [generateCalendarData, displayedYear, displayedMonth]);
  
  const handleDateSelect = (dateString: string) => {
    setDepartureDate(dateString);
    setShowCalendar(false);
    setDateError('');
  };
  
  // Navigation functions for calendar
  const goToPreviousMonth = () => {
    if (displayedMonth === 0) {
      setDisplayedMonth(11);
      setDisplayedYear(displayedYear - 1);
    } else {
      setDisplayedMonth(displayedMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (displayedMonth === 11) {
      setDisplayedMonth(0);
      setDisplayedYear(displayedYear + 1);
    } else {
      setDisplayedMonth(displayedMonth + 1);
    }
  };
  
  // Get displayed month and year for display
  const displayedMonthName = new Date(displayedYear, displayedMonth).toLocaleString('default', { month: 'long' });

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
              <TouchableOpacity 
                style={[styles.input, dateError && styles.inputError]} 
                onPress={() => setShowCalendar(true)}
              >
                <Text style={departureDate ? styles.inputDateText : styles.placeholderText}>
                  {departureDate || 'YYYY-MM-DD'}
                </Text>
              </TouchableOpacity>
              {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}
            </View>

            <TouchableOpacity 
              style={[styles.button, (!origin || !departureDate) && styles.buttonDisabled]}
              onPress={() => setShowResults(true)}
              disabled={!origin || !departureDate}
            >
              <Text style={[styles.buttonText, (!origin || !departureDate) && styles.buttonTextDisabled]}>View Destinations</Text>
            </TouchableOpacity>
            
            {/* Calendar Modal */}
            <Modal
              visible={showCalendar}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setShowCalendar(false)}
            >
              <View style={styles.calendarModalContainer}>
                <View style={styles.calendarModalContent}>
                  <View style={styles.calendarHeader}>
                    <Text style={styles.calendarTitle}>Select Departure Date</Text>
                    <TouchableOpacity onPress={() => setShowCalendar(false)}>
                      <Text style={styles.closeButton}>Close</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.calendarContainer}>
                    <View style={styles.calendarNavigation}>
                      <TouchableOpacity onPress={goToPreviousMonth} style={styles.calendarNavButton}>
                        <Text style={styles.calendarNavButtonText}>←</Text>
                      </TouchableOpacity>
                      <Text style={styles.calendarMonthYear}>{displayedMonthName} {displayedYear}</Text>
                      <TouchableOpacity onPress={goToNextMonth} style={styles.calendarNavButton}>
                        <Text style={styles.calendarNavButtonText}>→</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.weekdaysContainer}>
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                        <Text key={index} style={styles.weekdayText}>{day}</Text>
                      ))}
                    </View>
                    <View style={styles.daysContainer}>
                      <FlatList
                        data={calendarData}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            style={[
                              styles.dayCell,
                              item.isToday && styles.todayCell,
                              item.date === departureDate && styles.selectedCell,
                              item.disabled && styles.disabledCell
                            ]}
                            onPress={() => item.date && !item.disabled && handleDateSelect(item.date)}
                            disabled={item.disabled || !item.date}
                          >
                            <Text style={[
                              styles.dayText,
                              item.isToday && styles.todayText,
                              item.date === departureDate && styles.selectedDayText,
                              item.disabled && styles.disabledDayText
                            ]}>
                              {item.day}
                            </Text>
                          </TouchableOpacity>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={7}
                        scrollEnabled={false}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </Modal>
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
              ) : !flights?.data?.length ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    {origin || departureDate 
                      ? 'No destinations found for your search criteria' 
                      : 'No destinations available'}
                  </Text>
                </View>
              ) : (
                flights.data.map((flight, index) => (
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
                          {flight.origin} - {locations[flight.origin]?.detailedName || ''}
                        </Text>
                        <Text style={styles.flightCity}>
                          {flight.destination} - {locations[flight.destination]?.detailedName || ''}
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
  inputDateText: {
    color: Colors.textPrimary,
    fontSize: 16,
  },
  placeholderText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  calendarModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  calendarModalContent: {
    backgroundColor: Colors.backgroundPrimary,
    borderRadius: 10,
    width: '100%',
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  calendarContainer: {
    width: '100%',
  },
  calendarNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  calendarNavButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: `rgba(${parseInt(Colors.brandPrimary.slice(1, 3), 16)}, ${parseInt(Colors.brandPrimary.slice(3, 5), 16)}, ${parseInt(Colors.brandPrimary.slice(5, 7), 16)}, 0.1)`,
  },
  calendarNavButtonText: {
    fontSize: 18,
    color: Colors.brandPrimary,
    fontWeight: 'bold',
  },
  calendarMonthYear: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.textPrimary,
  },
  weekdaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  weekdayText: {
    fontSize: 14,
    color: Colors.textSecondary,
    width: '14.28%',
    textAlign: 'center',
  },
  daysContainer: {
    width: '100%',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  todayCell: {
    backgroundColor: `rgba(${parseInt(Colors.brandPrimary.slice(1, 3), 16)}, ${parseInt(Colors.brandPrimary.slice(3, 5), 16)}, ${parseInt(Colors.brandPrimary.slice(5, 7), 16)}, 0.1)`,
  },
  todayText: {
    color: Colors.brandPrimary,
    fontWeight: 'bold',
  },
  selectedCell: {
    backgroundColor: Colors.brandPrimary,
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledCell: {
    opacity: 0.3,
  },
  disabledDayText: {
    color: Colors.textSecondary,
  },
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
    backgroundColor: Colors.brandPrimary,
    borderRadius: 24,
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: '#808080', // Gray color for disabled state
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextDisabled: {
    opacity: 0.7,
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
    color: Colors.brandPrimary,
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