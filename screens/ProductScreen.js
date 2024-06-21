import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Dimensions, ScrollView } from 'react-native';
import { fetchProducts } from '../firebaseconfig/firebaseHelpers';

export default function ProductScreen({ route }) {
  const { categoryId, subCategoryId } = route.params;
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const productsFromFirebase = await fetchProducts(categoryId, subCategoryId);
        setProducts(productsFromFirebase);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
    loadProducts();
  }, [categoryId, subCategoryId]);

  // Get the screen width
  const { width } = Dimensions.get('window');
  const itemWidth = (width - 35) / 2; // Two items per row with some margin

  const renderImageSlider = (images) => {
    return (
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.imageSlider}
      >
        {images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image }}
            style={styles.image}
          />
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2} // Set the number of columns
        key={2} // Force a fresh render with a static key
        renderItem={({ item }) => (
          <View style={[styles.productItem, { width: itemWidth }]}>
            {item.imageUrl && item.imageUrl.length > 0 && renderImageSlider(item.imageUrl)}
            <Text style={styles.productText}>{item.name}</Text>
            <Text style={styles.productPrice}>${item.price}</Text>
          </View>
        )}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  flatListContainer: {
    justifyContent: 'space-between',
  },
  productItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  imageSlider: {
    width: '100%',
    height: 150, // Adjust the height for the slider
    marginBottom: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginRight: 5,
  },
  productText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 16,
    color: '#888',
  },
});
