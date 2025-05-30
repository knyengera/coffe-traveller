import { StyleProp, ViewStyle } from 'react-native';

export interface ButtonProps {
  onPress: () => void;
  i18nKey: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
} 