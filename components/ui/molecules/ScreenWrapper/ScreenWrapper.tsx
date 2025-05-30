import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Typography } from '@/components/ui/atoms/Typography/Typography';
import { Colors } from '@/theme/colors';

export interface ScreenWrapperProps {
  titleI18nKey?: string;
  scrollable?: boolean;
  showBackButton?: boolean;
  headerTransparent?: boolean;
  testID?: string;
  children: React.ReactNode;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  titleI18nKey,
  scrollable = false,
  showBackButton = false,
  headerTransparent = false,
  testID,
  children,
}) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const Container = scrollable ? ScrollView : View;

  return (
    <View style={[styles.container, headerTransparent && styles.headerTransparent]} testID={testID}>
      <View style={styles.header}>
        {showBackButton && (
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Typography i18nKey="common.back" color="textPrimary" />
          </TouchableOpacity>
        )}
        {titleI18nKey && (
          <Typography
            styleName="Body/Body Text - Base - Bold"
            color="textPrimary"
            i18nKey={titleI18nKey}
          />
        )}
      </View>
      <Container style={styles.content}>{children}</Container>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
  },
  headerTransparent: {
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey5,
  },
  backButton: {
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
}); 