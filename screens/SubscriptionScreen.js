import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSubscription } from '../context/SubscriptionContext';

const SubscriptionScreen = ({ navigation }) => {
  const { currentPlan, subscriptionData, upgradePlan, getDaysRemaining } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const subscriptionPlans = [
    {
      id: 'free',
      name: 'Gratuit',
      subtitle: 'Plan Découverte',
      price: '0€',
      period: '/mois',
      color: '#28a745',
      icon: 'gift-outline',
      features: [
        'Jusqu\'à 15 annonces actives',
        'Pas d\'échanges possibles',
        'Messagerie désactivée',
        'Peut consulter les annonces des autres',
        'Accès aux catégories principales',
        'Support via FAQ uniquement'
      ],
      limitation: 'Pour échanger ou envoyer des messages, un abonnement est requis',
      current: currentPlan === 'free'
    },
    {
      id: 'standard',
      name: 'Standard',
      subtitle: 'Plan Actif',
      price: '4,99€',
      period: '/mois',
      color: '#ffc107',
      icon: 'star-outline',
      features: [
        'Jusqu\'à 35 annonces actives',
        'Échanges illimités',
        'Accès complet à la messagerie',
        'Visibilité boostée (1h/jour en haut des listes)',
        'Statistiques simples (vues, likes)',
        'Support par e-mail'
      ],
      popular: true,
      current: currentPlan === 'standard'
    },
    {
      id: 'premium',
      name: 'Premium',
      subtitle: 'Plan Pro Troc',
      price: '9,99€',
      period: '/mois',
      color: '#007bff',
      icon: 'diamond-outline',
      features: [
        'Annonces illimitées',
        'Échanges illimités',
        'Visibilité maximale (remontée auto toutes les 12h)',
        'Statistiques avancées (géo, clics, favoris)',
        'Badge "Membre Premium"',
        'Mise en avant "À ne pas rater"',
        'Support prioritaire via chat'
      ],
      current: currentPlan === 'premium'
    },
    {
      id: 'business',
      name: 'Business',
      subtitle: 'Pack Professionnel',
      price: '29,99€',
      period: '/mois',
      color: '#6f42c1',
      icon: 'business-outline',
      features: [
        'Page boutique personnalisée',
        'Annonces illimitées',
        'Statistiques complètes + export CSV',
        'Publication de promotions et événements',
        'Intégration WhatsApp / Telegram',
        '5 annonces sponsorisées / mois',
        'Badge "Boutique Certifiée"',
        'Assistance dédiée'
      ],
      description: 'Pour boutiques, artisans ou organisations',
      current: currentPlan === 'business'
    }
  ];

  const additionalOptions = [
    {
      id: 'boost_ad',
      name: 'Remonter une annonce',
      price: '0,99€',
      icon: 'arrow-up-circle-outline'
    },
    {
      id: 'boost_72h',
      name: 'Booster 72h',
      price: '1,99€',
      icon: 'rocket-outline'
    },
    {
      id: 'extra_ads',
      name: '+3 annonces',
      price: '1,49€',
      icon: 'add-circle-outline'
    },
    {
      id: 'no_ads',
      name: 'Supprimer la publicité',
      price: '1,99€',
      period: '/mois',
      icon: 'close-circle-outline'
    }
  ];

  const handleSubscribe = (plan) => {
    if (plan.current) {
      Alert.alert('Plan actuel', 'Vous utilisez déjà ce plan.');
      return;
    }

    Alert.alert(
      'Confirmer l\'abonnement',
      `Voulez-vous vous abonner au plan ${plan.name} pour ${plan.price}${plan.period} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: () => {
            // Ici, vous intégreriez le système de paiement (Stripe, PayPal, etc.)
            upgradePlan(plan.id, { paymentMethod: 'card', amount: plan.price });
            Alert.alert('Succès', `Abonnement au plan ${plan.name} activé !`);
          }
        }
      ]
    );
  };

  const handlePurchaseOption = (option) => {
    Alert.alert(
      'Confirmer l\'achat',
      `Voulez-vous acheter "${option.name}" pour ${option.price}${option.period || ''} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Acheter',
          onPress: () => {
            Alert.alert('Succès', `${option.name} acheté avec succès !`);
          }
        }
      ]
    );
  };

  const renderPlanCard = (plan) => (
    <View key={plan.id} style={[styles.planCard, plan.popular && styles.popularPlan]}>
      {plan.popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>POPULAIRE</Text>
        </View>
      )}
      
      <View style={styles.planHeader}>
        <View style={[styles.planIcon, { backgroundColor: plan.color + '20' }]}>
          <Ionicons name={plan.icon} size={32} color={plan.color} />
        </View>
        <Text style={styles.planName}>{plan.name}</Text>
        <Text style={styles.planSubtitle}>{plan.subtitle}</Text>
        {plan.description && (
          <Text style={styles.planDescription}>{plan.description}</Text>
        )}
      </View>

      <View style={styles.priceContainer}>
        <Text style={[styles.price, { color: plan.color }]}>{plan.price}</Text>
        <Text style={styles.period}>{plan.period}</Text>
      </View>

      <View style={styles.featuresContainer}>
        {plan.features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={16} color={plan.color} />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      {plan.limitation && (
        <View style={styles.limitationContainer}>
          <Ionicons name="lock-closed" size={16} color="#ff6b6b" />
          <Text style={styles.limitationText}>{plan.limitation}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.subscribeButton,
          { backgroundColor: plan.current ? '#ccc' : plan.color },
          plan.popular && styles.popularButton
        ]}
        onPress={() => handleSubscribe(plan)}
        disabled={plan.current}
      >
        <Text style={styles.subscribeButtonText}>
          {plan.current ? 'Plan actuel' : 'Choisir ce plan'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderAdditionalOption = (option) => (
    <TouchableOpacity
      key={option.id}
      style={styles.optionCard}
      onPress={() => handlePurchaseOption(option)}
    >
      <View style={styles.optionLeft}>
        <Ionicons name={option.icon} size={24} color="#227897" />
        <Text style={styles.optionName}>{option.name}</Text>
      </View>
      <Text style={styles.optionPrice}>{option.price}{option.period || ''}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#227897" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plans d'abonnement</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>🧾 Choisissez votre plan</Text>
        
        {subscriptionPlans.map(renderPlanCard)}

        <Text style={styles.sectionTitle}>💳 Options supplémentaires</Text>
        <View style={styles.optionsContainer}>
          {additionalOptions.map(renderAdditionalOption)}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Les abonnements se renouvellent automatiquement. Vous pouvez annuler à tout moment dans les paramètres.
          </Text>
        </View>
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#227897',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginVertical: 20,
    textAlign: 'center',
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative',
  },
  popularPlan: {
    borderWidth: 2,
    borderColor: '#ffc107',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#ffc107',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  planIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  planSubtitle: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 5,
  },
  planDescription: {
    fontSize: 14,
    color: '#6c757d',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  period: {
    fontSize: 16,
    color: '#6c757d',
    marginLeft: 5,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#495057',
    marginLeft: 10,
    flex: 1,
  },
  limitationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5f5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  limitationText: {
    fontSize: 12,
    color: '#ff6b6b',
    marginLeft: 8,
    flex: 1,
    fontStyle: 'italic',
  },
  subscribeButton: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  popularButton: {
    shadowColor: '#ffc107',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionsContainer: {
    marginBottom: 30,
  },
  optionCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionName: {
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 12,
  },
  optionPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#227897',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default SubscriptionScreen;