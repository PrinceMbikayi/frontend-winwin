import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  ScrollView,
  Alert,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

// Données simulées pour les produits géolocalisés
const mockMapItems = [
  {
    id: '1',
    title: 'iPhone 12 Pro',
    estimatedValue: '800€',
    category: 'Électronique',
    condition: 'Très bon état',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop',
    coordinate: {
      latitude: 48.8566,
      longitude: 2.3522,
    },
    distance: 0.5,
    seller: 'Wael Wael'
  },
  {
    id: '2',
    title: 'Vélo de course',
    estimatedValue: '450€',
    category: 'Sport',
    condition: 'Bon état',
    image: 'https://images.unsplash.com/photo-1544191696-15693072e0b5?w=300&h=300&fit=crop',
    coordinate: {
      latitude: 48.8606,
      longitude: 2.3376,
    },
    distance: 1.2,
    seller: 'Jean Martin'
  },
  {
    id: '3',
    title: 'Canapé 3 places',
    estimatedValue: '300€',
    category: 'Mobilier',
    condition: 'État correct',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
    coordinate: {
      latitude: 48.8738,
      longitude: 2.2950,
    },
    distance: 2.8,
    seller: 'Sophie Leroy'
  },
  {
    id: '4',
    title: 'Machine à café',
    estimatedValue: '120€',
    category: 'Électroménager',
    condition: 'Très bon état',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop',
    coordinate: {
      latitude: 48.8448,
      longitude: 2.3740,
    },
    distance: 3.1,
    seller: 'Pierre Durand'
  },
  {
    id: '5',
    title: 'Guitare acoustique',
    estimatedValue: '250€',
    category: 'Musique',
    condition: 'Bon état',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    coordinate: {
      latitude: 48.8534,
      longitude: 2.3488,
    },
    distance: 4.2,
    seller: 'Lucas Bernard'
  },
  {
    id: '6',
    title: 'Appareil photo vintage',
    estimatedValue: '180€',
    category: 'Photo',
    condition: 'État correct',
    image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=300&fit=crop',
    coordinate: {
      latitude: 48.8671,
      longitude: 2.3200,
    },
    distance: 5.5,
    seller: 'Emma Rousseau'
  }
];

const distanceFilters = [
  { id: 'all', label: 'Toutes distances', value: 100 },
  { id: '1km', label: '1 km', value: 1 },
  { id: '2km', label: '2 km', value: 2 },
  { id: '5km', label: '5 km', value: 5 },
  { id: '10km', label: '10 km', value: 10 }
];

