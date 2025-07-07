import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SubscriptionBanner from "../components/SubscriptionBanner";

const ProfileScreen = ({ navigation }) => {
  const handleLogout = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      {
        text: "Annuler",
        style: "cancel",
      },
      {
        text: "Déconnexion",
        style: "destructive",
        onPress: () => {
          // Retour à l'écran d'onboarding
          navigation.reset({
            index: 0,
            routes: [{ name: "Onboarding" }],
          });
        },
      },
    ]);
  };

  const profileData = {
    name: "Mehdi Mehdi",
    email: "mehdi.mehdi@winwin.com",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    isProfessional: false,
    memberSince: "Janvier 2024",
    totalExchanges: 12,
    rating: 4.8,
  };

  const handleEditProfile = () => {
    navigation.navigate("EditProfile");
  };

  const handleMyAds = () => {
    navigation.navigate("MyAds");
  };

  const handleFavorites = () => {
    navigation.navigate("Favorites");
  };

  const handleMessages = () => {
    navigation.navigate("Messaging");
  };

  const handleHelpSupport = () => {
    navigation.navigate("HelpSupport");
  };

  const handleSubscription = () => {
    navigation.navigate("Subscription");
  };

  const menuItems = [
    {
      icon: "person-outline",
      title: "Modifier le profil",
      subtitle: "Nom, photo, biographie",
      onPress: handleEditProfile,
    },
    {
      icon: "list-outline",
      title: "Mes annonces",
      subtitle: "Gérer vos objets en échange",
      onPress: handleMyAds,
    },
    {
      icon: "swap-horizontal-outline",
      title: "Historique des échanges",
      subtitle: "Voir tous vos échanges",
      onPress: () => navigation.navigate("TransactionHistory"),
    },
    {
      icon: "heart-outline",
      title: "Favoris",
      subtitle: "Objets que vous aimez",
      onPress: handleFavorites,
    },
    {
      icon: "chatbubble-outline",
      title: "Messages",
      subtitle: "Conversations en cours",
      onPress: handleMessages,
    },
    {
      icon: "card-outline",
      title: "Abonnements",
      subtitle: "Plans et options premium",
      onPress: handleSubscription,
    },
    {
      icon: "settings-outline",
      title: "Paramètres",
      subtitle: "Notifications, confidentialité",
      onPress: () => navigation.navigate("Settings"),
    },
    {
      icon: "help-circle-outline",
      title: "Aide et support",
      subtitle: "FAQ, contact",
      onPress: handleHelpSupport,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 100 }]}
      >
        {/* Banner d'abonnement */}
        <SubscriptionBanner navigation={navigation} />

        {/* Header du profil */}
        <View style={styles.profileHeader}>
          <Image source={{ uri: profileData.avatar }} style={styles.avatar} />
          <Text style={styles.name}>{profileData.name}</Text>
          <Text style={styles.email}>{profileData.email}</Text>

          {profileData.isProfessional && (
            <View style={styles.professionalBadge}>
              <Ionicons name="business" size={16} color="#227897" />
              <Text style={styles.professionalText}>Professionnel</Text>
            </View>
          )}

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {profileData.totalExchanges}
              </Text>
              <Text style={styles.statLabel}>Échanges</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profileData.rating}</Text>
              <Text style={styles.statLabel}>Note</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>Membre</Text>
              <Text style={styles.statLabel}>{profileData.memberSince}</Text>
            </View>
          </View>
        </View>

        {/* Menu items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.iconContainer}>
                  <Ionicons name={item.icon} size={24} color="#227897" />
                </View>
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Bouton de déconnexion */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#ff4757" />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>

        {/* Version de l'app */}
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    paddingBottom: 20,
  },
  profileHeader: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    backgroundColor: "#f0f0f0",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
  },
  professionalBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  professionalText: {
    fontSize: 14,
    color: "#227897",
    fontWeight: "bold",
    marginLeft: 5,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#9484ed",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#e9ecef",
    marginHorizontal: 20,
  },
  menuContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 0,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: "#227897",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ff4757",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff4757",
    marginLeft: 8,
  },
  versionText: {
    textAlign: "center",
    fontSize: 12,
    color: "#999",
    marginTop: 10,
  },
});

export default ProfileScreen;
