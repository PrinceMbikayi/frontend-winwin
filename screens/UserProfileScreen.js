import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useExchange } from '../context/ExchangeContext';
import { UserBadges, UserRating } from '../components/UserBadges';
import RatingModal from '../components/RatingModal';

const { width } = Dimensions.get('window');
const itemSize = (width - 60) / 3; // 3 colonnes avec marges

// Données simulées pour les objets du vendeur
const mockUserItems = [
  {
    id: '1',
    title: 'MacBook Pro 2020',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop',
    condition: 'Excellent état',
    estimatedValue: '1200€'
  },
  {
    id: '2', 
    title: 'iPhone 13',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop',
    condition: 'Très bon état',
    estimatedValue: '650€'
  },
  {
    id: '3',
    title: 'AirPods Pro',
    image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300&h=300&fit=crop',
    condition: 'Bon état',
    estimatedValue: '180€'
  },
  {
    id: '4',
    title: 'iPad Air',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop',
    condition: 'Excellent état',
    estimatedValue: '450€'
  },
  {
    id: '5',
    title: 'Apple Watch',
    image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=300&h=300&fit=crop',
    condition: 'Très bon état',
    estimatedValue: '280€'
  },
  {
    id: '6',
    title: 'Nintendo Switch',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
    condition: 'Bon état',
    estimatedValue: '220€'
  }
];

const UserProfileScreen = ({ route, navigation }) => {
  const { userId, userName, userAvatar, exchangeId } = route.params || {};
  const [showRatingModal, setShowRatingModal] = useState(false);
  const { getUserRatings, getUserStats } = useExchange();
  
  const userRatings = getUserRatings(userId);
  const userStats = getUserStats();

  const handleRateUser = () => {
    setShowRatingModal(true);
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemContainer}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemOverlay}>
        <Text style={styles.itemValue}>{item.estimatedValue}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderRatingsList = () => {
    if (userRatings.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="star-outline" size={48} color="#ccc" />
          <Text style={styles.emptyStateText}>Aucune évaluation pour le moment</Text>
        </View>
      );
    }

    return userRatings.map((rating) => (
      <View key={rating.id} style={styles.ratingItem}>
        <View style={styles.ratingHeader}>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={star <= rating.rating ? 'star' : 'star-outline'}
                size={16}
                color={star <= rating.rating ? '#FFD700' : '#ccc'}
              />
            ))}
          </View>
          <Text style={styles.ratingDate}>
            {new Date(rating.createdAt).toLocaleDateString('fr-FR')}
          </Text>
        </View>
        {rating.comment && (
          <Text style={styles.ratingComment}>{rating.comment}</Text>
        )}
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil utilisateur</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Informations utilisateur */}
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            {userAvatar ? (
              <Image source={{ uri: userAvatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={40} color="#666" />
              </View>
            )}
          </View>
          <Text style={styles.userName}>{userName || 'Utilisateur'}</Text>
          
          {/* Note moyenne et badges */}
          <View style={styles.ratingBadgesContainer}>
            <UserRating userId={userId} showCount={true} />
            <UserBadges userId={userId} showTitle={false} horizontal={true} />
          </View>
        </View>

        {/* Statistiques */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Statistiques</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userStats.completedExchanges}</Text>
              <Text style={styles.statLabel}>Échanges réalisés</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userStats.successRate.toFixed(0)}%</Text>
              <Text style={styles.statLabel}>Taux de réussite</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userRatings.length}</Text>
              <Text style={styles.statLabel}>Évaluations</Text>
            </View>
          </View>
        </View>

        {/* Objets proposés */}
        <View style={styles.itemsSection}>
          <View style={styles.itemsHeader}>
            <Text style={styles.sectionTitle}>Objets proposés</Text>
            <View style={styles.itemsCount}>
              <Ionicons name="grid-outline" size={16} color="#666" />
              <Text style={styles.itemsCountText}>{mockUserItems.length}</Text>
            </View>
          </View>
          <FlatList
            data={mockUserItems}
            renderItem={renderUserItem}
            numColumns={3}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.itemsGrid}
            columnWrapperStyle={styles.itemsRow}
          />
        </View>

        {/* Badges détaillés */}
        <View style={styles.badgesSection}>
          <UserBadges userId={userId} showTitle={true} horizontal={false} />
        </View>

        {/* Liste des évaluations */}
        <View style={styles.ratingsSection}>
          <Text style={styles.sectionTitle}>Évaluations reçues</Text>
          {renderRatingsList()}
        </View>

        {/* Bouton pour évaluer */}
        {exchangeId && (
          <TouchableOpacity 
            style={styles.rateButton}
            onPress={handleRateUser}
          >
            <Ionicons name="star" size={20} color="white" />
            <Text style={styles.rateButtonText}>Évaluer cet utilisateur</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <RatingModal
        visible={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        exchangeId={exchangeId}
        ratedUserId={userId}
        ratedUserName={userName}
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
  content: {
    flex: 1,
  },
  userInfo: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  ratingBadgesContainer: {
    alignItems: 'center',
    width: '100%',
  },
  statsContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  badgesSection: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 16,
  },
  ratingsSection: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 16,
  },
  ratingItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    paddingVertical: 12,
  },
  ratingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  ratingDate: {
    fontSize: 12,
    color: '#666',
  },
  ratingComment: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  rateButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    margin: 20,
    borderRadius: 12,
  },
  rateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  // Styles pour la section des objets proposés
  itemsSection: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 16,
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemsCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemsCountText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    fontWeight: '500',
  },
  itemsGrid: {
    paddingBottom: 10,
  },
  itemsRow: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  itemContainer: {
    width: itemSize,
    height: itemSize,
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f8f9fa',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  itemOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  itemValue: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default UserProfileScreen;