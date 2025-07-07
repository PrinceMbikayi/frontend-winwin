# WinWin Frontend - Application Mobile

Application mobile React Native pour la plateforme d'échange et de troc WinWin en France.

## 🚀 Installation

1. Installez les dépendances :
```bash
npm install
```

2. Démarrez l'application :
```bash
npm start
```

## 📱 Écrans disponibles

### 1. Onboarding (Écran d'accueil)
- Présentation de l'application avec 3 slides
- Navigation vers l'écran de connexion
- Images de fond avec texte superposé

### 2. Connexion (LoginScreen)
- Connexion par email/mot de passe
- Connexion sociale : Google, Facebook, Apple (iOS uniquement)
- Navigation vers l'inscription
- Redirection automatique vers l'accueil après connexion

### 3. Inscription (SignupScreen)
- Formulaire complet avec :
  - Nom complet
  - Email
  - Mot de passe et confirmation
  - Bio (optionnelle)
  - Upload d'avatar
  - Case "Je suis un professionnel"
- Connexion sociale disponible
- Validation des champs
- Redirection automatique vers l'accueil après inscription

### 4. Accueil (HomeScreen)
- Page d'accueil de l'application
- Présentation des types d'utilisateurs
- Fonctionnalités principales
- Boutons d'action
- Déconnexion possible

## 👥 Types d'utilisateurs

### Particuliers
Les plus nombreux. Ils utilisent la plateforme pour :
- Désencombrer
- Échanger des objets
- Trouver des objets utiles sans dépenser d'argent

### Professionnels (TPE/PME)
Ils utilisent la plateforme pour :
- Écouler des stocks invendus
- Échanger du matériel usagé mais fonctionnel
- Récupérer des équipements utiles sans trop investir

## 🔧 Fonctionnalités techniques

- **Navigation** : React Navigation avec Stack Navigator
- **Icônes** : Expo Vector Icons
- **Upload d'images** : Expo Image Picker
- **Authentification** : Simulation (pas de sécurité réelle)
- **Design** : Interface moderne avec thème bleu (#227897)

## 📋 Dépendances principales

- `@expo/vector-icons` : Icônes
- `@react-navigation/native` : Navigation
- `@react-navigation/stack` : Navigation en pile
- `expo-image-picker` : Sélection d'images
- `react-native-gesture-handler` : Gestion des gestes
- `react-native-safe-area-context` : Zones sécurisées
- `react-native-screens` : Optimisation des écrans

## 🎨 Design System

- **Couleur principale** : #227897 (bleu)
- **Couleur de fond** : #f8f9fa (gris clair)
- **Texte principal** : #333
- **Texte secondaire** : #666
- **Bordures arrondies** : 12px
- **Ombres** : Subtiles avec elevation

## 🔄 Navigation

```
Onboarding → Login ⟷ Signup → Home
                              ↓
                         (Déconnexion)
                              ↓
                          Onboarding
```

## ⚠️ Notes importantes

- L'authentification est simulée (pas de sécurité réelle)
- Les connexions sociales sont simulées
- L'upload d'avatar utilise la galerie locale
- L'application est optimisée pour iOS et Android
- Toutes les redirections mènent directement à l'écran Home

## 🚀 Prochaines étapes

1. Intégrer une vraie authentification
2. Ajouter la géolocalisation
3. Créer les écrans de gestion des annonces
4. Implémenter la messagerie
5. Ajouter les notifications push