import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchCategories } from '../firebaseconfig/firebaseHelpers';

export default function CategoryScreen() {
  const [categories, setCategories] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    async function fetchDataFromFirebase() {
      try {
        const categoriesFromFirebase = await fetchCategories();
        console.log('Fetched categories:', categoriesFromFirebase);
        setCategories(categoriesFromFirebase);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }

    fetchDataFromFirebase();
  }, []);

  const handleCategoryPress = (categoryId) => {
    navigation.navigate('SubCategoryScreen', { categoryId });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => handleCategoryPress(item.id)}>
            <Text style={styles.itemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  item: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  itemText: {

    fontSize: 18,
    fontWeight: 'bold',
  },
});
