import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import FlashMessage from 'react-native-flash-message';

import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import CartScreen from './screens/CartScreen';
import HelpSupportScreen from './screens/HelpSupportScreen';
import AboutScreen from './screens/AboutScreen';
import SettingsScreen from './screens/SettingsScreen';
import WishListScreen from './screens/WishListScreen';
import SubCategoryScreen from './screens/SubCategoryScreen';
import CategoryScreen from './screens/CategoryScreen';
import ProductScreen from './screens/ProductScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import CheckOutScreen from './screens/CheckOutScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import OrderDetailScreen from './screens/OrderDetailScreen';
import { WishlistProvider } from './screens/WishlistContext';
import { CartProvider } from './screens/CartContext';  

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'CategoryTab') {
            iconName = 'th-list';
          } else if (route.name === 'WishListTab') {
            iconName = 'heart';
          } else if (route.name === 'CartTab') {
            iconName = 'shopping-cart';
          } else if (route.name === 'SettingsTab') {
            iconName = 'cog';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="CategoryTab" component={CategoryScreen} options={{ title: 'Categories' }} />
      <Tab.Screen name="WishListTab" component={WishListScreen} options={{ title: 'Wish List' }} />
      <Tab.Screen name="CartTab" component={CartScreen} options={{ title: 'Cart' }} />
      <Tab.Screen name="SettingsTab" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <WishlistProvider>
      <CartProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="SignIn">
            <Stack.Screen name="SignIn" component={SignInScreen} options={{ title: 'Sign In', headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Sign Up', headerShown: false }} />
            <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="SubCategoryScreen" component={SubCategoryScreen} options={{ title: 'Selections' }} />
            <Stack.Screen name="ProductScreen" component={ProductScreen} options={{ title: 'Products' }} />
            <Stack.Screen name="ProductDetailScreen" component={ProductDetailScreen} options={{ title: 'Product Details' }} />
            <Stack.Screen name="CheckOutScreen" component={CheckOutScreen} options={{ title: 'Checkout' }} />
            <Stack.Screen name="CartScreen" component={CartScreen} />
            <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ title: 'Change Password' }} />
            <Stack.Screen name="OrderHistoryScreen" component={OrderHistoryScreen} />
            <Stack.Screen name="OrderDetailScreen" component={OrderDetailScreen} />
          </Stack.Navigator>
          <FlashMessage position="top" />
        </NavigationContainer>
      </CartProvider>
    </WishlistProvider>
  );
}
