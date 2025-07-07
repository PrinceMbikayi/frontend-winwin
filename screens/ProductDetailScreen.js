import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSubscription } from "../context/SubscriptionContext";
import { FeatureRestriction } from "../components/SubscriptionBanner";

const { width } = Dimensions.get("window");

// Données simulées pour le produit
const mockProduct = {
  id: "1",
  title: "iPhone 12 Pro 128GB",
  image:
    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
  condition: "Très bon état",
  description:
    "iPhone 12 Pro en excellent état, utilisé avec précaution. Écran sans rayures, batterie en parfait état (95% de capacité). Vendu avec chargeur original et coque de protection. Aucun défaut visible.",
  estimatedValue: "800€",
  seller: {
    name: "Wael Wael",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face",
    rating: 4.8,
    reviewCount: 23,
  },
  category: "Électronique",
  location: "Paris 15ème",
  distance: "2.5 km",
};

import { useExchange } from '../context/ExchangeContext';

const ProductDetailScreen = ({ navigation, route }) => {
  const { canPerformAction, userHasActiveSubscription } = useSubscription();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState("hand");

  // Exchange status: null (no exchange), "in_progress", "active", "inactive"
  const [exchangeStatus, setExchangeStatus] = useState(null);

  const { updateExchange } = useExchange();

  // Function to handle exchange status changes
  const handleStartExchange = () => {
    if (!userHasActiveSubscription) {
      navigation.navigate("SubscriptionScreen");
      return;
    }
    setExchangeStatus("in_progress");
    if(route.params?.exchangeId) {
      updateExchange(route.params.exchangeId, { status: 'pending' });
    }
  };

  const handleCompleteExchange = () => {
    if (!userHasActiveSubscription) {
      navigation.navigate("SubscriptionScreen");
      return;
    }
    setExchangeStatus("active");
    if(route.params?.exchangeId) {
      updateExchange(route.params.exchangeId, { status: 'active' });
    }
  };

  const handleFailExchange = () => {
    if (!userHasActiveSubscription) {
      navigation.navigate("SubscriptionScreen");
      return;
    }
    setExchangeStatus("inactive");
    if(route.params?.exchangeId) {
      updateExchange(route.params.exchangeId, { status: 'cancelled' });
    }
  };

  const deliveryOptions = [
    {
      id: "hand",
      name: "Remise en main propre",
      icon: "hand-left-outline",
      description: "Rencontre directe avec le vendeur",
      price: "Gratuit",
    },
    {
      id: "colissimo",
      name: "Colissimo",
      icon: "cube-outline",
      description: "Livraison à domicile en 48h",
      price: "6,90€",
    },
    {
      id: "mondial",
      name: "Mondial Relay",
      icon: "storefront-outline",
      description: "Point relais près de chez vous",
      price: "4,50€",
    },
  ];

  const handleContactSeller = () => {
    if (!canPerformAction('message')) {
      Alert.alert(
        'Fonctionnalité Premium',
        'La messagerie nécessite un abonnement. Voulez-vous voir nos plans ?',
        [
          { text: 'Plus tard', style: 'cancel' },
          {
            text: 'Voir les plans',
            onPress: () => navigation.navigate('Subscription')
          }
        ]
      );
      return;
    }

    Alert.alert(
      "Contacter le vendeur",
      "Voulez-vous envoyer un message à Wael Wael ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Envoyer un message",
          onPress: () => {
            // Navigation vers l'écran de messagerie
            navigation.navigate("Messaging", {
              sellerId: mockProduct.seller.name,
              productTitle: mockProduct.title,
              sellerAvatar: mockProduct.seller.avatar,
            });
          },
        },
      ]
    );
  };

  const handleAddToFavorites = () => {
    setIsFavorite(!isFavorite);
    Alert.alert(
      isFavorite ? "Retiré des favoris" : "Ajouté aux favoris",
      isFavorite
        ? "Le produit a été retiré de vos favoris"
        : "Le produit a été ajouté à vos favoris"
    );
  };

  const renderDeliveryOption = (option) => (
    <TouchableOpacity
      key={option.id}
      style={[
        styles.deliveryOption,
        selectedDelivery === option.id && styles.deliveryOptionSelected,
      ]}
      onPress={() => setSelectedDelivery(option.id)}
    >
      <View style={styles.deliveryLeft}>
        <Ionicons
          name={option.icon}
          size={24}
          color={selectedDelivery === option.id ? "#227897" : "#666"}
        />
        <View style={styles.deliveryInfo}>
          <Text
            style={[
              styles.deliveryName,
              selectedDelivery === option.id && styles.deliveryNameSelected,
            ]}
          >
            {option.name}
          </Text>
          <Text style={styles.deliveryDescription}>{option.description}</Text>
        </View>
      </View>
      <Text
        style={[
          styles.deliveryPrice,
          selectedDelivery === option.id && styles.deliveryPriceSelected,
        ]}
      >
        {option.price}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fiche produit</Text>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleAddToFavorites}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite ? "#ff4757" : "#333"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Image grand format */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: mockProduct.image }}
            style={styles.productImage}
          />
          <View style={styles.conditionBadge}>
            <Text style={styles.conditionText}>{mockProduct.condition}</Text>
          </View>
        </View>

        {/* Informations produit */}
        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>{mockProduct.title}</Text>
          <Text style={styles.productCategory}>{mockProduct.category}</Text>

          <View style={styles.valueContainer}>
            <Text style={styles.valueLabel}>Estimation de valeur</Text>
            <Text style={styles.valueAmount}>{mockProduct.estimatedValue}</Text>
          </View>

          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.locationText}>
              {mockProduct.location} • {mockProduct.distance}
            </Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{mockProduct.description}</Text>
        </View>

        {/* Informations vendeur */}
        <View style={styles.sellerContainer}>
          <Text style={styles.sectionTitle}>Vendeur</Text>
          <TouchableOpacity
            style={styles.sellerInfo}
            onPress={() =>
              navigation.navigate("UserProfile", {
                userId: "seller_123",
                userName: mockProduct.seller.name,
                userAvatar: mockProduct.seller.avatar,
                exchangeId: route.params?.exchangeId,
              })
            }
          >
            <Image
              source={{ uri: mockProduct.seller.avatar }}
              style={styles.sellerAvatar}
            />
            <View style={styles.sellerDetails}>
              <Text style={styles.sellerName}>{mockProduct.seller.name}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#227897" />
                <Text style={styles.ratingText}>
                  {mockProduct.seller.rating} ({mockProduct.seller.reviewCount}{" "}
                  avis)
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Options de livraison */}
        <View style={styles.deliveryContainer}>
          <Text style={styles.sectionTitle}>Options de livraison</Text>
          {deliveryOptions.map(renderDeliveryOption)}
        </View>

        {/* Boutons d'action */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={handleContactSeller}
          >
            <Ionicons name="chatbubble-outline" size={20} color="#fff" />
            <Text style={styles.contactButtonText}>
              Contacter l'utilisateur
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.favoriteActionButton,
              isFavorite && styles.favoriteActionButtonActive,
            ]}
            onPress={handleAddToFavorites}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={20}
              color={isFavorite ? "#fff" : "#227897"}
            />
            <Text
              style={[
                styles.favoriteActionButtonText,
                isFavorite && styles.favoriteActionButtonTextActive,
              ]}
            >
              {isFavorite ? "Retiré des favoris" : "Ajouter aux favoris"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Boutons de validation d'échange */}
        <View style={styles.exchangeStatusButtons}>
          <TouchableOpacity
            style={[styles.exchangeButton, styles.exchangeStartButton]}
            onPress={handleStartExchange}
          >
            <Text style={styles.exchangeButtonText}>Échange en cours</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.exchangeButton, styles.exchangeCompleteButton]}
            onPress={handleCompleteExchange}
          >
            <Text style={styles.exchangeButtonText}>Échange effectué</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.exchangeButton, styles.exchangeFailButton]}
            onPress={handleFailExchange}
          >
            <Text style={styles.exchangeButtonText}>Échange échoué</Text>
          </TouchableOpacity>
        </View>

        {/* Badge de statut d'échange */}
        <>
          {exchangeStatus === "active" && (
            <View style={styles.exchangeStatusBadge}>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              <Text style={styles.exchangeStatusText}>Échange effectué</Text>
            </View>
          )}
          {exchangeStatus === "inactive" && (
            <View style={[styles.exchangeStatusBadge, styles.exchangeStatusBadgeInactive]}>
              <Ionicons name="close-circle" size={24} color="#FF3B30" />
              <Text style={[styles.exchangeStatusText, styles.exchangeStatusTextInactive]}>Échange échoué</Text>
            </View>
          )}
          {exchangeStatus === "in_progress" && (
            <View style={styles.exchangeStatusBadge}>
              <Ionicons name="time" size={24} color="#f0ad4e" />
              <Text style={styles.exchangeStatusText}>Échange en cours</Text>
            </View>
          )}
        </>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  exchangeButton: {
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  exchangeStartButton: {
    backgroundColor: "#f0ad4e",
  },
  exchangeCompleteButton: {
    backgroundColor: "#4CAF50",
  },
  exchangeFailButton: {
    backgroundColor: "#FF3B30",
  },
  exchangeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  exchangeStatusButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  exchangeStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: "#e6f4ea",
    marginTop: 10,
  },
  exchangeStatusText: {
    color: "#4CAF50",
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 16,
  },
  exchangeStatusBadgeInactive: {
    backgroundColor: "#fdecea",
  },
  exchangeStatusTextInactive: {
    color: "#FF3B30",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  favoriteButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    position: "relative",
    backgroundColor: "#fff",
  },
  productImage: {
    width: width,
    height: width,
    resizeMode: "cover",
  },
  conditionBadge: {
    position: "absolute",
    top: 15,
    left: 15,
    backgroundColor: "#28a745",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  conditionText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  productInfo: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 10,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  productCategory: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
  },
  valueContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
  },
  valueLabel: {
    fontSize: 16,
    color: "#666",
  },
  valueAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#227897",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
  },
  descriptionContainer: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  descriptionText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  sellerContainer: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 10,
  },
  sellerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  sellerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  sellerDetails: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
  },
  deliveryContainer: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 10,
  },
  deliveryOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#e9ecef",
    marginBottom: 10,
  },
  deliveryOptionSelected: {
    borderColor: "#227897",
    backgroundColor: "#fff8f0",
  },
  deliveryLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  deliveryInfo: {
    marginLeft: 15,
    flex: 1,
  },
  deliveryName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 3,
  },
  deliveryNameSelected: {
    color: "#227897",
  },
  deliveryDescription: {
    fontSize: 14,
    color: "#666",
  },
  deliveryPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  deliveryPriceSelected: {
    color: "#227897",
  },
  actionButtons: {
    padding: 20,
    paddingBottom: 40,
  },
  contactButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#227897",
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#227897",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  contactButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  favoriteActionButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#227897",
  },
  favoriteActionButtonActive: {
    backgroundColor: "#227897",
  },
  favoriteActionButtonText: {
    color: "#227897",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  favoriteActionButtonTextActive: {
    color: "#fff",
  },
});

export default ProductDetailScreen;
