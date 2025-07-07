import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ExchangeProvider } from '../context/ExchangeContext';
import { SubscriptionProvider } from '../context/SubscriptionContext';

import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import MapScreen from '../screens/MapScreen';
import SuggestionsScreen from '../screens/SuggestionsScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TransactionHistoryScreen from '../screens/TransactionHistoryScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import MyAdsScreen from '../screens/MyAdsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import HelpSupportScreen from '../screens/HelpSupportScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import TabNavigator from './TabNavigator';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <SubscriptionProvider>
      <ExchangeProvider>
        <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Onboarding"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Home" component={TabNavigator} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          <Stack.Screen name="Map" component={MapScreen} />
          <Stack.Screen name="Suggestions" component={SuggestionsScreen} />
          <Stack.Screen name="UserProfile" component={UserProfileScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="TransactionHistory" component={TransactionHistoryScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="MyAds" component={MyAdsScreen} />
          <Stack.Screen name="Favorites" component={FavoritesScreen} />
          <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
          <Stack.Screen name="Subscription" component={SubscriptionScreen} />
          <Stack.Screen name="TransactionDetail" component={require('../screens/TransactionDetail').default} />
        </Stack.Navigator>
        </NavigationContainer>
      </ExchangeProvider>
    </SubscriptionProvider>
  );
};

export default AppNavigator;