const MapScreen = ({ navigation }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedDistance, setSelectedDistance] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredItems, setFilteredItems] = useState(mockMapItems);
  const [selectedMarker, setSelectedMarker] = useState(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    applyDistanceFilter();
  }, [selectedDistance]);

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission refusée',
          'L\'accès à la localisation est nécessaire pour afficher la carte.'
        );
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      console.error('Erreur de géolocalisation:', error);
      // Position par défaut (Paris)
      setUserLocation({
        latitude: 48.8566,
        longitude: 2.3522,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  const applyDistanceFilter = () => {
    const selectedFilter = distanceFilters.find(f => f.id === selectedDistance);
    if (selectedFilter) {
      const filtered = mockMapItems.filter(item => item.distance <= selectedFilter.value);
      setFilteredItems(filtered);
    }
  };

  const handleMarkerPress = (item) => {
    setSelectedMarker(item);
  };

  const handleViewProduct = () => {
    if (selectedMarker) {
      navigation.navigate('ProductDetail', { productId: selectedMarker.id });
      setSelectedMarker(null);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Électronique': return 'phone-portrait';
      case 'Sport': return 'basketball';
      case 'Mobilier': return 'home';
      case 'Électroménager': return 'cafe';
      case 'Musique': return 'musical-notes';
      case 'Photo': return 'camera';
      default: return 'pricetag';
    }
  };

  const getMarkerColor = (category) => {
    switch (category) {
      case 'Électronique': return '#007AFF';
      case 'Sport': return '#34C759';
      case 'Mobilier': return '#FF9500';
      case 'Électroménager': return '#AF52DE';
      case 'Musique': return '#FF2D92';
      case 'Photo': return '#5AC8FA';
      default: return '#227897';
    }
  };

  const renderDistanceFilter = (filter) => (
    <TouchableOpacity
      key={filter.id}
      style={[
        styles.filterOption,
        selectedDistance === filter.id && styles.filterOptionSelected
      ]}
      onPress={() => {
        setSelectedDistance(filter.id);
        setShowFilters(false);
      }}
    >
      <Text style={[
        styles.filterOptionText,
        selectedDistance === filter.id && styles.filterOptionTextSelected
      ]}>
        {filter.label}
      </Text>
    </TouchableOpacity>
  );

  if (!userLocation) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement de la carte...</Text>
      </SafeAreaView>
    );
  }

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
        <Text style={styles.headerTitle}>Brocante digitale</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="options-outline" size={24} color="#227897" />
        </TouchableOpacity>
      </View>

      {/* Filtre de distance actuel */}
      <View style={styles.currentFilter}>
        <Ionicons name="location-outline" size={16} color="#666" />
        <Text style={styles.currentFilterText}>
          Rayon: {distanceFilters.find(f => f.id === selectedDistance)?.label}
        </Text>
        <Text style={styles.itemCount}>
          {filteredItems.length} objet{filteredItems.length > 1 ? 's' : ''}
        </Text>
      </View>

      {/* Carte */}
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={userLocation}
        showsUserLocation={true}
        showsMyLocationButton={true}
        onPress={() => setSelectedMarker(null)}
      >
        {filteredItems.map((item) => (
          <Marker
            key={item.id}
            coordinate={item.coordinate}
            onPress={() => handleMarkerPress(item)}
            pinColor={getMarkerColor(item.category)}
          >
            <View style={[
              styles.customMarker,
              { backgroundColor: getMarkerColor(item.category) }
            ]}>
              <Ionicons 
                name={getCategoryIcon(item.category)} 
                size={20} 
                color="#fff" 
              />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Popup produit sélectionné */}
      {selectedMarker && (
        <View style={styles.productPopup}>
          <View style={styles.productInfo}>
            <View style={styles.productHeader}>
              <Text style={styles.productTitle} numberOfLines={1}>
                {selectedMarker.title}
              </Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setSelectedMarker(null)}
              >
                <Ionicons name="close" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.productDetails}>
              <Text style={styles.productCategory}>{selectedMarker.category}</Text>
              <Text style={styles.productCondition}>{selectedMarker.condition}</Text>
            </View>
            
            <View style={styles.productFooter}>
              <View style={styles.priceContainer}>
                <Text style={styles.productPrice}>{selectedMarker.estimatedValue}</Text>
                <Text style={styles.productDistance}>{selectedMarker.distance} km</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.viewButton}
                onPress={handleViewProduct}
              >
                <Text style={styles.viewButtonText}>Voir</Text>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Modal des filtres */}
      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtres de distance</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Text style={styles.filterSectionTitle}>Rayon de recherche</Text>
            {distanceFilters.map(renderDistanceFilter)}
            
            <View style={styles.filterInfo}>
              <Ionicons name="information-circle-outline" size={20} color="#666" />
              <Text style={styles.filterInfoText}>
                La distance est calculée à vol d'oiseau depuis votre position actuelle.
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  filterButton: {
    padding: 5,
  },
  currentFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  currentFilterText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
    flex: 1,
  },
  itemCount: {
    fontSize: 14,
    color: '#227897',
    fontWeight: 'bold',
  },
  map: {
    flex: 1,
  },
  customMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productPopup: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  productInfo: {
    flex: 1,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  closeButton: {
    padding: 5,
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  productCategory: {
    fontSize: 14,
    color: '#666',
  },
  productCondition: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: '500',
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flex: 1,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#227897',
    marginBottom: 2,
  },
  productDistance: {
    fontSize: 12,
    color: '#666',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#227897',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  viewButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  filterOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e9ecef',
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  filterOptionSelected: {
    borderColor: '#227897',
    backgroundColor: '#fff8f0',
  },
  filterOptionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  filterOptionTextSelected: {
    color: '#227897',
    fontWeight: 'bold',
  },
  filterInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
  },
  filterInfoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },
});

export default MapScreen;