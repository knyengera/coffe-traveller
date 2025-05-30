import React, { useState, useCallback } from 'react';
import { View, ActivityIndicator, ScrollView } from 'react-native';
import { ScreenWrapper } from '@/components/ui/molecules/ScreenWrapper/ScreenWrapper';
import { Typography } from '@/components/ui/atoms/Typography/Typography';
import { SearchBar } from '@/components/ui/molecules/SearchBar/SearchBar';
import { useDebounce } from '@/hooks/useDebounce';
import { useFlightSearch } from '@/hooks/useFlightSearch';
import { styles } from './FlightSearchScreen.styles';
import { FlightSearchScreenProps } from './FlightSearchScreen.types';
import { Colors } from '@/theme/colors';

export const FlightSearchScreen: React.FC<FlightSearchScreenProps> = () => {
  const [origin, setOrigin] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  
  const debouncedSetOrigin = useDebounce(setOrigin, 300);
  const debouncedSetDepartureDate = useDebounce(setDepartureDate, 300);

  const { data: flights, isLoading, error } = useFlightSearch({
    origin,
    departureDate,
  });

  const handleOriginChange = useCallback(
    (value: string) => {
      setOrigin(value);
      debouncedSetOrigin(value);
    },
    [debouncedSetOrigin]
  );

  const handleDepartureDateChange = useCallback(
    (value: string) => {
      setDepartureDate(value);
      debouncedSetDepartureDate(value);
    },
    [debouncedSetDepartureDate]
  );

  const renderFlightResults = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.brandPrimary} />
          <Typography
            styleName="Body/Body Text - Base"
            color="textSecondary"
            i18nKey="screens.flightSearch.searchingFlights"
          />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Typography
            styleName="Body/Body Text - Base"
            color="error"
            i18nKey="screens.flightSearch.error"
          />
        </View>
      );
    }

    if (!flights?.length) {
      return (
        <View style={styles.emptyContainer}>
          <Typography
            styleName="Body/Body Text - Base"
            color="textSecondary"
            i18nKey="screens.flightSearch.noResults"
          />
        </View>
      );
    }

    return (
      <ScrollView style={styles.resultsContainer}>
        {flights.map((flight, index) => (
          <View key={index} style={styles.flightCard}>
            <View style={styles.flightHeader}>
              <Typography
                styleName="Body/Body Text - Base - Bold"
                color="textPrimary"
                i18nKey={`${flight.origin} → ${flight.destination}`}
              />
              <Typography
                styleName="Body/Body Text - Base"
                color="textSecondary"
                i18nKey={`EUR ${flight.price.total}`}
              />
            </View>
            <View style={styles.flightDetails}>
              <View style={styles.flightRoute}>
                <Typography
                  styleName="Body/Body Text - Base - Bold"
                  color="textPrimary"
                  i18nKey={flight.origin}
                />
                <Typography
                  styleName="Body/Body Text - Base"
                  color="textSecondary"
                  i18nKey={flight.destination}
                />
              </View>
              <View style={styles.flightDuration}>
                <Typography
                  styleName="Body/Body Text - Small"
                  color="textSecondary"
                  i18nKey={`Departure: ${flight.departureDate}`}
                />
                {flight.returnDate && (
                  <Typography
                    styleName="Body/Body Text - Small"
                    color="textSecondary"
                    i18nKey={`Return: ${flight.returnDate}`}
                  />
                )}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <ScreenWrapper
      titleI18nKey="screens.flightSearch.title"
      scrollable={false}
      showBackButton={true}
      headerTransparent={true}
      testID="flight-search-screen"
    >
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <SearchBar
            value={origin}
            onChangeText={handleOriginChange}
            placeholderI18nKey="screens.flightSearch.originPlaceholder"
            testID="origin-input"
          />
          <View style={styles.spacer} />
          <SearchBar
            value={departureDate}
            onChangeText={handleDepartureDateChange}
            placeholderI18nKey="screens.flightSearch.departureDatePlaceholder"
            testID="departure-date-input"
          />
        </View>
        {renderFlightResults()}
      </View>
    </ScreenWrapper>
  );
}; 