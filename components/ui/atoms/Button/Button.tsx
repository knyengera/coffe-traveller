import React from 'react';
import { TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Typography } from '@/components/ui/atoms/Typography/Typography';
import { Colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { styles } from './Button.styles';
import { ButtonProps } from './Button.types';

export const Button: React.FC<ButtonProps> = ({
  onPress,
  i18nKey,
  testID,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      testID={testID}
    >
      <Typography
        styleName="Button/Button Text"
        i18nKey={i18nKey}
        color="textPrimary"
      />
    </TouchableOpacity>
  );
}; 