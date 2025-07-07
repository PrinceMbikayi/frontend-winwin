import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  FlatList,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSubscription } from "../context/SubscriptionContext";
import { FeatureRestriction } from "../components/SubscriptionBanner";

// Données simulées pour les conversations
const mockConversations = [
  {
    id: "1",
    objectTitle: "iPhone 12 Pro",
    objectImage:
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=120&h=120&fit=crop",
    otherUserName: "Pierre Martin",
    otherUserAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    lastMessage: "Parfait ! On peut se voir demain ?",
    lastMessageTime: "14:30",
    unreadCount: 2,
    isExchangeValidated: false,
  },
  {
    id: "2",
    objectTitle: "Vélo de course",
    objectImage:
      "https://images.unsplash.com/photo-1544191696-15693072e0b5?w=120&h=120&fit=crop",
    otherUserName: "Sophie Dubois",
    otherUserAvatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face",
    lastMessage: "Merci pour l'échange !",
    lastMessageTime: "Hier",
    unreadCount: 0,
    isExchangeValidated: true,
  },
  {
    id: "3",
    objectTitle: "Machine à café",
    objectImage:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=120&h=120&fit=crop",
    otherUserName: "Lucas Bernard",
    otherUserAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    lastMessage: "Est-ce qu'elle fonctionne bien ?",
    lastMessageTime: "2j",
    unreadCount: 1,
    isExchangeValidated: false,
  },
  {
    id: "4",
    objectTitle: "Ordinateur portable",
    objectImage:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=120&h=120&fit=crop",
    otherUserName: "Wael Wael",
    otherUserAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    lastMessage: "Salut ! Je suis intéressé par ton produit.",
    lastMessageTime: "10:15",
    unreadCount: 1,
    isExchangeValidated: false,
  },
];

// Messages simulés pour la conversation
const mockMessages = [
  {
    id: "1",
    text: "Salut ! Ton iPhone est encore disponible ?",
    isMe: false,
    timestamp: "14:25",
  },
  {
    id: "2",
    text: "Oui, il est en parfait état !",
    isMe: true,
    timestamp: "14:26",
  },
  {
    id: "3",
    text: "Parfait ! On peut se voir demain ?",
    isMe: false,
    timestamp: "14:30",
  },
];

import { KeyboardAvoidingView, Platform } from "react-native";

import { useExchange } from '../context/ExchangeContext';

