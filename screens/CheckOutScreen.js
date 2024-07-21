


import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function CheckOutScreen() {
  const route = useRoute();
  const { cartItems } = route.params || [];

  if (!cartItems || cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Your cart is empty. Please go back and add items to your cart.</Text>
      </View>
    );
  }

  const renderCartItem = (item) => {
    const imageUrl = item.imageUrl ? item.imageUrl[0] : 'https://via.placeholder.com/150';
    return (
      <View key={item.id} style={styles.cartItem}>
        <Image source={{ uri: imageUrl }} style={styles.productImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>${item.price}</Text>
          <Text style={styles.productQuantity}>Quantity: {item.quantity}</Text>
        </View>
      </View>
    );
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <View style={styles.container}>
      {cartItems.map(item => renderCartItem(item))}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: ${calculateTotalPrice()}</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Purchase Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  itemDetails: {
    marginLeft: 15,
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 16,
    color: '#888',
  },
  productQuantity: {
    fontSize: 16,
  },
  totalContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#ff6666',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: '#ff0000',
    textAlign: 'center',
  },
});
