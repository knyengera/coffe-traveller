import { StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
    padding: spacing.md,
  },
  searchContainer: {
    marginBottom: spacing.md,
  },
  spacer: {
    height: spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsContainer: {
    flex: 1,
  },
  flightCard: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  flightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  flightDetails: {
    flexDirection: 'column',
  },
  flightRoute: {
    marginBottom: spacing.sm,
  },
  flightDuration: {
    marginTop: spacing.sm,
  },
  flightLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.borderLight,
  },
}); 