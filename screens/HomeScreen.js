import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Image,
  FlatList,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ExchangeContext } from "../context/ExchangeContext";
import { useSubscription } from "../context/SubscriptionContext";
import SuggestionsWidget from "../components/SuggestionsWidget";
import { FeatureRestriction } from "../components/SubscriptionBanner";

// Données simulées pour les objets
const mockItems = [
  {
    id: "1",
    title: "iPhone 12 Pro",
    image:
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop",
    distance: "2.5 km",
    estimatedValue: "800€",
    category: "Électronique",
    condition: "Très bon état",
  },
  {
    id: "2",
    title: "Vélo de course",
    image:
      "https://images.unsplash.com/photo-1544191696-15693072e0b5?w=300&h=300&fit=crop",
    distance: "1.2 km",
    estimatedValue: "450€",
    category: "Sport",
    condition: "Bon état",
  },
  {
    id: "3",
    title: "Canapé 3 places",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
    distance: "5.8 km",
    estimatedValue: "300€",
    category: "Mobilier",
    condition: "État correct",
  },
  {
    id: "4",
    title: "Machine à café",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop",
    distance: "3.1 km",
    estimatedValue: "120€",
    category: "Électroménager",
    condition: "Très bon état",
  },
  {
    id: "5",
    title: "Guitare acoustique",
    image:
      "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=300&h=300&fit=crop",
    distance: "4.7 km",
    estimatedValue: "200€",
    category: "Musique",
    condition: "Bon état",
  },
  {
    id: "6",
    title: "Livre de cuisine",
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=300&fit=crop",
    distance: "1.8 km",
    estimatedValue: "25€",
    category: "Livres",
    condition: "Très bon état",
  },
];

const categories = [
  "Tous",
  "Électronique",
  "Sport",
  "Mobilier",
  "Électroménager",
  "Musique",
  "Livres",
];
const conditions = ["Tous", "Très bon état", "Bon état", "État correct"];
const distances = ["Tous", "< 2 km", "< 5 km", "< 10 km"];

const HomeScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [selectedCondition, setSelectedCondition] = useState("Tous");
  const [selectedDistance, setSelectedDistance] = useState("Tous");
  const [showFilters, setShowFilters] = useState(false);
  const [filteredItems, setFilteredItems] = useState(mockItems);

  const applyFilters = () => {
    let filtered = mockItems;

    if (searchText) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedCategory !== "Tous") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    if (selectedCondition !== "Tous") {
      filtered = filtered.filter(
        (item) => item.condition === selectedCondition
      );
    }

    setFilteredItems(filtered);
    setShowFilters(false);
  };

  const resetFilters = () => {
    setSelectedCategory("Tous");
    setSelectedCondition("Tous");
    setSelectedDistance("Tous");
    setSearchText("");
    setFilteredItems(mockItems);
    setShowFilters(false);
  };

  const renderItemCard = ({ item }) => (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={() =>
        navigation.navigate("ProductDetail", { productId: item.id })
      }
    >
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.itemDetails}>
          <View style={styles.itemDetailRow}>
            <Ionicons name="location-outline" size={14} color="#666" />
            <Text style={styles.itemDistance}>{item.distance}</Text>
          </View>
          <View style={styles.itemDetailRow}>
            <Ionicons name="pricetag-outline" size={14} color="#666" />
            <Text style={styles.itemValueLabel}>Estimation: </Text>
            <Text style={styles.itemValue}>{item.estimatedValue}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.exchangeButton}
          onPress={(e) => {
            e.stopPropagation();
            const { canPerformAction } = require('../context/SubscriptionContext');
            if (!canPerformAction('exchange')) {
              Alert.alert(
                'Abonnement requis',
                'Pour proposer des échanges, vous devez souscrire à un abonnement.',
                [
                  { text: 'Annuler', style: 'cancel' },
                  { 
                    text: 'Voir les plans', 
                    onPress: () => navigation.navigate('Subscription')
                  }
                ]
              );
              return;
            }
            navigation.navigate("ProductDetail", { productId: item.id });
          }}
        >
          <Text style={styles.exchangeButtonText}>Proposer un échange</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const { canPerformAction } = useSubscription();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header avec recherche et filtres */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>WinWin</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("Suggestions")}
            >
              <Ionicons name="bulb-outline" size={24} color="#227897" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("Map")}
            >
              <Ionicons name="map-outline" size={24} color="#227897" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Widget de suggestions intelligentes */}
        <SuggestionsWidget navigation={navigation} />

        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un objet..."
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={applyFilters}
          />
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
          >
            <Ionicons name="options-outline" size={20} color="#227897" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Liste des objets */}
      <FlatList
        data={filteredItems}
        renderItem={renderItemCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={[styles.itemsList, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal des filtres */}
      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtres</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Filtre par catégorie */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Catégorie</Text>
              <View style={styles.filterOptions}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.filterOption,
                      selectedCategory === category &&
                        styles.filterOptionSelected,
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        selectedCategory === category &&
                          styles.filterOptionTextSelected,
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Filtre par état */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>État</Text>
              <View style={styles.filterOptions}>
                {conditions.map((condition) => (
                  <TouchableOpacity
                    key={condition}
                    style={[
                      styles.filterOption,
                      selectedCondition === condition &&
                        styles.filterOptionSelected,
                    ]}
                    onPress={() => setSelectedCondition(condition)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        selectedCondition === condition &&
                          styles.filterOptionTextSelected,
                      ]}
                    >
                      {condition}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Filtre par distance */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Distance</Text>
              <View style={styles.filterOptions}>
                {distances.map((distance) => (
                  <TouchableOpacity
                    key={distance}
                    style={[
                      styles.filterOption,
                      selectedDistance === distance &&
                        styles.filterOptionSelected,
                    ]}
                    onPress={() => setSelectedDistance(distance)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        selectedDistance === distance &&
                          styles.filterOptionTextSelected,
                      ]}
                    >
                      {distance}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
              <Text style={styles.resetButtonText}>Réinitialiser</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
              <Text style={styles.applyButtonText}>Appliquer</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#fff8f0",
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  filterButton: {
    marginLeft: 10,
    padding: 5,
  },
  itemsList: {
    padding: 10,
  },
  itemCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 5,
    flex: 1,
    maxWidth: "48%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: "#f0f0f0",
  },
  itemInfo: {
    padding: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    minHeight: 35,
  },
  itemDetails: {
    marginBottom: 10,
  },
  itemDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  itemDistance: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  itemValueLabel: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  itemValue: {
    fontSize: 12,
    color: "#227897",
    fontWeight: "bold",
  },
  exchangeButton: {
    backgroundColor: "#227897",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: "center",
  },
  exchangeButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  // Styles pour la modal des filtres
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterSection: {
    marginVertical: 20,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  filterOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  filterOptionSelected: {
    backgroundColor: "#227897",
    borderColor: "#227897",
  },
  filterOptionText: {
    fontSize: 14,
    color: "#666",
  },
  filterOptionTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalActions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    gap: 10,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  resetButtonText: {
    fontSize: 16,
    color: "#666",
  },
  applyButton: {
    flex: 1,
    backgroundColor: "#227897",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default HomeScreen;
