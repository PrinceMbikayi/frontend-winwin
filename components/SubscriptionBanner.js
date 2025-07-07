import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSubscription } from '../context/SubscriptionContext';

const SubscriptionBanner = ({ navigation, feature, message, showUpgrade = true }) => {
  const { currentPlan, getDaysRemaining, canPerformAction } = useSubscription();

  // Configuration des couleurs et icônes par plan
  const planConfig = {
    free: {
      color: '#28a745',
      backgroundColor: '#d4edda',
      icon: 'gift-outline',
      name: 'Gratuit'
    },
    standard: {
      color: '#ffc107',
      backgroundColor: '#fff3cd',
      icon: 'star-outline',
      name: 'Standard'
    },
    premium: {
      color: '#007bff',
      backgroundColor: '#d1ecf1',
      icon: 'diamond-outline',
      name: 'Premium'
    },
    business: {
      color: '#6f42c1',
      backgroundColor: '#e2d9f3',
      icon: 'business-outline',
      name: 'Business'
    }
  };

  const config = planConfig[currentPlan] || planConfig.free;
  const daysRemaining = getDaysRemaining();

  const handleUpgrade = () => {
    if (navigation) {
      navigation.navigate('Subscription');
    }
  };

  const showFeatureRestriction = (restrictedFeature) => {
    Alert.alert(
      'Fonctionnalité Premium',
      `Cette fonctionnalité nécessite un abonnement. Voulez-vous voir nos plans ?`,
      [
        { text: 'Plus tard', style: 'cancel' },
        {
          text: 'Voir les plans',
          onPress: handleUpgrade
        }
      ]
    );
  };

  // Si une fonctionnalité spécifique est vérifiée et qu'elle n'est pas disponible
  if (feature && !canPerformAction(feature)) {
    return (
      <View style={[styles.restrictionBanner, { backgroundColor: '#fff5f5' }]}>
        <View style={styles.restrictionContent}>
          <Ionicons name="lock-closed" size={20} color="#ff6b6b" />
          <Text style={styles.restrictionText}>
            {message || 'Cette fonctionnalité nécessite un abonnement premium'}
          </Text>
        </View>
        {showUpgrade && (
          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={handleUpgrade}
          >
            <Text style={styles.upgradeButtonText}>Voir les plans</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // Banner d'information sur le plan actuel
  return (
    <View style={[styles.banner, { backgroundColor: config.backgroundColor }]}>
      <View style={styles.bannerContent}>
        <View style={styles.planInfo}>
          <Ionicons name={config.icon} size={20} color={config.color} />
          <Text style={[styles.planName, { color: config.color }]}>
            Plan {config.name}
          </Text>
        </View>
        
        {currentPlan !== 'free' && daysRemaining !== null && (
          <Text style={styles.daysRemaining}>
            {daysRemaining > 0 
              ? `${daysRemaining} jour${daysRemaining > 1 ? 's' : ''} restant${daysRemaining > 1 ? 's' : ''}` 
              : 'Expire aujourd\'hui'
            }
          </Text>
        )}
        
        {currentPlan === 'free' && showUpgrade && (
          <TouchableOpacity
            style={[styles.upgradeButton, { backgroundColor: config.color }]}
            onPress={handleUpgrade}
          >
            <Text style={styles.upgradeButtonText}>Passer Premium</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Composant spécialisé pour les restrictions de fonctionnalités
export const FeatureRestriction = ({ navigation, feature, title, description }) => {
  const { canPerformAction } = useSubscription();

  if (canPerformAction(feature)) {
    return null; // Ne rien afficher si la fonctionnalité est disponible
  }

  const handleUpgrade = () => {
    if (navigation) {
      navigation.navigate('Subscription');
    }
  };

  return (
    <View style={styles.featureRestriction}>
      <View style={styles.restrictionHeader}>
        <Ionicons name="lock-closed" size={24} color="#ff6b6b" />
        <Text style={styles.restrictionTitle}>{title}</Text>
      </View>
      <Text style={styles.restrictionDescription}>{description}</Text>
      <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
        <Ionicons name="arrow-up" size={16} color="#fff" />
        <Text style={styles.upgradeButtonText}>Passer Premium</Text>
      </TouchableOpacity>
    </View>
  );
};

// Composant pour afficher les limites d'utilisation
export const UsageLimitBanner = ({ navigation, current, limit, feature, unit = 'éléments' }) => {
  const percentage = limit > 0 ? (current / limit) * 100 : 0;
  const isNearLimit = percentage >= 80;
  const isAtLimit = current >= limit;

  if (limit === -1) return null; // Pas de limite (plan premium)

  const handleUpgrade = () => {
    if (navigation) {
      navigation.navigate('Subscription');
    }
  };

  return (
    <View style={[
      styles.usageBanner,
      { backgroundColor: isAtLimit ? '#fff5f5' : isNearLimit ? '#fff8e1' : '#f0f9ff' }
    ]}>
      <View style={styles.usageContent}>
        <Text style={styles.usageText}>
          {current} / {limit} {unit} utilisés
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { 
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: isAtLimit ? '#ff6b6b' : isNearLimit ? '#ffc107' : '#007bff'
              }
            ]} 
          />
        </View>
      </View>
      
      {(isNearLimit || isAtLimit) && (
        <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
          <Text style={styles.upgradeButtonText}>
            {isAtLimit ? 'Augmenter la limite' : 'Voir les plans'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    margin: 15,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  planInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planName: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  daysRemaining: {
    fontSize: 12,
    color: '#6c757d',
  },
  restrictionBanner: {
    margin: 15,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ff6b6b',
  },
  restrictionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  restrictionText: {
    fontSize: 14,
    color: '#ff6b6b',
    marginLeft: 8,
    flex: 1,
  },
  featureRestriction: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ff6b6b',
    alignItems: 'center',
  },
  restrictionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  restrictionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ff6b6b',
    marginLeft: 8,
  },
  restrictionDescription: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 20,
  },
  upgradeButton: {
    backgroundColor: '#227897',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  usageBanner: {
    margin: 15,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  usageContent: {
    marginBottom: 10,
  },
  usageText: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e9ecef',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});

export default SubscriptionBanner;