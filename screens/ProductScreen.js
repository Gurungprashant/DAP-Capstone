import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
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

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <Text style={styles.productText}>{item.name}</Text>
            <Text style={styles.productText}>${item.price}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  productItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  productText: {
    fontSize: 18,
  },
});
