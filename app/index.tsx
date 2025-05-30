import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, StatusBar, Animated, Dimensions, ViewToken, FlatList } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';

function Layout({ children }: { children: React.ReactNode }) {
  return <View style={{ flex: 1 }}>{children}</View>;
}

const { width: WINDOW_WIDTH } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  
  const slides = [
    {
      title: "Your Coffee Journey\nStarts Here!",
      subtitle: "Discover the perfect coffee spots around the world. Whether you're traveling for business or pleasure, we'll help you find your next favorite brew."
    },
    {
      title: "Explore Global\nCoffee Culture",
      subtitle: "From Italian espresso to Ethiopian ceremonies, immerse yourself in the rich traditions and unique brewing methods that make each destination special."
    },
    {
      title: "Find Hidden\nCoffee Gems",
      subtitle: "Uncover local favorites and off-the-beaten-path cafés that only the locals know about. Experience authentic flavors wherever your travels take you."
    },
    {
      title: "Create Your\nCoffee Adventure",
      subtitle: "Plan your next trip around amazing coffee experiences. Connect with fellow coffee enthusiasts and build memories that last a lifetime."
    }
  ];

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const viewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    setCurrentSlide(viewableItems[0]?.index ?? 0);
  }).current;

  const slidesRef = useRef(null);

  const isLastSlide = currentSlide === slides.length - 1;

  return (
    <Layout>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={require('../assets/coffee-onboarding.png')}
        style={styles.backgroundImage}
        imageStyle={styles.imageStyle}
      >
        {/* Smoke video overlay with screen blend mode */}
        <Video
          source={require('../assets/smoke.mp4')}
          style={styles.smokeVideo}
          resizeMode={ResizeMode.COVER}
          shouldPlay={true}
          isLooping={true}
          isMuted={true}
        />
        <View style={styles.overlay} />
        <View style={styles.content}>
          <View style={styles.bottomContent}>
            <View style={styles.sliderWrapper}>
              <FlatList
                data={slides}
                renderItem={({ item }) => (
                  <View style={styles.slide}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.subtitle}>{item.subtitle}</Text>
                  </View>
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                bounces={false}
                keyExtractor={(_, index) => index.toString()}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                  { useNativeDriver: false }
                )}
                scrollEventThrottle={32}
                onViewableItemsChanged={viewableItemsChanged}
                viewabilityConfig={viewConfig}
                ref={slidesRef}
              />
            </View>
            
            <View style={styles.paginationContainer}>
              {slides.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    currentSlide === index ? styles.paginationDotActive : styles.paginationDotInactive
                  ]}
                />
              ))}
            </View>
            
            <TouchableOpacity 
              style={[styles.button, !isLastSlide && styles.buttonDisabled]} 
              onPress={() => isLastSlide && router.replace('/search-flights')}
              disabled={!isLastSlide}
            >
              <Text style={styles.buttonText}>
                {isLastSlide ? "Start Your Journey" : "Smell the coffee..."}
              </Text>
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
  smokeVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '33.3%',
    opacity: 0.3,
    mixBlendMode: 'screen',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomContent: {
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  sliderWrapper: {
    width: WINDOW_WIDTH,
    marginLeft: -24,
    overflow: 'visible',
  },
  slide: {
    width: WINDOW_WIDTH,
    paddingHorizontal: 24,
    alignItems: 'center',
    overflow: 'visible',
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
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#c97a4b',
  },
  paginationDotInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  button: {
    backgroundColor: '#c97a4b',
    borderRadius: 24,
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: 'rgba(201, 122, 75, 0.5)',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
