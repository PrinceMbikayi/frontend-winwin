import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  FlatList,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FavoritesScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Données simulées pour les favoris
  const mockFavorites = [
    {
      id: '1',
      title: 'MacBook Pro 16" 2021',
      description: 'Excellent état, utilisé pour le développement',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop',
      estimatedValue: '2200€',
      condition: 'Excellent état',
      category: 'Électronique',
      location: 'Paris 15e',
      distance: '2.3 km',
      ownerName: 'Sarah Martin',
      ownerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      rating: 4.8,
      addedAt: '2024-01-15',
      isAvailable: true
    },
    {
      id: '2',
      title: 'Vélo électrique Specialized',
      description: 'Vélo en parfait état, batterie neuve',
      image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=300&h=300&fit=crop',
      estimatedValue: '1800€',
      condition: 'Comme neuf',
      category: 'Sport',
      location: 'Boulogne-Billancourt',
      distance: '5.1 km',
      ownerName: 'Thomas Dubois',
      ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      rating: 4.9,
      addedAt: '2024-01-12',
      isAvailable: true
    },
    {
      id: '3',
      title: 'Canapé design scandinave',
      description: 'Canapé 3 places, très confortable',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
      estimatedValue: '800€',
      condition: 'Très bon état',
      category: 'Mobilier',
      location: 'Neuilly-sur-Seine',
      distance: '8.7 km',
      ownerName: 'Marie Leroy',
      ownerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      rating: 4.6,
      addedAt: '2024-01-10',
      isAvailable: false
    },
    {
      id: '4',
      title: 'Appareil photo Canon EOS R5',
      description: 'Appareil professionnel avec objectifs',
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&h=300&fit=crop',
      estimatedValue: '3500€',
      condition: 'Excellent état',
      category: 'Électronique',
      location: 'Vincennes',
      distance: '12.4 km',
      ownerName: 'Pierre Moreau',
      ownerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      rating: 4.7,
      addedAt: '2024-01-08',
      isAvailable: true
    },
    {
      id: '5',
      title: 'Guitare électrique Fender',
      description: 'Stratocaster américaine, son exceptionnel',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
      estimatedValue: '1200€',
      condition: 'Bon état',
      category: 'Musique',
      location: 'Montreuil',
      distance: '15.2 km',
      ownerName: 'Alex Johnson',
      ownerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      rating: 4.5,
      addedAt: '2024-01-05',
      isAvailable: true
    }
  ];

  const categories = [
    { key: 'all', title: 'Tous', count: mockFavorites.length },
    { key: 'Électronique', title: 'Électronique', count: mockFavorites.filter(item => item.category === 'Électronique').length },
    { key: 'Sport', title: 'Sport', count: mockFavorites.filter(item => item.category === 'Sport').length },
    { key: 'Mobilier', title: 'Mobilier', count: mockFavorites.filter(item => item.category === 'Mobilier').length },
    { key: 'Musique', title: 'Musique', count: mockFavorites.filter(item => item.category === 'Musique').length }
  ];

  const filteredFavorites = selectedCategory === 'all' 
    ? mockFavorites 
    : mockFavorites.filter(item => item.category === selectedCategory);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleRemoveFromFavorites = (itemId, itemTitle) => {
    Alert.alert(
      'Retirer des favoris',
      `Voulez-vous retirer "${itemTitle}" de vos favoris ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Retirer',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Succès', 'Objet retiré de vos favoris');
          }
        }
      ]
    );
  };

  const handleContactOwner = (item) => {
    navigation.navigate('Messaging', {
      conversationId: `fav_${item.id}`,
      ownerName: item.ownerName,
      objectTitle: item.title
    });
  };

  const renderFavoriteCard = ({ item }) => (
    <TouchableOpacity 
      style={[styles.favoriteCard, !item.isAvailable && styles.unavailableCard]}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.favoriteImage} />
        {!item.isAvailable && (
          <View style={styles.unavailableOverlay}>
            <Text style={styles.unavailableText}>Non disponible</Text>
          </View>
        )}
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={() => handleRemoveFromFavorites(item.id, item.title)}
        >
          <Ionicons name="heart" size={20} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.favoriteContent}>
        <Text style={styles.favoriteTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.favoriteDescription} numberOfLines={2}>{item.description}</Text>
        
        <View style={styles.priceConditionRow}>
          <Text style={styles.favoriteValue}>{item.estimatedValue}</Text>
          <Text style={styles.favoriteCondition}>{item.condition}</Text>
        </View>
        
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color="#666" />
          <Text style={styles.locationText}>{item.location} • {item.distance}</Text>
        </View>
        
        <View style={styles.ownerRow}>
          <Image source={{ uri: item.ownerAvatar }} style={styles.ownerAvatar} />
          <View style={styles.ownerInfo}>
            <Text style={styles.ownerName}>{item.ownerName}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={12} color="#FFD700" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>
          
          {item.isAvailable && (
            <TouchableOpacity 
              style={styles.contactButton}
              onPress={() => handleContactOwner(item)}
            >
              <Ionicons name="chatbubble-outline" size={16} color="#227897" />
              <Text style={styles.contactText}>Contacter</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="heart-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>Aucun favori</Text>
      <Text style={styles.emptySubtitle}>
        Ajoutez des objets à vos favoris en appuyant sur le cœur lors de votre navigation
      </Text>
      <TouchableOpacity 
        style={styles.exploreButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.exploreButtonText}>Explorer les objets</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes favoris</Text>
        <View style={styles.placeholder} />
      </View>

      {mockFavorites.length > 0 && (
        <View style={styles.menuContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.menuContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.key}
              style={[
                styles.menuItem,
                selectedCategory === category.key && styles.menuItemActive
              ]}
              onPress={() => setSelectedCategory(category.key)}
            >
              <Text
                style={[
                  styles.menuItemText,
                  selectedCategory === category.key && styles.menuItemTextActive
                ]}
              >
                {category.title} ({category.count})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        </View>
      )}

      <FlatList
        data={filteredFavorites}
        renderItem={renderFavoriteCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
        numColumns={1}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  placeholder: {
    width: 40,
  },
  menuContainer: {
    backgroundColor: 'white',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef'
  },
  menuContent: {
    paddingHorizontal: 16
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e9ecef'
  },
  menuItemActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF'
  },
  menuItemText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500'
  },
  menuItemTextActive: {
    color: 'white'
  },
  listContainer: {
    padding: 16,
  },
  favoriteCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unavailableCard: {
    opacity: 0.7,
  },
  imageContainer: {
    position: 'relative',
  },
  favoriteImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  unavailableOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  unavailableText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'white',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteContent: {
    padding: 16,
  },
  favoriteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  favoriteDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  priceConditionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  favoriteValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#227897',
  },
  favoriteCondition: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  ownerInfo: {
    flex: 1,
  },
  ownerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 2,
    fontSize: 12,
    color: '#666',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  contactText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#227897',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: '#227897',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FavoritesScreen;