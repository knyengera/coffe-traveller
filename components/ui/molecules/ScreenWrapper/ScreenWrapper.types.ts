import { ReactNode } from 'react';

export interface ScreenWrapperProps {
  children: ReactNode;
  titleI18nKey: string;
  scrollable?: boolean;
  showBackButton?: boolean;
  headerTransparent?: boolean;
  onBackPress?: () => void;
  testID?: string;
} 