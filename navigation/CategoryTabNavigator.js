// navigation/CategoryTabNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CategoryScreen from '../screens/CategoryScreen';
import SubCategoryScreen from '../screens/SubCategoryScreen';
import ProductScreen from '../screens/ProductScreen';

const Stack = createNativeStackNavigator();

export default function CategoryTabNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CategoryTab" component={CategoryScreen} options={{ title: 'Categories' }} />
      <Stack.Screen name="SubCategory" component={SubCategoryScreen} options={{ title: 'Subcategories' }} />
      <Stack.Screen name="Product" component={ProductScreen} options={{ title: 'Products' }} />
    </Stack.Navigator>
  );
}
