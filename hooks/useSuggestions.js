import { useContext, useMemo, useCallback } from 'react';
import { ExchangeContext } from '../context/ExchangeContext';
import { DEFAULT_CONFIG } from '../utils/constants';

/**
 * Hook personnalisé pour gérer la logique des suggestions
 * @param {number} maxItems - Nombre maximum de suggestions à retourner
 * @returns {Object} Objet contenant les suggestions et les fonctions utilitaires
 */
export const useSuggestions = (maxItems = DEFAULT_CONFIG.MAX_SUGGESTIONS) => {
  const { 
    suggestions, 
    loading, 
    error, 
    generateSmartSuggestions,
    markSuggestionAsViewed 
  } = useContext(ExchangeContext);

  // Validation des suggestions
  const validateSuggestion = useCallback((suggestion) => {
    return suggestion && 
           suggestion.product && 
           suggestion.score !== undefined &&
           suggestion.type &&
           suggestion.id;
  }, []);

  // Mémorisation des suggestions filtrées et triées
  const topSuggestions = useMemo(() => {
    if (!suggestions || !Array.isArray(suggestions)) {
      return [];
    }

    return suggestions
      .filter(validateSuggestion)
      .filter(s => !s.viewed)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxItems);
  }, [suggestions, maxItems, validateSuggestion]);

  // Statistiques des suggestions
  const stats = useMemo(() => {
    const total = suggestions?.length || 0;
    const unviewed = suggestions?.filter(s => !s.viewed).length || 0;
    const viewed = total - unviewed;
    
    return {
      total,
      viewed,
      unviewed,
      hasMore: unviewed > maxItems
    };
  }, [suggestions, maxItems]);

  // Fonction pour marquer une suggestion comme vue
  const handleSuggestionViewed = useCallback((suggestionId) => {
    if (markSuggestionAsViewed) {
      markSuggestionAsViewed(suggestionId);
    }
  }, [markSuggestionAsViewed]);

  // Fonction pour générer de nouvelles suggestions
  const handleGenerateNew = useCallback(() => {
    if (generateSmartSuggestions) {
      generateSmartSuggestions();
    }
  }, [generateSmartSuggestions]);

  return {
    suggestions: topSuggestions,
    loading,
    error,
    stats,
    handleSuggestionViewed,
    handleGenerateNew,
    isEmpty: topSuggestions.length === 0,
    hasData: suggestions && suggestions.length > 0
  };
};

export default useSuggestions;