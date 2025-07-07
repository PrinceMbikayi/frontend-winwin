import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  FlatList,
  Image,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Données simulées pour les lives
const mockLiveStreams = [
  {
    id: "1",
    title: "Brocante du dimanche - Antiquités",
    streamerName: "Marie Antiquités",
    streamerAvatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face",
    thumbnail:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
    viewerCount: 234,
    isLive: true,
    category: "Antiquités",
    duration: "1h 23min",
  },
  {
    id: "2",
    title: "Électronique et High-Tech",
    streamerName: "TechExchange",
    streamerAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    thumbnail:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=250&fit=crop",
    viewerCount: 89,
    isLive: true,
    category: "Électronique",
    duration: "45min",
  },
  {
    id: "3",
    title: "Vêtements et Mode Vintage",
    streamerName: "VintageStyle",
    streamerAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
    thumbnail:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=250&fit=crop",
    viewerCount: 156,
    isLive: false,
    category: "Mode",
    scheduledTime: "Demain 14h00",
  },
];

const categories = [
  { id: "all", name: "Tous", icon: "grid-outline" },
  { id: "antiques", name: "Antiquités", icon: "library-outline" },
  { id: "electronics", name: "Électronique", icon: "phone-portrait-outline" },
  { id: "fashion", name: "Mode", icon: "shirt-outline" },
  { id: "books", name: "Livres", icon: "book-outline" },
  { id: "sports", name: "Sport", icon: "basketball-outline" },
  { id: "home", name: "Maison", icon: "home-outline" },
];

const LiveScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [subscribedCategories, setSubscribedCategories] = useState([
    "electronics",
    "fashion",
  ]);

  const handleJoinLive = (liveId) => {
    Alert.alert(
      "Rejoindre le live",
      "Vous allez rejoindre cette session en direct.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Rejoindre",
          onPress: () => console.log("Joining live:", liveId),
        },
      ]
    );
  };

  const handleScheduleLive = () => {
    setShowScheduleModal(true);
  };

  const toggleSubscription = (categoryId) => {
    if (subscribedCategories.includes(categoryId)) {
      setSubscribedCategories(
        subscribedCategories.filter((id) => id !== categoryId)
      );
    } else {
      setSubscribedCategories([...subscribedCategories, categoryId]);
    }
  };

  const renderLiveItem = ({ item }) => (
    <TouchableOpacity
      style={styles.liveItem}
      onPress={() => (item.isLive ? handleJoinLive(item.id) : null)}
    >
      <View style={styles.thumbnailContainer}>
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        {item.isLive ? (
          <View style={styles.liveBadge}>
            <View style={styles.liveIndicator} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        ) : (
          <View style={styles.scheduledBadge}>
            <Ionicons name="time-outline" size={12} color="#fff" />
            <Text style={styles.scheduledText}>Programmé</Text>
          </View>
        )}
        <View style={styles.viewerCount}>
          <Ionicons name="eye-outline" size={12} color="#fff" />
          <Text style={styles.viewerText}>
            {item.isLive ? item.viewerCount : item.scheduledTime}
          </Text>
        </View>
        {item.isLive && (
          <View style={styles.duration}>
            <Text style={styles.durationText}>{item.duration}</Text>
          </View>
        )}
      </View>

      <View style={styles.liveInfo}>
        <View style={styles.streamerInfo}>
          <Image
            source={{ uri: item.streamerAvatar }}
            style={styles.streamerAvatar}
          />
          <View style={styles.liveDetails}>
            <Text style={styles.liveTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.streamerName}>{item.streamerName}</Text>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.actionButton,
            item.isLive ? styles.joinButton : styles.notifyButton,
          ]}
          onPress={() =>
            item.isLive
              ? handleJoinLive(item.id)
              : console.log("Set notification")
          }
        >
          <Ionicons
            name={item.isLive ? "play" : "notifications-outline"}
            size={16}
            color="#fff"
          />
          <Text style={styles.actionButtonText}>
            {item.isLive ? "Participer" : "Me notifier"}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.categoryItemSelected,
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Ionicons
        name={item.icon}
        size={20}
        color={selectedCategory === item.id ? "#fff" : "#227897"}
      />
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item.id && styles.categoryTextSelected,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderSubscriptionItem = ({ item }) => {
    if (item.id === "all") return null;

    const isSubscribed = subscribedCategories.includes(item.id);

    return (
      <TouchableOpacity
        style={styles.subscriptionItem}
        onPress={() => toggleSubscription(item.id)}
      >
        <View style={styles.subscriptionLeft}>
          <Ionicons name={item.icon} size={24} color="#227897" />
          <Text style={styles.subscriptionName}>{item.name}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.subscribeButton,
            isSubscribed && styles.subscribedButton,
          ]}
          onPress={() => toggleSubscription(item.id)}
        >
          <Text
            style={[
              styles.subscribeText,
              isSubscribed && styles.subscribedText,
            ]}
          >
            {isSubscribed ? "Abonné" : "S'abonner"}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Espace Live</Text>
        <TouchableOpacity
          style={styles.scheduleButton}
          onPress={handleScheduleLive}
        >
          <Ionicons name="add-circle-outline" size={24} color="#227897" />
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.content}
        data={[
          { type: "categories", data: categories },
          {
            type: "livesActive",
            data: mockLiveStreams.filter((item) => item.isLive),
          },
          {
            type: "livesScheduled",
            data: mockLiveStreams.filter((item) => !item.isLive),
          },
          { type: "subscriptions", data: categories },
        ]}
        renderItem={({ item }) => {
          switch (item.type) {
            case "categories":
              return (
                <View style={styles.categoriesSection}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesList}
                  >
                    {item.data.map((cat) => (
                      <View key={cat.id}>
                        {renderCategoryItem({ item: cat })}
                      </View>
                    ))}
                  </ScrollView>
                </View>
              );
            case "livesActive":
              return (
                <View style={styles.livesSection}>
                  <Text style={styles.sectionTitle}>Lives en cours</Text>
                  {item.data.map((liveItem) => (
                    <View key={liveItem.id}>
                      {renderLiveItem({ item: liveItem })}
                    </View>
                  ))}
                </View>
              );
            case "livesScheduled":
              return (
                <View style={styles.livesSection}>
                  <Text style={styles.sectionTitle}>Lives programmés</Text>
                  {item.data.map((liveItem) => (
                    <View key={liveItem.id}>
                      {renderLiveItem({ item: liveItem })}
                    </View>
                  ))}
                </View>
              );
            case "subscriptions":
              return (
                <View style={styles.subscriptionsSection}>
                  <Text style={styles.sectionTitle}>
                    Abonnements par centre d'intérêt
                  </Text>
                  {item.data.map((subItem) => (
                    <View key={subItem.id}>
                      {renderSubscriptionItem({ item: subItem })}
                    </View>
                  ))}
                </View>
              );
            default:
              return null;
          }
        }}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Bouton flottant pour programmer un live */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleScheduleLive}
      >
        <Ionicons name="videocam" size={24} color="#fff" />
        <Text style={styles.floatingButtonText}>Programmer un live</Text>
      </TouchableOpacity>

      {/* Modal pour programmer un live */}
      <Modal
        visible={showScheduleModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Programmer un live</Text>
            <TouchableOpacity onPress={() => setShowScheduleModal(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalText}>
              Fonctionnalité en cours de développement. Vous pourrez bientôt
              programmer vos propres lives de brocante !
            </Text>

            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Ionicons name="calendar-outline" size={20} color="#227897" />
                <Text style={styles.featureText}>Planifier date et heure</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="pricetag-outline" size={20} color="#227897" />
                <Text style={styles.featureText}>Choisir la catégorie</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="camera-outline" size={20} color="#227897" />
                <Text style={styles.featureText}>Diffusion en direct</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="chatbubble-outline" size={20} color="#227897" />
                <Text style={styles.featureText}>Chat en temps réel</Text>
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity
            style={styles.closeModalButton}
            onPress={() => setShowScheduleModal(false)}
          >
            <Text style={styles.closeModalText}>Fermer</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  scheduleButton: {
    padding: 5,
    borderRadius: 8,
  },
  content: {
    flex: 1,
  },
  categoriesSection: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    marginBottom: 10,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#227897",
    marginRight: 10,
  },
  categoryItemSelected: {
    backgroundColor: "#227897",
  },
  categoryText: {
    fontSize: 14,
    color: "#227897",
    marginLeft: 5,
  },
  categoryTextSelected: {
    color: "#fff",
  },
  livesSection: {
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  liveItem: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  thumbnailContainer: {
    position: "relative",
    marginBottom: 10,
  },
  thumbnail: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
  },
  liveBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff4757",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#fff",
    marginRight: 4,
  },
  liveText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  scheduledBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scheduledText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },
  viewerCount: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  viewerText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },
  duration: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  durationText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  liveInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  streamerInfo: {
    flexDirection: "row",
    flex: 1,
    marginRight: 10,
  },
  streamerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#f0f0f0",
  },
  liveDetails: {
    flex: 1,
  },
  liveTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  streamerName: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  categoryTag: {
    backgroundColor: "#f0f0ff",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinButton: {
    backgroundColor: "#4CAF50",
  },
  notifyButton: {
    backgroundColor: "#227897",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },
  subscriptionsSection: {
    backgroundColor: "#fff",
    marginBottom: 100,
  },
  subscriptionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  subscriptionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  subscriptionName: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },
  subscribeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "",
  },
  subscribedButton: {
    backgroundColor: "#227897",
  },
  subscribeText: {
    fontSize: 14,
    color: "#227897",
    fontWeight: "bold",
  },
  subscribedText: {
    color: "#fff",
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#227897",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  floatingButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 8,
  },
  // Styles pour la modal
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  modalText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 30,
    textAlign: "center",
  },
  featuresList: {
    gap: 15,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  featureText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
  },
  closeModalButton: {
    backgroundColor: "#227897",
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  closeModalText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LiveScreen;
