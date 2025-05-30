import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Typography } from '@/components/ui/atoms/Typography/Typography';
import { Colors } from '@/theme/colors';

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholderI18nKey?: string;
  testID?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholderI18nKey,
  testID,
}) => {
  const handleClear = () => {
    onChangeText('');
  };

  return (
    <View style={styles.container} testID={testID}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholderI18nKey}
        style={styles.input}
        placeholderTextColor={Colors.grey1}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Typography i18nKey="common.clear" color="grey1" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  clearButton: {
    padding: 8,
  },
}); 