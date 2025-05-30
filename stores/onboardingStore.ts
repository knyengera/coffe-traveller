import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OnboardingState {
  currentStep: number;
  totalSteps: number;
  isCompleted: boolean;
  nextStep: () => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      currentStep: 0,
      totalSteps: 3, // Adjust based on your onboarding steps
      isCompleted: false,
      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, state.totalSteps - 1),
        })),
      completeOnboarding: () =>
        set({
          isCompleted: true,
          currentStep: 0,
        }),
      resetOnboarding: () =>
        set({
          currentStep: 0,
          isCompleted: false,
        }),
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 