import React, { createContext, useContext, useState, useEffect } from 'react';

// Contexte pour la gestion des échanges
const ExchangeContext = createContext();

// Hook personnalisé pour utiliser le contexte d'échange
export const useExchange = () => {
  const context = useContext(ExchangeContext);
  if (!context) {
    throw new Error('useExchange must be used within an ExchangeProvider');
  }
  return context;
};

// Provider pour le contexte d'échange
export const ExchangeProvider = ({ children }) => {
  const [exchanges, setExchanges] = useState([]);
  const [userItems, setUserItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [userPreferences, setUserPreferences] = useState({
    categories: [],
    priceRange: { min: 0, max: 1000 },
    location: null,
    interests: []
  });
  const [suggestions, setSuggestions] = useState([]);
  const [userRatings, setUserRatings] = useState([]);
  const [userBadges, setUserBadges] = useState([]);

  // Fonction pour créer un nouvel échange
  const createExchange = (itemData) => {
    const newExchange = {
      id: Date.now().toString(),
      ...itemData,
      createdAt: new Date().toISOString(),
      status: 'active', // active, pending, completed, cancelled
      views: 0,
      interested: []
    };
    
    setExchanges(prevExchanges => [...prevExchanges, newExchange]);
    setUserItems(prevItems => [...prevItems, newExchange]);
    
    return newExchange;
  };

  // Fonction pour mettre à jour un échange
  const updateExchange = (exchangeId, updatedData) => {
    setExchanges(prevExchanges => 
      prevExchanges.map(exchange => 
        exchange.id === exchangeId 
          ? { ...exchange, ...updatedData }
          : exchange
      )
    );
    
    setUserItems(prevItems => 
      prevItems.map(item => 
        item.id === exchangeId 
          ? { ...item, ...updatedData }
          : item
      )
    );
  };

  // Fonction pour supprimer un échange
  const deleteExchange = (exchangeId) => {
    setExchanges(prevExchanges => 
      prevExchanges.filter(exchange => exchange.id !== exchangeId)
    );
    
    setUserItems(prevItems => 
      prevItems.filter(item => item.id !== exchangeId)
    );
  };

  // Fonction pour ajouter aux favoris
  const addToFavorites = (itemId) => {
    if (!favorites.includes(itemId)) {
      setFavorites(prevFavorites => [...prevFavorites, itemId]);
    }
  };

  // Fonction pour retirer des favoris
  const removeFromFavorites = (itemId) => {
    setFavorites(prevFavorites => 
      prevFavorites.filter(id => id !== itemId)
    );
  };

  // Fonction pour vérifier si un item est en favoris
  const isFavorite = (itemId) => {
    return favorites.includes(itemId);
  };

  // Fonction pour marquer l'intérêt pour un échange
  const showInterest = (exchangeId, userId) => {
    setExchanges(prevExchanges => 
      prevExchanges.map(exchange => 
        exchange.id === exchangeId 
          ? { 
              ...exchange, 
              interested: [...(exchange.interested || []), userId],
              views: exchange.views + 1
            }
          : exchange
      )
    );
  };

  // Fonction pour rechercher des échanges
  const searchExchanges = (query, filters = {}) => {
    // Ajouter à l'historique de recherche
    if (query && !searchHistory.includes(query)) {
      setSearchHistory(prev => [query, ...prev.slice(0, 9)]); // Garder les 10 dernières recherches
    }

    return exchanges.filter(exchange => {
      const matchesQuery = !query || 
        exchange.title?.toLowerCase().includes(query.toLowerCase()) ||
        exchange.description?.toLowerCase().includes(query.toLowerCase()) ||
        exchange.category?.toLowerCase().includes(query.toLowerCase());

      const matchesCategory = !filters.category || exchange.category === filters.category;
      const matchesLocation = !filters.location || exchange.location === filters.location;
      const matchesStatus = !filters.status || exchange.status === filters.status;

      return matchesQuery && matchesCategory && matchesLocation && matchesStatus;
    });
  };

  // Fonction pour obtenir les échanges par catégorie
  const getExchangesByCategory = (category) => {
    return exchanges.filter(exchange => exchange.category === category);
  };

  // Fonction pour obtenir les statistiques utilisateur
  const getUserStats = () => {
    const totalExchanges = userItems.length;
    const completedExchanges = userItems.filter(item => item.status === 'completed').length;
    const activeExchanges = userItems.filter(item => item.status === 'active').length;
    const totalViews = userItems.reduce((sum, item) => sum + (item.views || 0), 0);
    
    return {
      totalExchanges,
      completedExchanges,
      activeExchanges,
      totalViews,
      successRate: totalExchanges > 0 ? (completedExchanges / totalExchanges) * 100 : 0
    };
  };

  // Fonction pour évaluer un utilisateur après un échange
  const rateUser = (exchangeId, ratedUserId, rating, comment = '') => {
    const newRating = {
      id: Date.now().toString(),
      exchangeId,
      ratedUserId,
      raterUserId: 'current_user', // À remplacer par l'ID de l'utilisateur connecté
      rating: Math.max(1, Math.min(5, rating)), // S'assurer que la note est entre 1 et 5
      comment,
      createdAt: new Date().toISOString()
    };
    
    setUserRatings(prevRatings => [...prevRatings, newRating]);
    
    // Mettre à jour les badges après l'évaluation
    updateUserBadges(ratedUserId);
    
    return newRating;
  };

  // Fonction pour obtenir les évaluations d'un utilisateur
  const getUserRatings = (userId) => {
    return userRatings.filter(rating => rating.ratedUserId === userId);
  };

  // Fonction pour calculer la note moyenne d'un utilisateur
  const getUserAverageRating = (userId) => {
    const ratings = getUserRatings(userId);
    if (ratings.length === 0) return 0;
    
    const sum = ratings.reduce((total, rating) => total + rating.rating, 0);
    return (sum / ratings.length).toFixed(1);
  };

  // Fonction pour mettre à jour les badges d'un utilisateur
  const updateUserBadges = (userId) => {
    const ratings = getUserRatings(userId);
    const userStats = getUserStats();
    const averageRating = parseFloat(getUserAverageRating(userId));
    
    const newBadges = [];
    
    // Badge "Fiable" - Note moyenne >= 4.5 et au moins 5 évaluations
    if (averageRating >= 4.5 && ratings.length >= 5) {
      newBadges.push({
        id: 'reliable',
        name: 'Fiable',
        description: 'Utilisateur de confiance avec d\'excellentes évaluations',
        icon: 'shield-checkmark',
        color: '#28a745',
        earnedAt: new Date().toISOString()
      });
    }
    
    // Badge "Réactif" - Répond rapidement (simulation basée sur le nombre d'échanges)
    if (userStats.completedExchanges >= 10) {
      newBadges.push({
        id: 'responsive',
        name: 'Réactif',
        description: 'Répond rapidement aux demandes d\'échange',
        icon: 'flash',
        color: '#ffc107',
        earnedAt: new Date().toISOString()
      });
    }
    
    // Badge "Super troqueur" - Beaucoup d'échanges réussis et bonne note
    if (userStats.completedExchanges >= 20 && averageRating >= 4.0) {
      newBadges.push({
        id: 'super_trader',
        name: 'Super troqueur',
        description: 'Expert en échanges avec de nombreuses transactions réussies',
        icon: 'trophy',
        color: '#fd7e14',
        earnedAt: new Date().toISOString()
      });
    }
    
    setUserBadges(prevBadges => {
      // Supprimer les anciens badges de cet utilisateur
      const otherUsersBadges = prevBadges.filter(badge => badge.userId !== userId);
      // Ajouter les nouveaux badges
      const userNewBadges = newBadges.map(badge => ({ ...badge, userId }));
      return [...otherUsersBadges, ...userNewBadges];
    });
  };

  // Fonction pour obtenir les badges d'un utilisateur
  const getUserBadges = (userId) => {
    return userBadges.filter(badge => badge.userId === userId);
  };

  // Fonction pour analyser les préférences utilisateur
  const analyzeUserPreferences = () => {
    const categoryCount = {};
    const interestKeywords = [];
    
    // Analyser les favoris
    const favoriteItems = exchanges.filter(item => favorites.includes(item.id));
    favoriteItems.forEach(item => {
      categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
      if (item.title) {
        interestKeywords.push(...item.title.toLowerCase().split(' '));
      }
    });
    
    // Analyser l'historique de recherche
    searchHistory.forEach(query => {
      interestKeywords.push(...query.toLowerCase().split(' '));
    });
    
    // Analyser les objets de l'utilisateur
    userItems.forEach(item => {
      categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
      if (item.title) {
        interestKeywords.push(...item.title.toLowerCase().split(' '));
      }
    });
    
    // Extraire les catégories préférées
    const preferredCategories = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);
    
    // Extraire les mots-clés d'intérêt les plus fréquents
    const keywordCount = {};
    interestKeywords.forEach(keyword => {
      if (keyword.length > 2) { // Ignorer les mots trop courts
        keywordCount[keyword] = (keywordCount[keyword] || 0) + 1;
      }
    });
    
    const topInterests = Object.entries(keywordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([keyword]) => keyword);
    
    setUserPreferences(prev => ({
      ...prev,
      categories: preferredCategories,
      interests: topInterests
    }));
    
    return { preferredCategories, topInterests };
  };

  // Fonction pour générer des suggestions intelligentes
  const generateSmartSuggestions = () => {
    const { preferredCategories, topInterests } = analyzeUserPreferences();
    const suggestionsList = [];
    
    // 1. Suggestions basées sur les objets de l'utilisateur
    userItems.forEach(userItem => {
      const potentialMatches = exchanges.filter(exchange => {
        // Exclure les propres objets de l'utilisateur
        if (userItems.some(item => item.id === exchange.id)) return false;
        
        // Chercher des utilisateurs qui ont des objets similaires à ce que l'utilisateur possède
        const categoryMatch = exchange.category === userItem.category;
        const titleSimilarity = userItem.title && exchange.title && 
          exchange.title.toLowerCase().includes(userItem.title.toLowerCase().split(' ')[0]);
        
        return categoryMatch || titleSimilarity;
      });
      
      potentialMatches.forEach(match => {
        suggestionsList.push({
          id: `match_${userItem.id}_${match.id}`,
          type: 'object_match',
          userItem: userItem,
          suggestedItem: match,
          reason: `Vous avez un ${userItem.title}, cet utilisateur cherche un objet similaire`,
          score: 0.8,
          category: 'Échange potentiel'
        });
      });
    });
    
    // 2. Suggestions basées sur les catégories préférées
    preferredCategories.forEach(category => {
      const categoryItems = exchanges.filter(exchange => 
        exchange.category === category && 
        !userItems.some(item => item.id === exchange.id) &&
        !favorites.includes(exchange.id)
      ).slice(0, 3);
      
      categoryItems.forEach(item => {
        suggestionsList.push({
          id: `category_${item.id}`,
          type: 'category_preference',
          suggestedItem: item,
          reason: `Basé sur votre intérêt pour la catégorie ${category}`,
          score: 0.7,
          category: 'Recommandation'
        });
      });
    });
    
    // 3. Suggestions basées sur les recherches récentes
    searchHistory.slice(0, 3).forEach(query => {
      const searchMatches = exchanges.filter(exchange => {
        const matchesSearch = exchange.title?.toLowerCase().includes(query.toLowerCase()) ||
                            exchange.description?.toLowerCase().includes(query.toLowerCase());
        const notUserItem = !userItems.some(item => item.id === exchange.id);
        const notFavorite = !favorites.includes(exchange.id);
        
        return matchesSearch && notUserItem && notFavorite;
      }).slice(0, 2);
      
      searchMatches.forEach(item => {
        suggestionsList.push({
          id: `search_${query}_${item.id}`,
          type: 'search_based',
          suggestedItem: item,
          reason: `Basé sur votre recherche récente: "${query}"`,
          score: 0.6,
          category: 'Recherche récente'
        });
      });
    });
    
    // 4. Suggestions basées sur les favoris similaires
    const favoriteItems = exchanges.filter(item => favorites.includes(item.id));
    favoriteItems.forEach(favoriteItem => {
      const similarItems = exchanges.filter(exchange => {
        const sameCategory = exchange.category === favoriteItem.category;
        const notUserItem = !userItems.some(item => item.id === exchange.id);
        const notFavorite = !favorites.includes(exchange.id);
        const notSameItem = exchange.id !== favoriteItem.id;
        
        return sameCategory && notUserItem && notFavorite && notSameItem;
      }).slice(0, 2);
      
      similarItems.forEach(item => {
        suggestionsList.push({
          id: `similar_${favoriteItem.id}_${item.id}`,
          type: 'similar_to_favorite',
          suggestedItem: item,
          reason: `Similaire à votre favori: ${favoriteItem.title}`,
          score: 0.75,
          category: 'Similaire aux favoris'
        });
      });
    });
    
    // Trier par score et supprimer les doublons
    const uniqueSuggestions = suggestionsList
      .filter((suggestion, index, self) => 
        index === self.findIndex(s => s.suggestedItem.id === suggestion.suggestedItem.id)
      )
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Limiter à 10 suggestions
    
    setSuggestions(uniqueSuggestions);
    return uniqueSuggestions;
  };

  // Fonction pour mettre à jour les préférences utilisateur
  const updateUserPreferences = (newPreferences) => {
    setUserPreferences(prev => ({ ...prev, ...newPreferences }));
  };

  // Fonction pour obtenir des suggestions par type
  const getSuggestionsByType = (type) => {
    return suggestions.filter(suggestion => suggestion.type === type);
  };

  // Fonction pour marquer une suggestion comme vue
  const markSuggestionAsViewed = (suggestionId) => {
    setSuggestions(prev => 
      prev.map(suggestion => 
        suggestion.id === suggestionId 
          ? { ...suggestion, viewed: true }
          : suggestion
      )
    );
  };

  // Effet pour régénérer les suggestions quand les données changent
  useEffect(() => {
    if (exchanges.length > 0 || userItems.length > 0 || favorites.length > 0) {
      generateSmartSuggestions();
    }
  }, [exchanges, userItems, favorites, searchHistory]);

  const value = {
    exchanges,
    setExchanges,
    userItems,
    setUserItems,
    favorites,
    searchHistory,
    userPreferences,
    suggestions,
    userRatings,
    userBadges,
    createExchange,
    updateExchange,
    deleteExchange,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    showInterest,
    searchExchanges,
    getExchangesByCategory,
    getUserStats,
    rateUser,
    getUserRatings,
    getUserAverageRating,
    updateUserBadges,
    getUserBadges,
    analyzeUserPreferences,
    generateSmartSuggestions,
    updateUserPreferences,
    getSuggestionsByType,
    markSuggestionAsViewed
  };

  return (
    <ExchangeContext.Provider value={value}>
      {children}
    </ExchangeContext.Provider>
  );
};

export default ExchangeContext;