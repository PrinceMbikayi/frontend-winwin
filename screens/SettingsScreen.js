import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Switch,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useExchange } from "../context/ExchangeContext";

const SettingsScreen = ({ navigation }) => {
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "Mehdi Mehdi",
    email: "mehdi.mehdi@winwin.com",
    phone: "+33 6 12 34 56 78",
    bio: "Passionnée de troc et d'échanges durables",
  });
  const [editedProfile, setEditedProfile] = useState({ ...userProfile });
  const { getUserStats } = useExchange();

  const userStats = getUserStats();

  const handleGeolocationToggle = (value) => {
    setGeolocationEnabled(value);
    if (value) {
      Alert.alert(
        "Géolocalisation activée",
        "Vous recevrez des suggestions d'échanges basées sur votre position."
      );
    } else {
      Alert.alert(
        "Géolocalisation désactivée",
        "Les suggestions ne seront plus basées sur votre position."
      );
    }
  };

  const handleSaveProfile = () => {
    setUserProfile({ ...editedProfile });
    setShowEditProfile(false);
    Alert.alert("Succès", "Votre profil a été mis à jour.");
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            // Ici, on implémenterait la suppression du compte
            Alert.alert(
              "Compte supprimé",
              "Votre compte a été supprimé avec succès."
            );
            navigation.navigate("Onboarding");
          },
        },
      ]
    );
  };

  const handleViewTransactionHistory = () => {
    navigation.navigate("TransactionHistory");
  };

  const handleManageSubscriptions = () => {
    Alert.alert(
      "Abonnements",
      "Fonctionnalité en cours de développement. Vous pourrez bientôt gérer vos abonnements premium."
    );
  };

  const SettingItem = ({
    icon,
    title,
    subtitle,
    onPress,
    rightComponent,
    showArrow = true,
  }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={24} color="#007AFF" />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightComponent}
        {showArrow && !rightComponent && (
          <Ionicons name="chevron-forward" size={20} color="#666" />
        )}
      </View>
    </TouchableOpacity>
  );

  const EditProfileModal = () => (
    <Modal
      visible={showEditProfile}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowEditProfile(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Modifier le profil</Text>
            <TouchableOpacity onPress={() => setShowEditProfile(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nom complet</Text>
              <TextInput
                style={styles.input}
                value={editedProfile.name}
                onChangeText={(text) =>
                  setEditedProfile({ ...editedProfile, name: text })
                }
                placeholder="Votre nom complet"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={editedProfile.email}
                onChangeText={(text) =>
                  setEditedProfile({ ...editedProfile, email: text })
                }
                placeholder="Votre email"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Téléphone</Text>
              <TextInput
                style={styles.input}
                value={editedProfile.phone}
                onChangeText={(text) =>
                  setEditedProfile({ ...editedProfile, phone: text })
                }
                placeholder="Votre numéro de téléphone"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Bio</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editedProfile.bio}
                onChangeText={(text) =>
                  setEditedProfile({ ...editedProfile, bio: text })
                }
                placeholder="Parlez-nous de vous..."
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setEditedProfile({ ...userProfile });
                setShowEditProfile(false);
              }}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveProfile}
            >
              <Text style={styles.saveButtonText}>Enregistrer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paramètres</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Section Profil */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profil</Text>
          <SettingItem
            icon="person-outline"
            title="Modifier profil"
            subtitle={`${userProfile.name} • ${userProfile.email}`}
            onPress={() => setShowEditProfile(true)}
          />
        </View>

        {/* Section Préférences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Préférences</Text>
          <SettingItem
            icon="location-outline"
            title="Géolocalisation"
            subtitle={geolocationEnabled ? "Activée" : "Désactivée"}
            rightComponent={
              <Switch
                value={geolocationEnabled}
                onValueChange={handleGeolocationToggle}
                trackColor={{ false: "#ccc", true: "#007AFF" }}
                thumbColor={geolocationEnabled ? "#fff" : "#f4f3f4"}
              />
            }
            showArrow={false}
          />
        </View>

        {/* Section Historique */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Historique</Text>
          <SettingItem
            icon="time-outline"
            title="Historique des transactions"
            subtitle={`${userStats.completedExchanges} échanges réalisés`}
            onPress={handleViewTransactionHistory}
          />
        </View>

        {/* Section Abonnements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Abonnements</Text>
          <SettingItem
            icon="card-outline"
            title="Gérer abonnements"
            subtitle="Premium, notifications..."
            onPress={handleManageSubscriptions}
          />
        </View>

        {/* Section Compte */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compte</Text>
          <SettingItem
            icon="trash-outline"
            title="Supprimer mon compte"
            subtitle="Action irréversible"
            onPress={handleDeleteAccount}
          />
        </View>

        {/* Statistiques rapides */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Vos statistiques</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userStats.totalExchanges}</Text>
              <Text style={styles.statLabel}>Échanges totaux</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {userStats.completedExchanges}
              </Text>
              <Text style={styles.statLabel}>Réalisés</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {userStats.successRate.toFixed(0)}%
              </Text>
              <Text style={styles.statLabel}>Taux de réussite</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <EditProfileModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: "white",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f8ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  statsSection: {
    backgroundColor: "white",
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    width: "100%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  modalContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f8f9fa",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 10,
  },
  cancelButtonText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
  },
  saveButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#007AFF",
    marginLeft: 10,
  },
  saveButtonText: {
    textAlign: "center",
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
});

export default SettingsScreen;
