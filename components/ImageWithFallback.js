import React, { useState } from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constants';

/**
 * Composant Image avec gestion automatique du fallback
 * @param {Object} props - Propriétés du composant
 * @param {Object|number} props.source - Source de l'image
 * @param {Object} props.style - Styles personnalisés
 * @param {string} props.fallbackIcon - Icône à afficher en cas d'erreur
 * @param {number} props.fallbackIconSize - Taille de l'icône de fallback
 * @param {string} props.fallbackIconColor - Couleur de l'icône de fallback
 * @param {Function} props.onError - Callback en cas d'erreur
 * @param {Function} props.onLoad - Callback quand l'image se charge
 * @returns {JSX.Element} Composant ImageWithFallback
 */
const ImageWithFallback = ({ 
  source, 
  style, 
  fallbackIcon = 'image-outline',
  fallbackIconSize = 24,
  fallbackIconColor = COLORS.GRAY,
  onError,
  onLoad,
  ...props 
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = (error) => {
    setImageError(true);
    setIsLoading(false);
    if (onError) {
      onError(error);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
    if (onLoad) {
      onLoad();
    }
  };

  // Si l'image a échoué ou si la source n'est pas valide
  if (imageError || !source || (typeof source === 'object' && !source.uri)) {
    return (
      <View style={[styles.fallbackContainer, style]}>
        <Ionicons 
          name={fallbackIcon} 
          size={fallbackIconSize} 
          color={fallbackIconColor} 
        />
      </View>
    );
  }

  return (
    <View style={style}>
      <Image
        source={source}
        style={[StyleSheet.absoluteFillObject, { borderRadius: style?.borderRadius || 0 }]}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
      {isLoading && (
        <View style={[styles.loadingContainer, style]}>
          <Ionicons 
            name="hourglass-outline" 
            size={fallbackIconSize} 
            color={fallbackIconColor} 
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fallbackContainer: {
    backgroundColor: COLORS.LIGHT_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.LIGHT_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
});

export default ImageWithFallback;