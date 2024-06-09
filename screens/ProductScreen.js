// screens/ProductScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { fetchProducts } from '../firebaseconfig/firebaseHelpers';

export default function ProductScreen({ route }) {
  const { categoryId, subCategoryId } = route.params;
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      const productsData = await fetchProducts(categoryId, subCategoryId);
      setProducts(productsData);
    };

    loadProducts();
  }, [categoryId, subCategoryId]);

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
            <Text style={styles.itemText}>${item.price.toFixed(2)}</Text>
            
          </View>
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
