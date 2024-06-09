import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CategoryScreen from '../screens/CategoryScreen'; // Main category screen
import SubCategoryScreen from '../screens/SubCategoryScreen'; // Subcategory screen

const Stack = createNativeStackNavigator();

export default function CategoryTabNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Category" component={CategoryScreen} options={{ title: 'Categories' }} />
      <Stack.Screen name="SubCategory" component={SubCategoryScreen} options={{ title: 'SubCategories' }} />
    </Stack.Navigator>
  );
}
