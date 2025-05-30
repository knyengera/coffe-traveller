import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';

export interface TypographyProps extends TextProps {
  styleName?: string;
  color?: keyof typeof Colors;
  i18nKey?: string;
}

export const Typography: React.FC<TypographyProps> = ({
  styleName,
  color = 'textPrimary',
  i18nKey,
  style,
  children,
  ...props
}) => {
  return (
    <Text
      style={[
        styles.base,
        styleName ? styles[styleName as keyof typeof styles] : null,
        { color: Colors[color] },
        style,
      ].filter(Boolean)}
      {...props}
    >
      {i18nKey ? i18nKey : children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    fontSize: 16,
    lineHeight: 24,
  },
  'Body/Body Text - Base': {
    fontSize: 16,
    lineHeight: 24,
  },
  'Body/Body Text - Base - Bold': {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 'bold',
  },
}); 