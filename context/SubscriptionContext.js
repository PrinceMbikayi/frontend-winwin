import React, { createContext, useContext, useState, useEffect } from 'react';

const SubscriptionContext = createContext();

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  const [currentPlan, setCurrentPlan] = useState('free');
  const [subscriptionData, setSubscriptionData] = useState({
    planId: 'free',
    planName: 'Gratuit',
    startDate: new Date(),
    endDate: null,
    isActive: true,
    autoRenew: false
  });

  // Définition des limites et fonctionnalités par plan
  const planFeatures = {
    free: {
      maxAds: 15,
      canExchange: false,
      canMessage: false,
      hasBoost: false,
      hasAdvancedStats: false,
      hasPremiumBadge: false,
      supportLevel: 'faq',
      visibilityBoost: false,
      sponsoredAds: 0
    },
    standard: {
      maxAds: 35,
      canExchange: true,
      canMessage: true,
      hasBoost: true,
      hasAdvancedStats: false,
      hasPremiumBadge: false,
      supportLevel: 'email',
      visibilityBoost: true,
      sponsoredAds: 0,
      boostDuration: 1 // 1 heure par jour
    },
    premium: {
      maxAds: -1, // illimité
      canExchange: true,
      canMessage: true,
      hasBoost: true,
      hasAdvancedStats: true,
      hasPremiumBadge: true,
      supportLevel: 'chat',
      visibilityBoost: true,
      sponsoredAds: 0,
      autoBoost: true,
      boostInterval: 12 // toutes les 12 heures
    },
    business: {
      maxAds: -1, // illimité
      canExchange: true,
      canMessage: true,
      hasBoost: true,
      hasAdvancedStats: true,
      hasPremiumBadge: true,
      supportLevel: 'dedicated',
      visibilityBoost: true,
      sponsoredAds: 5,
      customPage: true,
      csvExport: true,
      promotions: true,
      integrations: ['whatsapp', 'telegram'],
      businessBadge: true
    }
  };

  // Fonction pour vérifier si une fonctionnalité est disponible
  const hasFeature = (feature) => {
    const features = planFeatures[currentPlan];
    return features && features[feature];
  };

  // Fonction pour obtenir la limite d'une fonctionnalité
  const getFeatureLimit = (feature) => {
    const features = planFeatures[currentPlan];
    return features ? features[feature] : 0;
  };

  // Fonction pour vérifier si l'utilisateur peut effectuer une action
  const canPerformAction = (action, currentCount = 0) => {
    const features = planFeatures[currentPlan];
    if (!features) return false;

    switch (action) {
      case 'create_ad':
        return features.maxAds === -1 || currentCount < features.maxAds;
      case 'exchange':
        return features.canExchange;
      case 'message':
        return features.canMessage;
      case 'boost_ad':
        return features.hasBoost;
      case 'view_advanced_stats':
        return features.hasAdvancedStats;
      default:
        return false;
    }
  };

  // Fonction pour changer de plan
  const upgradePlan = (newPlanId, paymentData = null) => {
    setCurrentPlan(newPlanId);
    setSubscriptionData({
      planId: newPlanId,
      planName: getPlanName(newPlanId),
      startDate: new Date(),
      endDate: newPlanId !== 'free' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null, // 30 jours
      isActive: true,
      autoRenew: newPlanId !== 'free',
      paymentData
    });
  };

  // Fonction pour annuler l'abonnement
  const cancelSubscription = () => {
    setSubscriptionData(prev => ({
      ...prev,
      autoRenew: false
    }));
  };

  // Fonction pour obtenir le nom du plan
  const getPlanName = (planId) => {
    const planNames = {
      free: 'Gratuit',
      standard: 'Standard',
      premium: 'Premium',
      business: 'Business'
    };
    return planNames[planId] || 'Inconnu';
  };

  // Fonction pour obtenir les fonctionnalités du plan actuel
  const getCurrentPlanFeatures = () => {
    return planFeatures[currentPlan] || planFeatures.free;
  };

  // Fonction pour vérifier si l'abonnement est expiré
  const isSubscriptionExpired = () => {
    if (!subscriptionData.endDate) return false;
    return new Date() > new Date(subscriptionData.endDate);
  };

  // Fonction pour obtenir les jours restants
  const getDaysRemaining = () => {
    if (!subscriptionData.endDate) return null;
    const now = new Date();
    const endDate = new Date(subscriptionData.endDate);
    const diffTime = endDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Effet pour vérifier l'expiration de l'abonnement
  useEffect(() => {
    if (isSubscriptionExpired() && currentPlan !== 'free') {
      // Rétrograder vers le plan gratuit si l'abonnement a expiré
      setCurrentPlan('free');
      setSubscriptionData({
        planId: 'free',
        planName: 'Gratuit',
        startDate: new Date(),
        endDate: null,
        isActive: true,
        autoRenew: false
      });
    }
  }, [currentPlan, subscriptionData.endDate]);

  const value = {
    currentPlan,
    subscriptionData,
    planFeatures,
    hasFeature,
    getFeatureLimit,
    canPerformAction,
    upgradePlan,
    cancelSubscription,
    getPlanName,
    getCurrentPlanFeatures,
    isSubscriptionExpired,
    getDaysRemaining
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionContext;