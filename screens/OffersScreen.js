import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchNewOffers } from '../firebaseconfig/firebaseHelpers';

export default function OffersScreen() {
  const [categories, setCategories] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    async function fetchNewOffersFromFirebase() {
      try {
        const newOffersFromFirebase = await fetchNewOffers();
        setCategories(newOffersFromFirebase);
      } catch (error) {
        console.error('Error fetching new offers:', error);
      }
    }
    fetchNewOffersFromFirebase();
  }, []);

  const handleSubcategoryPress = (categoryId) => {
    navigation.navigate('SubCategoryScreen', { categoryId });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryItem}
            onPress={() => handleSubcategoryPress(category.id)}
          >
            <Text style={styles.categoryText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  categoryItem: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: 5,
    backgroundColor: '#ddd',
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 16,
    color: '#000',
  },
});
