import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter, Stack } from 'expo-router';

function Layout({ children }: { children: React.ReactNode }) {
  return <View style={{ flex: 1 }}>{children}</View>;
}

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <Layout>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={require('../assets/coffee-onboarding.png')}
        style={styles.backgroundImage}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.overlay} />
        <View style={styles.content}>
          <View style={styles.bottomContent}>
            <Text style={styles.title}>Your Coffee Journey{"\n"}Starts Here!</Text>
            <Text style={styles.subtitle}>
              Discover the perfect coffee spots around the world. Whether you're traveling for business or pleasure, we'll help you find your next favorite brew.
            </Text>
            <TouchableOpacity style={styles.button} onPress={() => router.replace('/search-flights')}>
              <Text style={styles.buttonText}>Start Your Journey</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </Layout>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  imageStyle: {
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    color: '#b0b0b0',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#c97a4b',
    borderRadius: 24,
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
