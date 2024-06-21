import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchCategories } from '../firebaseconfig/firebaseHelpers';

export default function CategoryScreen() {
  const [categories, setCategories] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    async function fetchDataFromFirebase() {
      try {
        const categoriesFromFirebase = await fetchCategories();
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
            <ImageBackground source={{ uri: item.imageUrl }} style={styles.imageBackground}>
              <View style={styles.overlay}>
                <Text style={styles.itemText}>{item.name}</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  item: {
    width: '100%',
    height: 230,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff', // White text color
  },
});