const MessagingScreen = ({ navigation, route }) => {
  const { canPerformAction } = useSubscription();
  const { updateExchange } = useExchange();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState(mockMessages);
  const [conversations, setConversations] = useState(mockConversations);
  const [exchangeStatus, setExchangeStatus] = useState(null);

  // Vérifier l'accès à la messagerie
  React.useEffect(() => {
    if (!canPerformAction("message")) {
      Alert.alert(
        "Abonnement requis",
        "L'accès à la messagerie nécessite un abonnement.",
        [
          { text: "Retour", onPress: () => navigation.goBack() },
          {
            text: "Voir les plans",
            onPress: () => navigation.navigate("Subscription"),
          },
        ]
      );
    }
  }, [canPerformAction, navigation]);

  // Gérer les paramètres de route pour démarrer une nouvelle conversation
  React.useEffect(() => {
    if (route.params?.sellerId && route.params?.productTitle) {
      const { sellerId, productTitle, sellerAvatar } = route.params;

      // Chercher spécifiquement la conversation de Wael Wael
      const waelConversation = conversations.find(
        (conv) => conv.otherUserName === "Wael Wael"
      );

      if (waelConversation) {
        // Ouvrir la conversation existante de Wael Wael
        setSelectedConversation(waelConversation);
      } else {
        // Vérifier si une conversation existe déjà avec ce vendeur pour ce produit
        const existingConversation = conversations.find(
          (conv) =>
            conv.otherUserName === sellerId && conv.objectTitle === productTitle
        );

        if (existingConversation) {
          // Ouvrir la conversation existante
          setSelectedConversation(existingConversation);
        } else {
          // Créer une nouvelle conversation
          const newConversation = {
            id: Date.now().toString(),
            objectTitle: productTitle,
            objectImage:
              "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=120&h=120&fit=crop",
            otherUserName: sellerId,
            otherUserAvatar:
              sellerAvatar ||
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
            lastMessage: "Conversation démarrée",
            lastMessageTime: "Maintenant",
            unreadCount: 0,
            isExchangeValidated: false,
          };

          setConversations([newConversation, ...conversations]);
          setSelectedConversation(newConversation);
        }
      }
    }
  }, [route.params]);

  const sendMessage = () => {
    if (messageText.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: messageText,
        isMe: true,
        timestamp: new Date().toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMessage]);
      setMessageText("");
    }
  };

  const renderConversationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => setSelectedConversation(item)}
    >
      <View style={styles.conversationContent}>
        <Image source={{ uri: item.objectImage }} style={styles.objectImage} />
        <View style={styles.conversationInfo}>
          <View style={styles.conversationHeader}>
            <Text style={styles.objectTitle}>{item.objectTitle}</Text>
            <Text style={styles.messageTime}>{item.lastMessageTime}</Text>
          </View>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: item.otherUserAvatar }}
              style={styles.userAvatar}
            />
            <Text style={styles.userName}>{item.otherUserName}</Text>
            {item.isExchangeValidated && (
              <View style={styles.validatedBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={styles.validatedText}>Validé</Text>
              </View>
            )}
          </View>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        </View>
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadCount}>{item.unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.isMe ? styles.myMessage : styles.otherMessage,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.isMe ? styles.myMessageText : styles.otherMessageText,
        ]}
      >
        {item.text}
      </Text>
      <Text style={styles.messageTimestamp}>{item.timestamp}</Text>
    </View>
  );

  const handleValidateExchange = () => {
    Alert.alert("Confirmer l'échange", "Voulez-vous valider cet échange ?", [
      {
        text: "Annuler",
        style: "cancel",
      },
      {
        text: "Valider",
        onPress: () => {
          const updatedConversations = conversations.map((conv) => {
            if (conv.id === selectedConversation.id) {
              return { ...conv, isExchangeValidated: true };
            }
            return conv;
          });
          setConversations(updatedConversations);
          setSelectedConversation({
            ...selectedConversation,
            isExchangeValidated: true,
          });
        },
      },
    ]);
  };

  if (selectedConversation) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.chatHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedConversation(null)}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.chatHeaderLeft}>
            <Image
              source={{ uri: selectedConversation.otherUserAvatar }}
              style={styles.avatar}
            />
            <View style={styles.chatHeaderText}>
              <Text style={styles.chatHeaderName}>
                {selectedConversation.otherUserName}
              </Text>
              {selectedConversation.isExchangeValidated ? (
                <View style={styles.validatedBadge}>
                  <Text style={styles.validatedBadgeText}>Échange validé</Text>
                </View>
              ) : null}
            </View>
          </View>
          <View style={styles.callButtonsRight}>
            <TouchableOpacity
              style={styles.callButton}
              onPress={() => alert("Appel vidéo non implémenté")}
            >
              <Ionicons name="videocam" size={28} color="#007AFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.callButton}
              onPress={() => alert("Appel vocal non implémenté")}
            >
              <Ionicons name="call" size={28} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>



        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContainer}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.messageInput}
            value={messageText}
            onChangeText={setMessageText}
            placeholder="Tapez votre message..."
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      <FlatList
        data={conversations}
        renderItem={renderConversationItem}
        keyExtractor={(item) => item.id}
        style={styles.conversationsList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  conversationItem: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  conversationContent: {
    flexDirection: "row",
    flex: 1,
  },
  objectImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  conversationInfo: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  objectTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  messageTime: {
    fontSize: 12,
    color: "#999",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  userAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  userName: {
    fontSize: 14,
    color: "#555",
  },
  validatedBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  validatedText: {
    color: "#4CAF50",
    marginLeft: 4,
    fontWeight: "600",
  },
  lastMessage: {
    marginTop: 4,
    fontSize: 14,
    color: "#666",
  },
  unreadBadge: {
    backgroundColor: "#FF3B30",
    borderRadius: 12,
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 24,
    height: 24,
  },
  unreadCount: {
    color: "#fff",
    fontWeight: "bold",
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  backButton: {
    marginRight: 12,
  },
  chatHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  chatHeaderText: {
    marginLeft: 12,
  },
  exchangeButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#f0f0f0",
  },
  exchangeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  exchangeStartButton: {
    backgroundColor: "#FFA500",
  },
  exchangeCompleteButton: {
    backgroundColor: "#4CAF50",
  },
  exchangeFailButton: {
    backgroundColor: "#F44336",
  },
  exchangeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  chatHeaderName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  chatObjectTitle: {
    fontSize: 14,
    color: "#666",
  },
  callButtonsRight: {
    flexDirection: "row",
    marginLeft: 12,
    alignItems: "center",
  },
  callButton: {
    marginHorizontal: 6,
  },
  validateButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginLeft: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  validateButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  validatedBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  validatedText: {
    color: "#4CAF50",
    marginLeft: 4,
    fontWeight: "600",
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  messagesContainer: {
    paddingBottom: 12,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  myMessage: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
    borderRadius: 12,
    padding: 8,
    marginVertical: 4,
    maxWidth: "80%",
  },
  otherMessage: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    borderRadius: 12,
    padding: 8,
    marginVertical: 4,
    maxWidth: "80%",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  messageText: {
    fontSize: 16,
  },
  myMessageText: {
    color: "#000",
  },
  otherMessageText: {
    color: "#333",
  },
  messageTimestamp: {
    fontSize: 10,
    color: "#999",
    marginTop: 4,
    alignSelf: "flex-end",
  },
});
// );

export default MessagingScreen;
