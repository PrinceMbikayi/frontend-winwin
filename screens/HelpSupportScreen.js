import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HelpSupportScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    email: 'mehdi.mehdi@winwin.com' // Email de l'utilisateur connecté
  });
  const [showContactForm, setShowContactForm] = useState(false);

  // FAQ organisée par catégories
  const faqData = {
    account: {
      title: 'Compte et profil',
      icon: 'person-outline',
      questions: [
        {
          question: 'Comment modifier mon profil ?',
          answer: 'Allez dans votre profil, puis appuyez sur "Modifier le profil". Vous pourrez modifier votre nom, photo, biographie et autres informations.'
        },
        {
          question: 'Comment supprimer mon compte ?',
          answer: 'Rendez-vous dans Paramètres > Compte > Supprimer mon compte. Attention, cette action est irréversible.'
        },
        {
          question: 'Comment devenir un utilisateur professionnel ?',
          answer: 'Dans les paramètres de votre profil, activez l\'option "Compte professionnel". Cela vous donnera accès à des fonctionnalités avancées.'
        }
      ]
    },
    exchanges: {
      title: 'Échanges et transactions',
      icon: 'swap-horizontal-outline',
      questions: [
        {
          question: 'Comment proposer un échange ?',
          answer: 'Sur la fiche d\'un objet qui vous intéresse, appuyez sur "Proposer un échange". Sélectionnez l\'objet que vous souhaitez échanger et envoyez votre proposition.'
        },
        {
          question: 'Que faire si un échange ne se passe pas bien ?',
          answer: 'Contactez immédiatement notre support via le formulaire de contact. Nous médierons pour résoudre le conflit.'
        },
        {
          question: 'Comment évaluer un échange ?',
          answer: 'Après un échange réussi, vous recevrez une notification pour évaluer votre partenaire. Cette évaluation aide la communauté.'
        },
        {
          question: 'Puis-je annuler un échange ?',
          answer: 'Oui, tant que l\'échange n\'a pas été confirmé par les deux parties. Allez dans vos messages et informez votre partenaire.'
        }
      ]
    },
    safety: {
      title: 'Sécurité et confiance',
      icon: 'shield-checkmark-outline',
      questions: [
        {
          question: 'Comment vérifier la fiabilité d\'un utilisateur ?',
          answer: 'Consultez ses évaluations, son historique d\'échanges et ses badges. Privilégiez les utilisateurs avec de bonnes notes.'
        },
        {
          question: 'Où effectuer l\'échange en sécurité ?',
          answer: 'Privilégiez les lieux publics et fréquentés : centres commerciaux, cafés, devant une mairie. Évitez les domiciles privés.'
        },
        {
          question: 'Comment signaler un utilisateur suspect ?',
          answer: 'Sur le profil de l\'utilisateur, appuyez sur les trois points et sélectionnez "Signaler". Décrivez le problème rencontré.'
        }
      ]
    },
    technical: {
      title: 'Problèmes techniques',
      icon: 'settings-outline',
      questions: [
        {
          question: 'L\'application plante ou bug',
          answer: 'Fermez complètement l\'application et relancez-la. Si le problème persiste, redémarrez votre téléphone ou contactez le support.'
        },
        {
          question: 'Je ne reçois pas les notifications',
          answer: 'Vérifiez que les notifications sont activées dans les paramètres de votre téléphone et dans l\'application.'
        },
        {
          question: 'Problème de géolocalisation',
          answer: 'Assurez-vous d\'avoir autorisé l\'accès à votre position dans les paramètres de votre téléphone.'
        }
      ]
    }
  };

  const quickActions = [
    {
      title: 'Nous contacter par email',
      subtitle: 'support@winwin.com',
      icon: 'mail-outline',
      action: () => Linking.openURL('mailto:support@winwin.com')
    },
    {
      title: 'Nous appeler',
      subtitle: '+33 1 23 45 67 89',
      icon: 'call-outline',
      action: () => Linking.openURL('tel:+33123456789')
    },
    {
      title: 'Chat en direct',
      subtitle: 'Disponible 9h-18h',
      icon: 'chatbubble-outline',
      action: () => Alert.alert('Chat', 'Fonctionnalité en cours de développement')
    },
    {
      title: 'Centre d\'aide en ligne',
      subtitle: 'Articles et tutoriels',
      icon: 'help-circle-outline',
      action: () => Linking.openURL('https://help.winwin.com')
    }
  ];

  const handleSendMessage = () => {
    if (!contactForm.subject.trim() || !contactForm.message.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    Alert.alert(
      'Message envoyé',
      'Votre message a été envoyé avec succès. Notre équipe vous répondra dans les plus brefs délais.',
      [
        {
          text: 'OK',
          onPress: () => {
            setContactForm({ ...contactForm, subject: '', message: '' });
            setShowContactForm(false);
          }
        }
      ]
    );
  };

  const renderFAQCategory = (categoryKey, category) => (
    <View key={categoryKey} style={styles.categoryContainer}>
      <TouchableOpacity
        style={styles.categoryHeader}
        onPress={() => setSelectedCategory(selectedCategory === categoryKey ? null : categoryKey)}
      >
        <View style={styles.categoryLeft}>
          <View style={styles.categoryIconContainer}>
            <Ionicons name={category.icon} size={24} color="#227897" />
          </View>
          <Text style={styles.categoryTitle}>{category.title}</Text>
        </View>
        <Ionicons 
          name={selectedCategory === categoryKey ? 'chevron-up' : 'chevron-down'} 
          size={20} 
          color="#666" 
        />
      </TouchableOpacity>
      
      {selectedCategory === categoryKey && (
        <View style={styles.questionsContainer}>
          {category.questions.map((item, index) => (
            <View key={index} style={styles.questionItem}>
              <Text style={styles.question}>{item.question}</Text>
              <Text style={styles.answer}>{item.answer}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderQuickAction = (action, index) => (
    <TouchableOpacity key={index} style={styles.actionItem} onPress={action.action}>
      <View style={styles.actionLeft}>
        <View style={styles.actionIconContainer}>
          <Ionicons name={action.icon} size={24} color="#227897" />
        </View>
        <View style={styles.actionText}>
          <Text style={styles.actionTitle}>{action.title}</Text>
          <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  if (showContactForm) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setShowContactForm(false)}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nous contacter</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Décrivez votre problème</Text>
            <Text style={styles.formSubtitle}>
              Notre équipe vous répondra dans les 24h
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Sujet *</Text>
              <TextInput
                style={styles.input}
                value={contactForm.subject}
                onChangeText={(text) => setContactForm({ ...contactForm, subject: text })}
                placeholder="Résumez votre problème en quelques mots"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Message *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={contactForm.message}
                onChangeText={(text) => setContactForm({ ...contactForm, message: text })}
                placeholder="Décrivez votre problème en détail..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email de réponse</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={contactForm.email}
                editable={false}
              />
            </View>

            <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
              <Ionicons name="send" size={20} color="white" />
              <Text style={styles.sendButtonText}>Envoyer le message</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Aide et support</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Actions rapides */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact rapide</Text>
          {quickActions.map(renderQuickAction)}
        </View>

        {/* Bouton formulaire de contact */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.contactFormButton}
            onPress={() => setShowContactForm(true)}
          >
            <Ionicons name="create-outline" size={24} color="white" />
            <Text style={styles.contactFormButtonText}>Envoyer un message détaillé</Text>
          </TouchableOpacity>
        </View>

        {/* FAQ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Questions fréquentes</Text>
          {Object.entries(faqData).map(([key, category]) => 
            renderFAQCategory(key, category)
          )}
        </View>

        {/* Informations supplémentaires */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Horaires du support</Text>
            <Text style={styles.infoText}>Lundi - Vendredi : 9h00 - 18h00</Text>
            <Text style={styles.infoText}>Samedi : 10h00 - 16h00</Text>
            <Text style={styles.infoText}>Dimanche : Fermé</Text>
          </View>
          
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Temps de réponse moyen</Text>
            <Text style={styles.infoText}>Email : 24h</Text>
            <Text style={styles.infoText}>Chat : Immédiat (heures d'ouverture)</Text>
            <Text style={styles.infoText}>Téléphone : Immédiat</Text>
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  contactFormButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#227897',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 8,
  },
  contactFormButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  categoryContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  questionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  questionItem: {
    marginBottom: 16,
    paddingLeft: 56,
  },
  question: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  answer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  // Styles pour le formulaire de contact
  formContainer: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 12,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
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
    height: 120,
    paddingTop: 12,
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
    color: '#999',
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#227897',
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomPadding: {
    height: 50,
  },
});

export default HelpSupportScreen;