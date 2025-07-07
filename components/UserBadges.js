import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useExchange } from '../context/ExchangeContext';

const UserBadges = ({ userId, showTitle = true, horizontal = false }) => {
  const { getUserBadges } = useExchange();
  const badges = getUserBadges(userId);

  if (badges.length === 0) {
    return null;
  }

  const BadgeItem = ({ badge }) => (
    <View style={[styles.badge, { borderColor: badge.color }]}>
      <Ionicons 
        name={badge.icon} 
        size={16} 
        color={badge.color} 
        style={styles.badgeIcon}
      />
      <Text style={[styles.badgeText, { color: badge.color }]}>
        {badge.name}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {showTitle && (
        <Text style={styles.title}>Badges</Text>
      )}
      
      {horizontal ? (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalContainer}
        >
          {badges.map((badge) => (
            <BadgeItem key={badge.id} badge={badge} />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.verticalContainer}>
          {badges.map((badge) => (
            <BadgeItem key={badge.id} badge={badge} />
          ))}
        </View>
      )}
    </View>
  );
};

const UserRating = ({ userId, showCount = true }) => {
  const { getUserAverageRating, getUserRatings } = useExchange();
  const averageRating = parseFloat(getUserAverageRating(userId));
  const ratings = getUserRatings(userId);

  if (ratings.length === 0) {
    return (
      <View style={styles.ratingContainer}>
        <Text style={styles.noRatingText}>Aucune évaluation</Text>
      </View>
    );
  }

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(averageRating);
    const hasHalfStar = averageRating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Ionicons key={i} name="star" size={16} color="#FFD700" />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <Ionicons key={i} name="star-half" size={16} color="#FFD700" />
        );
      } else {
        stars.push(
          <Ionicons key={i} name="star-outline" size={16} color="#ccc" />
        );
      }
    }
    return stars;
  };

  return (
    <View style={styles.ratingContainer}>
      <View style={styles.starsRow}>
        {renderStars()}
        <Text style={styles.ratingValue}>{averageRating}</Text>
      </View>
      {showCount && (
        <Text style={styles.ratingCount}>
          ({ratings.length} évaluation{ratings.length > 1 ? 's' : ''})
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  horizontalContainer: {
    flexDirection: 'row',
    paddingHorizontal: 4,
  },
  verticalContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  badgeIcon: {
    marginRight: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  ratingContainer: {
    alignItems: 'flex-start',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingValue: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  noRatingText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
});

export { UserBadges, UserRating };
export default UserBadges;