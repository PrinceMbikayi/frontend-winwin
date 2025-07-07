import React, { createContext, useContext, useState } from 'react';

// Contexte pour la gestion des messages et conversations
const MessagingContext = createContext();

// Hook personnalisé pour utiliser le contexte de messagerie
export const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
};

// Provider pour le contexte de messagerie
export const MessagingProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  // Fonction pour envoyer un message
  const sendMessage = (conversationId, messageText) => {
    if (messageText.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: messageText,
        isMe: true,
        timestamp: new Date().toLocaleTimeString('fr-FR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        conversationId
      };
      
      setMessages(prevMessages => [...prevMessages, newMessage]);
      
      // Mettre à jour la dernière message de la conversation
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === conversationId 
            ? { ...conv, lastMessage: messageText, lastMessageTime: newMessage.timestamp }
            : conv
        )
      );
      
      return newMessage;
    }
    return null;
  };

  // Fonction pour valider un échange
  const validateExchange = (conversationId) => {
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === conversationId 
          ? { ...conv, isExchangeValidated: true }
          : conv
      )
    );
  };

  // Fonction pour marquer les messages comme lus
  const markAsRead = (conversationId) => {
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === conversationId 
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );
  };

  // Fonction pour obtenir les messages d'une conversation
  const getMessagesForConversation = (conversationId) => {
    return messages.filter(message => message.conversationId === conversationId);
  };

  const value = {
    conversations,
    setConversations,
    currentConversation,
    setCurrentConversation,
    messages,
    setMessages,
    sendMessage,
    validateExchange,
    markAsRead,
    getMessagesForConversation
  };

  return (
    <MessagingContext.Provider value={value}>
      {children}
    </MessagingContext.Provider>
  );
};

export default MessagingContext;