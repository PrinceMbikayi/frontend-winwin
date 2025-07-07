import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Image,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const EditProfileScreen = ({ navigation }) => {
  const [profileData, setProfileData] = useState({
    name: 'Mehdi Mehdi',
    email: 'mehdi.mehdi@winwin.com',
    phone: '+33 6 12 34 56 78',
    bio: 'Passionné de troc et d\'échanges durables. J\'aime donner une seconde vie aux objets.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    isProfessional: false,
    location: 'Paris, France',
    website: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!profileData.name.trim()) {
      Alert.alert('Erreur', 'Le nom est obligatoire');
      return;
    }

    if (!profileData.email.trim()) {
      Alert.alert('Erreur', 'L\'email est obligatoire');
      return;
    }

    setIsLoading(true);
    
    // Simulation d'une sauvegarde
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Succès',
        'Votre profil a été mis à jour avec succès !',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }, 1000);
  };

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission requise',
        'Nous avons besoin de votre permission pour accéder à vos photos.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileData({ ...profileData, avatar: result.assets[0].uri });
    }
  };

  const updateField = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modifier le profil</Text>
        <TouchableOpacity
          onPress={handleSave}
          style={styles.saveButton}
          disabled={isLoading}
        >
          <Text style={[styles.saveText, isLoading && styles.saveTextDisabled]}>
            {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Photo de profil */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={handleImagePicker} style={styles.avatarContainer}>
            <Image source={{ uri: profileData.avatar }} style={styles.avatar} />
            <View style={styles.avatarOverlay}>
              <Ionicons name="camera" size={24} color="white" />
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarText}>Toucher pour changer la photo</Text>
        </View>

        {/* Informations personnelles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom complet *</Text>
            <TextInput
              style={styles.input}
              value={profileData.name}
              onChangeText={(value) => updateField('name', value)}
              placeholder="Votre nom complet"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              value={profileData.email}
              onChangeText={(value) => updateField('email', value)}
              placeholder="votre.email@exemple.com"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Téléphone</Text>
            <TextInput
              style={styles.input}
              value={profileData.phone}
              onChangeText={(value) => updateField('phone', value)}
              placeholder="+33 6 12 34 56 78"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Localisation</Text>
            <TextInput
              style={styles.input}
              value={profileData.location}
              onChangeText={(value) => updateField('location', value)}
              placeholder="Votre ville, pays"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Biographie */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>À propos de vous</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Biographie</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={profileData.bio}
              onChangeText={(value) => updateField('bio', value)}
              placeholder="Parlez-nous de vous, vos centres d'intérêt, ce que vous aimez échanger..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Site web (optionnel)</Text>
            <TextInput
              style={styles.input}
              value={profileData.website}
              onChangeText={(value) => updateField('website', value)}
              placeholder="https://votre-site.com"
              placeholderTextColor="#999"
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Type de compte */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Type de compte</Text>
          
          <View style={styles.switchContainer}>
            <View style={styles.switchInfo}>
              <Text style={styles.switchTitle}>Compte professionnel</Text>
              <Text style={styles.switchSubtitle}>
                Activez si vous êtes un professionnel ou une entreprise
              </Text>
            </View>
            <Switch
              value={profileData.isProfessional}
              onValueChange={(value) => updateField('isProfessional', value)}
              trackColor={{ false: '#ccc', true: '#227897' }}
              thumbColor={profileData.isProfessional ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.bottomPadding} />
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveText: {
    color: '#227897',
    fontSize: 16,
    fontWeight: '600',
  },
  saveTextDisabled: {
    color: '#999',
  },
  content: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
  },
  avatarOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#227897',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  avatarText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },
  section: {
    backgroundColor: 'white',
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
    color: '#333',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchInfo: {
    flex: 1,
    marginRight: 16,
  },
  switchTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  switchSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  bottomPadding: {
    height: 50,
  },
});

export default EditProfileScreen;