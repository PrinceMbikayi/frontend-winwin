import React from "react";
import { View, Text, Button, Image, StyleSheet } from "react-native";

const Onboarding = () => {
  return (
    <View style={styles.container}>
      <View style={styles.slide}>
        <Image source={require("../assets/icon.png")} style={styles.image} />
        <Text style={styles.text}>
          Échangez vos objets inutilisés simplement
        </Text>
      </View>
      <View style={styles.slide}>
        <Image source={require("../assets/icon.png")} style={styles.image} />
        <Text style={styles.text}>
          Trouvez ce dont vous avez besoin autour de vous
        </Text>
      </View>
      <View style={styles.slide}>
        <Image source={require("../assets/icon.png")} style={styles.image} />
        <Text style={styles.text}>Rejoignez la communauté WinWin</Text>
        <Button title="Commencer" onPress={() => {}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  slide: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    color: "#643f75",
    textAlign: "center",
  },
});

export default Onboarding;
