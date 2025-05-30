import React, { useCallback } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '@/components/ui/molecules/ScreenWrapper/ScreenWrapper';
import { Typography } from '@/components/ui/atoms/Typography/Typography';
import { Button } from '@/components/ui/atoms/Button/Button';
import { Icon } from '@/components/ui/atoms/Icon/Icon';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { testID } from '@/constants/testID';
import { styles } from './OnboardingScreen.styles';
import { OnboardingScreenProps } from './OnboardingScreen.types';

export const OnboardingScreen: React.FC<OnboardingScreenProps> = () => {
  const navigation = useNavigation();
  const { currentStep, totalSteps, nextStep, completeOnboarding } = useOnboardingStore();

  const handleNext = useCallback(() => {
    if (currentStep === totalSteps - 1) {
      completeOnboarding();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' as never }],
      });
    } else {
      nextStep();
    }
  }, [currentStep, totalSteps, nextStep, completeOnboarding, navigation]);

  return (
    <ScreenWrapper
      titleI18nKey="screens.onboarding.title"
      testID={testID.onboarding.screen}
      headerTransparent
      showBackButton={false}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <Icon
            iconName="onboarding"
            size={200}
            testID={testID.onboarding.icon}
          />
          <Typography
            styleName="Heading/H1"
            i18nKey={`screens.onboarding.step${currentStep + 1}.title`}
            testID={testID.onboarding.title}
          />
          <Typography
            styleName="Body/Body Text - Base"
            i18nKey={`screens.onboarding.step${currentStep + 1}.description`}
            testID={testID.onboarding.description}
          />
        </View>
        <View style={styles.footer}>
          <View style={styles.pagination}>
            {Array.from({ length: totalSteps }).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === currentStep && styles.paginationDotActive,
                ]}
                testID={`${testID.onboarding.paginationDot}${index}`}
              />
            ))}
          </View>
          <Button
            onPress={handleNext}
            i18nKey={`screens.onboarding.step${currentStep + 1}.button`}
            testID={testID.onboarding.nextButton}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}; 