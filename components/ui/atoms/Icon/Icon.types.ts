import { StyleProp, ViewStyle } from 'react-native';

export type IconName = 
  | 'search'
  | 'close'
  | 'closeCircle'
  | 'arrowBack'
  | 'arrowForward'
  | 'check'
  | 'error'
  | 'warning'
  | 'info'
  | 'onboarding';

export interface IconProps {
  iconName: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
} 