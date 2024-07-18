// CartScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { fetchCartItems } from '../firebaseconfig/firebaseHelpers';
import { auth } from '../firebaseconfig/firebaseConfig'; // Import Firebase auth

export default function CartScreen() {
  const [cartItems, setCartItems] = useState([]);
  const user = auth.currentUser; // Get the current user

  useEffect(() => {
    if (user) {
      const loadCartItems = async () => {
        try {
          const items = await fetchCartItems(user.uid);
          setCartItems(items);
        } catch (error) {
          console.error('Error fetching cart items:', error);
        }
      };
      loadCartItems();
    } else {
      console.log('No user logged in');
    }
  }, [user]);

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemPrice}>${item.price}</Text>
      <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cart</Text>
      {user ? (
        <FlatList
          data={cartItems}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={styles.noUserText}>Please log in to view your cart.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cartItem: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 16,
    color: '#888',
  },
  itemQuantity: {
    fontSize: 16,
    color: '#666',
  },
  noUserText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
