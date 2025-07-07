import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useExchange } from '../context/ExchangeContext';

const TransactionHistoryScreen = ({ navigation }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { getUserStats } = useExchange();

  // Données simulées pour l'historique des transactions
  const mockTransactions = [
    {
      id: '1',
      type: 'exchange',
      status: 'completed',
      title: 'iPhone 12 Pro ↔ MacBook Air',
      date: '2024-01-15',
      partnerName: 'Jean Martin',
      partnerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
      myItem: {
        name: 'iPhone 12 Pro 128GB',
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100&h=100&fit=crop'
      },
      partnerItem: {
        name: 'MacBook Air M1',
        image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=100&h=100&fit=crop'
      },
      rating: 5,
      location: 'Paris 15ème'
    },
    {
      id: '2',
      type: 'exchange',
      status: 'completed',
      title: 'Vélo électrique ↔ Trottinette',
      date: '2024-01-10',
      partnerName: 'Sophie Dubois',
      partnerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face',
      myItem: {
        name: 'Vélo électrique Decathlon',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop'
      },
      partnerItem: {
        name: 'Trottinette Xiaomi',
        image: 'https://images.unsplash.com/photo-1544191696-15693072b5a5?w=100&h=100&fit=crop'
      },
      rating: 4,
      location: 'Lyon 3ème'
    },
    {
      id: '3',
      type: 'exchange',
      status: 'cancelled',
      title: 'Appareil photo ↔ Drone',
      date: '2024-01-05',
      partnerName: 'Marc Leroy',
      partnerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
      myItem: {
        name: 'Canon EOS R6',
        image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=100&h=100&fit=crop'
      },
      partnerItem: {
        name: 'DJI Mini 3',
        image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=100&h=100&fit=crop'
      },
      rating: null,
      location: 'Marseille'
    },
    {
      id: '4',
      type: 'exchange',
      status: 'pending',
      title: 'Livre de cuisine ↔ Plante',
      date: '2024-01-20',
      partnerName: 'Emma Petit',
      partnerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
      myItem: {
        name: 'Livre "Cuisine du monde"',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100&h=100&fit=crop'
      },
      partnerItem: {
        name: 'Monstera Deliciosa',
        image: 'https://images.unsplash.com/photo-1545239705-1564e58b9e4a?w=100&h=100&fit=crop'
      },
      rating: null,
      location: 'Toulouse'
    }
  ];

  const filters = [
    { id: 'all', label: 'Tous', count: mockTransactions.length },
    { id: 'completed', label: 'Terminés', count: mockTransactions.filter(t => t.status === 'completed').length },
    { id: 'pending', label: 'En cours', count: mockTransactions.filter(t => t.status === 'pending').length },
    { id: 'cancelled', label: 'Annulés', count: mockTransactions.filter(t => t.status === 'cancelled').length }
  ];

  const filteredTransactions = selectedFilter === 'all' 
    ? mockTransactions 
    : mockTransactions.filter(t => t.status === selectedFilter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#28a745';
      case 'pending': return '#ffc107';
      case 'cancelled': return '#dc3545';
      default: return '#666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'pending': return 'En cours';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const renderStars = (rating) => {
    if (!rating) return null;
    
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={14}
          color={i <= rating ? '#FFD700' : '#ccc'}
        />
      );
    }
    return (
      <View style={styles.starsContainer}>
        {stars}
      </View>
    );
  };

  const renderTransaction = ({ item }) => (
    <TouchableOpacity 
      style={styles.transactionCard}
      onPress={() => {
        // Navigation vers les détails de la transaction
        navigation.navigate('TransactionDetail', { transaction: item });
      }}
    >
      <View style={styles.transactionHeader}>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionTitle}>{item.title}</Text>
          <Text style={styles.transactionDate}>
            {new Date(item.date).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.exchangeDetails}>
        <View style={styles.itemContainer}>
          <Image source={{ uri: item.myItem.image }} style={styles.itemImage} />
          <Text style={styles.itemName} numberOfLines={2}>{item.myItem.name}</Text>
        </View>
        
        <View style={styles.exchangeArrow}>
          <Ionicons name="swap-horizontal" size={24} color="#007AFF" />
        </View>
        
        <View style={styles.itemContainer}>
          <Image source={{ uri: item.partnerItem.image }} style={styles.itemImage} />
          <Text style={styles.itemName} numberOfLines={2}>{item.partnerItem.name}</Text>
        </View>
      </View>

      <View style={styles.partnerInfo}>
        <View style={styles.partnerDetails}>
          <Image source={{ uri: item.partnerAvatar }} style={styles.partnerAvatar} />
          <View style={styles.partnerText}>
            <Text style={styles.partnerName}>{item.partnerName}</Text>
            <Text style={styles.partnerLocation}>{item.location}</Text>
          </View>
        </View>
        
        {item.rating && (
          <View style={styles.ratingContainer}>
            {renderStars(item.rating)}
            <Text style={styles.ratingText}>{item.rating}/5</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const FilterButton = ({ filter }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === filter.id && styles.filterButtonActive
      ]}
      onPress={() => setSelectedFilter(filter.id)}
    >
      <Text style={[
        styles.filterButtonText,
        selectedFilter === filter.id && styles.filterButtonTextActive
      ]}>
        {filter.label} ({filter.count})
      </Text>
    </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Historique des transactions</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Filtres */}
      <View style={styles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          {filters.map(filter => (
            <FilterButton key={filter.id} filter={filter} />
          ))}
        </ScrollView>
      </View>

      {/* Liste des transactions */}
      <FlatList
        data={filteredTransactions}
        renderItem={renderTransaction}
        keyExtractor={item => item.id}
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateTitle}>Aucune transaction</Text>
            <Text style={styles.emptyStateText}>
              {selectedFilter === 'all' 
                ? 'Vous n\'avez pas encore effectué d\'échanges.'
                : `Aucune transaction ${getStatusText(selectedFilter).toLowerCase()}.`
              }
            </Text>
          </View>
        }
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
  },
  placeholder: {
    width: 40,
  },
  filtersContainer: {
    backgroundColor: 'white',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  filtersContent: {
    paddingHorizontal: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  transactionsList: {
    flex: 1,
  },
  transactionsContent: {
    padding: 16,
  },
  transactionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  exchangeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemContainer: {
    flex: 1,
    alignItems: 'center',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemName: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    lineHeight: 16,
  },
  exchangeArrow: {
    marginHorizontal: 16,
  },
  partnerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  partnerDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  partnerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  partnerText: {
    flex: 1,
  },
  partnerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  partnerLocation: {
    fontSize: 12,
    color: '#666',
  },
  ratingContainer: {
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default TransactionHistoryScreen;