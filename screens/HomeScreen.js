import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, ScrollView, TextInput, Text, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { fetchCategories, fetchSubCategories, fetchProducts } from '../firebaseconfig/firebaseHelpers'; // Import your functions to fetch categories, subcategories, and products from Firebase


export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const scrollViewRef = useRef();

  const handleSearch = (text) => {
    setSearchQuery(text.toLowerCase());
  };

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

  const handleCategoryPress = async (categoryId) => {
    setSelectedIndex(categoryId);
    try {
      const subCategoriesFromFirebase = await fetchSubCategories(categoryId);
      console.log('Fetched subcategories:', subCategoriesFromFirebase);
      setSubCategories(subCategoriesFromFirebase);
      setProducts([]); // Clear products when a category is selected
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const handleSubCategoryPress = async (subCategoryId) => {
    try {
      const productsFromFirebase = await fetchProducts(selectedIndex, subCategoryId);
      console.log('Fetched products:', productsFromFirebase);
      setProducts(productsFromFirebase);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#000" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search here..."
          placeholderTextColor="#666"
          onChangeText={handleSearch}
        />
      </View>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryItem,
              selectedIndex === category.id && styles.selectedCategoryItem
            ]}
            onPress={() => handleCategoryPress(category.id)}
          >
            <Text style={styles.categoryText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.subCategoriesContainer}>
        {subCategories.map((subCategory) => (
          <TouchableOpacity
            key={subCategory.id}
            style={styles.subCategoryItem}
            onPress={() => handleSubCategoryPress(subCategory.id)}
          >
            <Text style={styles.subCategoryText}>{subCategory.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.productsContainer}>
        {products.map((product) => (
          <Text key={product.id} style={styles.productItem}>
            {product.name}: ${product.price}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    padding: 2,
    alignItems: 'center',
  },
  searchIcon: {
    marginLeft: 10,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  categoriesContainer: {
    alignItems: 'center',
    marginBottom: 10, // Reduce margin
  },
  categoryItem: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 5,
    backgroundColor: '#ddd',
    borderRadius: 20,
  },
  selectedCategoryItem: {
    backgroundColor: '#007bff',
  },
  categoryText: {
    fontSize: 16,
    color: '#000',
  },
  subCategoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  subCategoryItem: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 5,
    backgroundColor: '#ddd',
    borderRadius: 20,
  },
  subCategoryText: {
    fontSize: 16,
    color: '#000',
  },
  productsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  productItem: {
    fontSize: 16,
    marginBottom: 10,
  },
});
