import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';

const TransactionDetail = ({ route, navigation }) => {
  const { transaction } = route.params || {};

  if (!transaction) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Détails de la transaction non disponibles.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Détails de la transaction</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Objet :</Text>
          <Text style={styles.value}>{transaction.objectTitle}</Text>
          {transaction.objectImage && (
            <Image source={{ uri: transaction.objectImage }} style={styles.image} />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Correspondant :</Text>
          <Text style={styles.value}>{transaction.otherUserName}</Text>
          {transaction.otherUserAvatar && (
            <Image source={{ uri: transaction.otherUserAvatar }} style={styles.avatar} />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Statut :</Text>
          <Text style={styles.value}>{transaction.isExchangeValidated ? 'Validé' : 'En attente'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Dernier message :</Text>
          <Text style={styles.value}>{transaction.lastMessage}</Text>
        </View>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginTop: 8,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginTop: 8,
  },
  backButton: {
    marginTop: 24,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default TransactionDetail;