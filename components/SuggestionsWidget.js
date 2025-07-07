import React, { useCallback, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import ExchangeContext from '../context/ExchangeContext';
import SuggestionCard from './SuggestionCard';
import useSuggestions from '../hooks/useSuggestions';
import { COLORS, SPACING, FONT_SIZES, DEFAULT_CONFIG } from '../utils/constants';

const SuggestionsWidget = (props) => {
  const { navigation, maxItems = 3 } = props;
  const context = useContext(ExchangeContext);
  
  // Vérifier si le contexte est disponible
  if (!context) {
    console.warn('ExchangeContext is not available. Make sure the component is wrapped in ExchangeProvider.');
    return null;
  }
  
  const { suggestions = [], generateSmartSuggestions } = context;

  // Prendre seulement les meilleures suggestions non vues
  const topSuggestions = suggestions
    .filter(suggestion => !suggestion.viewed)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxItems);

  const handleSuggestionPress = (suggestion) => {
    navigation.navigate('ProductDetail', { product: suggestion.product });
  };

  const handleGenerateSuggestions = useCallback(() => {
    generateSmartSuggestions();
  }, [generateSmartSuggestions]);

  if (!suggestions || suggestions.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Suggestions pour vous</Text>
          <TouchableOpacity 
            style={styles.generateButton}
            onPress={handleGenerateSuggestions}
          >
            <Ionicons name="refresh" size={20} color={COLORS.primary} />
            <Text style={styles.generateButtonText}>Générer</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="help-outline" size={48} color={COLORS.gray} />
          <Text style={styles.emptyText}>Aucune suggestion disponible</Text>
          <Text style={styles.emptySubtext}>Appuyez sur "Générer" pour créer des suggestions</Text>
        </View>
      </View>
    );
  }

  if (topSuggestions.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Suggestions pour vous</Text>
          <TouchableOpacity 
            style={styles.generateButton}
            onPress={handleGenerateSuggestions}
          >
            <Ionicons name="refresh" size={20} color={COLORS.primary} />
            <Text style={styles.generateButtonText}>Générer</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="checkmark-circle" size={48} color={COLORS.success} />
          <Text style={styles.emptyText}>Toutes les suggestions ont été vues!</Text>
          <Text style={styles.emptySubtext}>Générez de nouvelles suggestions</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Suggestions pour vous</Text>
        <View style={styles.headerRight}>
          {suggestions.filter(s => !s.viewed).length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {suggestions.filter(s => !s.viewed).length}
              </Text>
            </View>
          )}
          <TouchableOpacity 
            style={styles.generateButton}
            onPress={handleGenerateSuggestions}
          >
            <Ionicons name="refresh" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {topSuggestions.map((suggestion, index) => (
          <SuggestionCard
            key={suggestion.id || index}
            suggestion={suggestion}
            onPress={() => handleSuggestionPress(suggestion)}
            style={index === topSuggestions.length - 1 ? styles.lastCard : null}
          />
        ))}
      </ScrollView>
    </View>
  );
};

SuggestionsWidget.propTypes = {
  navigation: PropTypes.object.isRequired,
  maxItems: PropTypes.number,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  badge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
  },
  generateButtonText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    marginLeft: SPACING.xs,
  },
  scrollContainer: {
    paddingRight: SPACING.md,
  },
  lastCard: {
    marginRight: 0,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: COLORS.text,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
});

export default SuggestionsWidget;