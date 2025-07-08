import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ExchangeContext } from "../context/ExchangeContext";
import SuggestionCard from "../components/SuggestionCard";

const SuggestionsScreen = ({ navigation }) => {
  const {
    suggestions,
    getSuggestionsByType,
    markSuggestionAsViewed,
    generateSmartSuggestions,
    userPreferences,
    favorites,
    addToFavorites,
    removeFromFavorites,
  } = useContext(ExchangeContext);

  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { key: "all", label: "Toutes", icon: "apps" },
    { key: "object_match", label: "Échanges", icon: "swap-horizontal" },
    { key: "category_preference", label: "Préférences", icon: "star" },
    { key: "search_based", label: "Recherches", icon: "search" },
    { key: "similar_to_favorite", label: "Favoris", icon: "heart" },
  ];

  const filteredSuggestions =
    selectedCategory === "all"
      ? suggestions
      : getSuggestionsByType(selectedCategory);

  useEffect(() => {
    if (suggestions.length === 0) {
      generateSmartSuggestions();
    }
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await generateSmartSuggestions();
    setRefreshing(false);
  };

  const handleFavoritePress = (suggestion) => {
    if (isFavorite(suggestion.id)) {
      removeFromFavorites(suggestion.id);
    } else {
      addToFavorites(suggestion);
    }
  };

  const isFavorite = (suggestionId) => {
    return favorites.some((fav) => fav.id === suggestionId);
  };

  const renderSuggestionItem = ({ item }) => (
    <SuggestionCard
      suggestion={item}
      onPress={() => {
        markSuggestionAsViewed(item.id);
        navigation.navigate("ProductDetail", { product: item.product });
      }}
      onFavoritePress={() => handleFavoritePress(item)}
      isFavorite={isFavorite(item.id)}
    />
  );

  const renderCategoryFilter = (category) => (
    <TouchableOpacity
      key={category.key}
      style={[
        styles.categoryButton,
        selectedCategory === category.key && styles.selectedCategoryButton,
      ]}
      onPress={() => setSelectedCategory(category.key)}
    >
      <Ionicons
        name={category.icon}
        size={18}
        color={selectedCategory === category.key ? "#fff" : "#666"}
      />
      <Text
        style={[
          styles.categoryButtonText,
          selectedCategory === category.key &&
            styles.selectedCategoryButtonText,
        ]}
      >
        {category.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Suggestions intelligentes</Text>

        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Ionicons name="refresh" size={24} color="#227897" />
        </TouchableOpacity>
      </View>

      {/* Filtres par catégorie */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map(renderCategoryFilter)}
      </ScrollView>

      {/* Liste des suggestions */}
      <FlatList
        data={filteredSuggestions}
        renderItem={renderSuggestionItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.suggestionsContainer}
        contentContainerStyle={styles.suggestionsList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#227897"]}
            tintColor="#227897"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Aucune suggestion</Text>
            <Text style={styles.emptyText}>
              Nous analysons vos préférences pour vous proposer des suggestions
              personnalisées.
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  refreshButton: {
    padding: 8,
  },
  categoriesContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  categoriesContent: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  selectedCategoryButton: {
    backgroundColor: "#227897",
    borderColor: "#227897",
  },
  categoryButtonText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  selectedCategoryButtonText: {
    color: "#fff",
  },
  suggestionsContainer: {
    flex: 1,
  },
  suggestionsList: {
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 40,
  },
  generateButton: {
    backgroundColor: "#227897",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  generateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SuggestionsScreen;
