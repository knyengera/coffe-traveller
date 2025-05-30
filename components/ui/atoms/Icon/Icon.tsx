import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { IconProps, IconName } from './Icon.types';

const iconNameMap: Record<IconName, keyof typeof MaterialIcons.glyphMap> = {
  search: 'search',
  close: 'close',
  closeCircle: 'cancel',
  arrowBack: 'arrow-back',
  arrowForward: 'arrow-forward',
  check: 'check',
  error: 'error',
  warning: 'warning',
  info: 'info',
  onboarding: 'help',
};

export const Icon: React.FC<IconProps> = ({
  iconName,
  size = 24,
  color = Colors.textPrimary,
  style,
}) => {
  return (
    <View style={style}>
      <MaterialIcons name={iconNameMap[iconName]} size={size} color={color} />
    </View>
  );
}; 