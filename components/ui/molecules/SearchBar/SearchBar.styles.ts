import { StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.grey1,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    height: 48,
  },
  searchIcon: {
    marginRight: spacing.xs,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  clearButton: {
    padding: spacing.xs,
  },
}); 