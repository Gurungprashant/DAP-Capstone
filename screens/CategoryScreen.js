// screens/CategoryScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchCategories } from '../firebaseconfig/firebaseHelpers';

export default function CategoryScreen() {
  const [categories, setCategories] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadCategories = async () => {
      const categoriesData = await fetchCategories();
      setCategories(categoriesData);
    };

    loadCategories();
  }, []);

  return (
    <View style={styles.container}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={styles.categoryButton}
          onPress={() => navigation.navigate('SubCategory', { categoryId: category.id })} // Navigate to SubCategory screen
        >
          <Text style={styles.categoryText}>{category.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  categoryButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#ff5722',
    marginVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  categoryText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
