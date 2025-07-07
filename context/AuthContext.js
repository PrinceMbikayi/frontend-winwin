import React, { createContext, useContext, useState, useEffect } from "react";

// Contexte pour la gestion de l'authentification
const AuthContext = createContext();

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Provider pour le contexte d'authentification
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fonction de connexion
  const login = async (email, password) => {
    try {
      setIsLoading(true);

      // Simulation d'une API de connexion
      // Dans une vraie application, vous feriez un appel API ici
      if (email && password) {
        const userData = {
          id: "1",
          name: "Mehdi Mehdi",
          email: email,
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
          isProfessional: false,
          memberSince: "Janvier 2024",
          totalExchanges: 12,
          rating: 4.8,
        };

        setUser(userData);
        setIsAuthenticated(true);
        return { success: true, user: userData };
      } else {
        throw new Error("Email et mot de passe requis");
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction d'inscription
  const signup = async (userData) => {
    try {
      setIsLoading(true);

      // Simulation d'une API d'inscription
      if (userData.email && userData.password && userData.name) {
        const newUser = {
          id: Date.now().toString(),
          name: userData.name,
          email: userData.email,
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
          isProfessional: false,
          memberSince: new Date().toLocaleDateString("fr-FR", {
            month: "long",
            year: "numeric",
          }),
          totalExchanges: 0,
          rating: 5.0,
        };

        setUser(newUser);
        setIsAuthenticated(true);
        return { success: true, user: newUser };
      } else {
        throw new Error("Tous les champs sont requis");
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  // Fonction pour mettre à jour le profil utilisateur
  const updateProfile = (updatedData) => {
    if (user) {
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    }
    return { success: false, error: "Utilisateur non connecté" };
  };

  // Vérification de l'authentification au chargement
  useEffect(() => {
    // Ici vous pourriez vérifier un token stocké localement
    // Pour cette démo, on simule juste un délai de chargement
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
