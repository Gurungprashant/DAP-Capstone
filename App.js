import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import CartScreen from './screens/CartScreen';
import SettingsScreen from './screens/SettingsScreen';
import WishListScreen from './screens/WishListScreen';
import CategoryTabNavigator from './navigation/CategoryTabNavigator'; // Import CategoryTabNavigator

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({  color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Category') {
            iconName = 'th-list'; // Icon for CategoryTab
          } else if (route.name === 'CartTab') {
            iconName = 'shopping-cart';
          } else if (route.name === 'SettingsTab') {
            iconName = 'cog';
          } else if (route.name === 'WishListTab') {
            iconName = 'heart'; // Icon for WishListTab
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Category" component={CategoryTabNavigator} options={{ headerShown: false  }} />
      <Tab.Screen name="WishListTab" component={WishListScreen} options={{ title: 'Wish List' }} />
      <Tab.Screen name="CartTab" component={CartScreen} options={{ title: 'Cart' }} />
      <Tab.Screen name="SettingsTab" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="SignIn" component={SignInScreen} options={{ title: 'Sign In', headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Sign Up', headerShown: false }} />
        <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
