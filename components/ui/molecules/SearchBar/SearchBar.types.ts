export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholderI18nKey: string;
  testID?: string;
} 