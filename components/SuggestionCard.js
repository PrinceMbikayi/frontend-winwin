import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SuggestionCard = ({ 
  suggestion, 
  onPress, 
  onFavoritePress, 
  isFavorite = false,
  style 
}) => {
  // Fonction pour obtenir l'icône selon le type de suggestion
  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'object_match':
        return 'swap-horizontal';
      case 'category_preference':
        return 'star';
      case 'search_based':
        return 'search';
      case 'similar_to_favorite':
        return 'heart';
      default:
        return 'bulb';
    }
  };

  // Fonction pour obtenir la couleur selon le type de suggestion
  const getSuggestionColor = (type) => {
    switch (type) {
      case 'object_match':
        return '#4CAF50';
      case 'category_preference':
        return '#FF9800';
      case 'search_based':
        return '#2196F3';
      case 'similar_to_favorite':
        return '#E91E63';
      default:
        return '#227897';
    }
  };

  // Fonction pour obtenir le label du type de suggestion
  const getSuggestionTypeLabel = (type) => {
    switch (type) {
      case 'object_match':
        return 'Échange possible';
      case 'category_preference':
        return 'Selon vos goûts';
      case 'search_based':
        return 'Basé sur vos recherches';
      case 'similar_to_favorite':
        return 'Similaire à vos favoris';
      default:
        return 'Suggestion';
    }
  };

  const suggestionColor = getSuggestionColor(suggestion.type);
  const suggestionIcon = getSuggestionIcon(suggestion.type);
  const suggestionLabel = getSuggestionTypeLabel(suggestion.type);

  return (
    <TouchableOpacity 
      style={[styles.card, style]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header avec type et score */}
      <View style={styles.header}>
        <View style={[styles.typeContainer, { backgroundColor: suggestionColor + '20' }]}>
          <Ionicons 
            name={suggestionIcon} 
            size={16} 
            color={suggestionColor} 
          />
          <Text style={[styles.typeText, { color: suggestionColor }]}>
            {suggestionLabel}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={onFavoritePress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons 
            name={isFavorite ? 'heart' : 'heart-outline'} 
            size={20} 
            color={isFavorite ? '#E91E63' : '#999'} 
          />
        </TouchableOpacity>
      </View>

      {/* Contenu principal */}
      <View style={styles.content}>
        {/* Image du produit suggéré */}
        {suggestion.product?.image && (
          <Image 
            source={{ uri: suggestion.product.image }} 
            style={styles.productImage}
            resizeMode="cover"
          />
        )}
        
        <View style={styles.productInfo}>
          <Text style={styles.productTitle} numberOfLines={2}>
            {suggestion.product?.title || 'Produit suggéré'}
          </Text>
          
          <Text style={styles.productDescription} numberOfLines={2}>
            {suggestion.product?.description || 'Description non disponible'}
          </Text>
          
          {suggestion.product?.category && (
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryText}>
                {suggestion.product.category}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Footer avec raison et score */}
      <View style={styles.footer}>
        <Text style={styles.reasonText} numberOfLines={2}>
          {suggestion.reason || 'Suggestion personnalisée pour vous'}
        </Text>
        
        <View style={styles.scoreContainer}>
          <Ionicons name="star" size={14} color="#227897" />
          <Text style={styles.scoreText}>
            {Math.round(suggestion.score * 100)}%
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
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
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flex: 1,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  favoriteButton: {
    padding: 4,
  },
  content: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#f5f5f5',
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  categoryContainer: {
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 12,
    color: '#227897',
    backgroundColor: '#22789720',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  reasonText: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    flex: 1,
    marginRight: 8,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#227897',
    marginLeft: 2,
  },
});

export default SuggestionCard;