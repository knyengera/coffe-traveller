import { TextProps, StyleProp, TextStyle } from 'react-native';

export type TypographyStyleName =
  | 'Heading/H1'
  | 'Headline/Headline 1'
  | 'Headline/Headline 2'
  | 'Headline/Headline 3'
  | 'Headline/Headline 4'
  | 'Headline/Headline 5'
  | 'Headline/Headline 6'
  | 'Body/Body Text - Base'
  | 'Body/Body Text - Small'
  | 'Body/Body Text - Large'
  | 'Button/Button Text';

export interface TypographyProps extends TextProps {
  styleName: TypographyStyleName;
  color?: string;
  i18nKey: string;
  style?: StyleProp<TextStyle>;
} 