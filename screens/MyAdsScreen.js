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
import { useSubscription } from '../context/SubscriptionContext';
import { UsageLimitBanner } from '../components/SubscriptionBanner';

const MyAdsScreen = ({ navigation }) => {
  const { getFeatureLimit, canPerformAction } = useSubscription();
  const [selectedTab, setSelectedTab] = useState('active'); // active, inactive, sold
  const [refreshing, setRefreshing] = useState(false);
  
  // Données simulées pour les annonces
  const mockAds = {
    active: [
      {
        id: '1',
        title: 'iPhone 12 Pro',
        description: 'Excellent état, avec boîte et accessoires',
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop',
        estimatedValue: '800€',
        condition: 'Excellent état',
        category: 'Électronique',
        views: 45,
        likes: 12,
        messages: 8,
        createdAt: '2024-01-15',
        status: 'active'
      },
      {
        id: '2',
        title: 'Vélo de course Specialized',
        description: 'Vélo en très bon état, peu utilisé',
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop',
        estimatedValue: '1200€',
        condition: 'Très bon état',
        category: 'Sport',
        views: 32,
        likes: 8,
        messages: 5,
        createdAt: '2024-01-10',
        status: 'active'
      },
      {
        id: '3',
        title: 'Canapé 3 places',
        description: 'Canapé confortable, quelques traces d\'usure',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
        estimatedValue: '400€',
        condition: 'Bon état',
        category: 'Mobilier',
        views: 28,
        likes: 6,
        messages: 3,
        createdAt: '2024-01-08',
        status: 'active'
      }
    ],
    inactive: [
      {
        id: '4',
        title: 'Appareil photo Canon',
        description: 'Appareil en panne, pour pièces',
        image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&h=300&fit=crop',
        estimatedValue: '150€',
        condition: 'En panne',
        category: 'Électronique',
        views: 15,
        likes: 2,
        messages: 1,
        createdAt: '2024-01-05',
        status: 'inactive'
      }
    ],
    sold: [
      {
        id: '5',
        title: 'MacBook Air 2020',
        description: 'Échangé contre un vélo électrique',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop',
        estimatedValue: '900€',
        condition: 'Excellent état',
        category: 'Électronique',
        views: 67,
        likes: 23,
        messages: 15,
        createdAt: '2024-01-01',
        soldAt: '2024-01-12',
        status: 'sold'
      }
    ]
  };

  const maxAds = getFeatureLimit('maxAds');
  const currentActiveAds = mockAds.active.length;

  const tabs = [
    { key: 'active', title: 'Actives', count: mockAds.active.length },
    { key: 'inactive', title: 'Inactives', count: mockAds.inactive.length },
    { key: 'sold', title: 'Échangées', count: mockAds.sold.length }
  ];

  const onRefresh = () => {
    setRefreshing(true);
    // Simulation du rechargement
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleCreateAd = () => {
    if (!canPerformAction('createAd')) {
      Alert.alert(
        'Limite atteinte',
        `Vous avez atteint la limite de ${maxAds} annonces pour votre plan. Mettez à niveau votre abonnement pour créer plus d'annonces.`,
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
    
    Alert.alert(
      'Créer une annonce',
      'Fonctionnalité en cours de développement',
      [{ text: 'OK' }]
    );
  };

  const handleEditAd = (adId) => {
    Alert.alert(
      'Modifier l\'annonce',
      'Fonctionnalité en cours de développement',
      [{ text: 'OK' }]
    );
  };

  const handleDeleteAd = (adId) => {
    Alert.alert(
      'Supprimer l\'annonce',
      'Êtes-vous sûr de vouloir supprimer cette annonce ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Succès', 'Annonce supprimée avec succès');
          }
        }
      ]
    );
  };

  const handleToggleStatus = (adId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'réactiver' : 'désactiver';
    
    Alert.alert(
      `${action.charAt(0).toUpperCase() + action.slice(1)} l'annonce`,
      `Voulez-vous ${action} cette annonce ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: action.charAt(0).toUpperCase() + action.slice(1),
          onPress: () => {
            Alert.alert('Succès', `Annonce ${newStatus === 'active' ? 'réactivée' : 'désactivée'} avec succès`);
          }
        }
      ]
    );
  };

  const renderAdCard = ({ item }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'active': return '#4CAF50';
        case 'inactive': return '#FF9800';
        case 'sold': return '#2196F3';
        default: return '#999';
      }
    };

    const getStatusText = (status) => {
      switch (status) {
        case 'active': return 'Active';
        case 'inactive': return 'Inactive';
        case 'sold': return 'Échangée';
        default: return 'Inconnu';
      }
    };

    return (
      <TouchableOpacity 
        style={styles.adCard}
        onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
      >
        <Image source={{ uri: item.image }} style={styles.adImage} />
        
        <View style={styles.adContent}>
          <View style={styles.adHeader}>
            <Text style={styles.adTitle} numberOfLines={1}>{item.title}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
            </View>
          </View>
          
          <Text style={styles.adDescription} numberOfLines={2}>{item.description}</Text>
          <Text style={styles.adValue}>{item.estimatedValue}</Text>
          
          <View style={styles.adStats}>
            <View style={styles.statItem}>
              <Ionicons name="eye-outline" size={16} color="#666" />
              <Text style={styles.statText}>{item.views}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="heart-outline" size={16} color="#666" />
              <Text style={styles.statText}>{item.likes}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="chatbubble-outline" size={16} color="#666" />
              <Text style={styles.statText}>{item.messages}</Text>
            </View>
          </View>
          
          {item.status !== 'sold' && (
            <View style={styles.adActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleEditAd(item.id)}
              >
                <Ionicons name="create-outline" size={20} color="#227897" />
                <Text style={styles.actionText}>Modifier</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleToggleStatus(item.id, item.status)}
              >
                <Ionicons 
                  name={item.status === 'active' ? 'pause-outline' : 'play-outline'} 
                  size={20} 
                  color="#FF9800" 
                />
                <Text style={styles.actionText}>
                  {item.status === 'active' ? 'Désactiver' : 'Réactiver'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleDeleteAd(item.id)}
              >
                <Ionicons name="trash-outline" size={20} color="#F44336" />
                <Text style={[styles.actionText, { color: '#F44336' }]}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="document-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>
        {selectedTab === 'active' && 'Aucune annonce active'}
        {selectedTab === 'inactive' && 'Aucune annonce inactive'}
        {selectedTab === 'sold' && 'Aucun échange réalisé'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {selectedTab === 'active' && 'Créez votre première annonce pour commencer à échanger'}
        {selectedTab === 'inactive' && 'Vos annonces désactivées apparaîtront ici'}
        {selectedTab === 'sold' && 'Vos échanges réalisés apparaîtront ici'}
      </Text>
      {selectedTab === 'active' && (
        <TouchableOpacity 
          style={styles.createButton}
          onPress={handleCreateAd}
        >
          <Text style={styles.createButtonText}>Créer une annonce</Text>
        </TouchableOpacity>
      )}
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
        <Text style={styles.headerTitle}>Mes annonces</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleCreateAd}
        >
          <Ionicons name="add" size={24} color="#227897" />
        </TouchableOpacity>
      </View>

      {/* Usage Limit Banner */}
      <UsageLimitBanner 
        current={currentActiveAds}
        limit={maxAds}
        feature="annonces actives"
        onUpgrade={() => navigation.navigate('Subscription')}
      />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              selectedTab === tab.key && styles.activeTab
            ]}
            onPress={() => setSelectedTab(tab.key)}
          >
            <Text style={[
              styles.tabText,
              selectedTab === tab.key && styles.activeTabText
            ]}>
              {tab.title} ({tab.count})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <FlatList
        data={mockAds[selectedTab]}
        renderItem={renderAdCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
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
  addButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#227897',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#227897',
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  adCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  adImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  adContent: {
    padding: 16,
  },
  adHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  adTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  adDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  adValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#227897',
    marginBottom: 12,
  },
  adStats: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  adActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#227897',
    fontWeight: '500',
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
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#227897',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MyAdsScreen;