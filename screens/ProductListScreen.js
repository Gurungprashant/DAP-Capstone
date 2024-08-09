import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { retrieveProducts } from '../firebaseconfig/firebaseHelpers';
import { auth } from '../firebaseconfig/firebaseConfig';

export default function ProductListScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const user = auth.currentUser;

  useEffect(() => {
    async function fetchProductsData() {
      try {
        const productsFromFirebase = await retrieveProducts();
        setProducts(productsFromFirebase);
      } catch (err) {
        setError('Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProductsData();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  const handleViewDetails = (product) => {
    navigation.navigate('ProductDetailScreen', { productId: product.id });
  };

  const renderItem = ({ item }) => {
    const firstImageUrl = (typeof item.imageUrl === 'string' && item.imageUrl.length > 0)
      ? item.imageUrl 
      : (Array.isArray(item.imageUrl) && item.imageUrl.length > 0)
        ? item.imageUrl[0] 
        : 'https://via.placeholder.com/150';

    return (
      <View style={styles.itemContainer}>
        <Image 
          source={{ uri: firstImageUrl }} 
          style={styles.itemImage} 
        />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name || 'No Title'}</Text>
          <Text style={styles.itemDescription}>{item.description || 'No Description'}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleViewDetails(item)}
          >
            <Text style={styles.buttonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
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
  list: {
    flexGrow: 1,
  },
  itemContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  itemImage: {
    width: '100%',
    height: 200,
  },
  itemDetails: {
    padding: 10,
  },
  itemName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  
  button: {
    backgroundColor: '#ff9933',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
