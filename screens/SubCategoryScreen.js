import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchSubCategories } from '../firebaseconfig/firebaseHelpers';

export default function SubCategoryScreen({ route }) {
  const { categoryId } = route.params;
  const [subCategories, setSubCategories] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    async function loadSubCategories() {
      try {
        const subCategoriesFromFirebase = await fetchSubCategories(categoryId);
        setSubCategories(subCategoriesFromFirebase);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    }
    loadSubCategories();
  }, [categoryId]);

  const handleSubCategoryPress = (subCategoryId) => {
    navigation.navigate('ProductScreen', { categoryId, subCategoryId });
  };

  return (
    <View style={styles.container}>
      
      <FlatList
        data={subCategories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => handleSubCategoryPress(item.id)}>
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
    marginTop: 10,
    backgroundColor: '#f5f5f5',
  },
  item: {
    width: '100%',
    height: 160,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 20,
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
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff', 
  },
});
