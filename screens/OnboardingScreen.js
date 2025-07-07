import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ImageBackground,
} from "react-native";
import { Feather } from "@expo/vector-icons";
// Suppression de l'importation Pagination
// import Pagination from 'react-native-snap-carousel/src/pagination/Pagination';

const { width } = Dimensions.get("window");

const slides = [
  {
    key: "slide1",
    text: "Échangez vos objets inutilisés simplement",
    image: { uri: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=1200&fit=crop&crop=center" },
  },
  {
    key: "slide2",
    text: "Trouvez ce dont vous avez besoin autour de vous",
    image: { uri: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=1200&fit=crop&crop=center" },
  },
  {
    key: "slide3",
    text: "Rejoignez la communauté WinWin",
    image: { uri: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=1200&fit=crop&crop=center" },
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.floor(event.nativeEvent.contentOffset.x / slideSize);
    setCurrentIndex(index);
  };

  const renderPagination = (activeIndex) => (
    <View style={styles.paginationContainer}>
      {activeIndex === slides.length - 1 && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.buttonText}>Commencer</Text>
        </TouchableOpacity>
      )}
      <View style={[styles.dotsContainer, { justifyContent: "center" }]}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {slides.map((slide, index) => (
          <ImageBackground
            key={slide.key}
            source={slide.image}
            style={styles.slide}
            resizeMode="cover"
          >
            <View style={styles.overlay}>
              <Text style={styles.text}>{slide.text}</Text>
            </View>
          </ImageBackground>
        ))}
      </ScrollView>
      {renderPagination(currentIndex)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width,
    minHeight: Dimensions.get('window').height,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    width: "100%",
    paddingHorizontal: 20,
  },
  text: {
    textAlign: "center",
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    lineHeight: 36,
    maxWidth: "90%",
  },
  dotsContainer: {
    flexDirection: "row",
    marginVertical: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#000",
  },
  inactiveDot: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  button: {
    zIndex: 100,
    position: "absolute",
    bottom: "12%",
    width: 200,
    alignSelf: "center",
    backgroundColor: "#227897",
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    minHeight: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  paginationContainer: {
    zIndex: 100,
    position: "absolute",
    bottom: "20%",
    alignSelf: "center",
    alignItems: "center",
  },
});

export default OnboardingScreen;
