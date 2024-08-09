import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { saveOrderToFirebase, removePurchasedItemsFromCart } from '../firebaseconfig/firebaseHelpers';
import { useCart } from './CartContext';

export default function CheckOutScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { cartItems } = route.params || {};
  const { updateCartItems } = useCart();
  const [loading, setLoading] = useState(false);

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

  const handleCheckout = async () => {
    setLoading(true);
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const orderDetails = {
        items: cartItems,
        total: calculateTotalPrice(),
      };

      try {

        await saveOrderToFirebase(user.uid, orderDetails);

        await removePurchasedItemsFromCart(user.uid, cartItems);

        if (updateCartItems) {
          updateCartItems();
        }

        Alert.alert('Success', 'Purchase successful!', [
          {
            text: 'OK',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Main', state: { routes: [{ name: 'CartTab' }] } }],
              });
            },
          },
        ]);
      } catch (error) {
        console.error('Error during checkout:', error);
        Alert.alert('Error', 'Failed to complete purchase. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      Alert.alert('Error', 'User is not authenticated.');
    }
  };

  return (
    <View style={styles.container}>
      {cartItems.map(renderCartItem)}
      <Text style={styles.totalPrice}>Total: ${calculateTotalPrice()}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handleCheckout}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Processing...' : 'Confirm Purchase'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 18,
    color: '#888',
  },
  productQuantity: {
    fontSize: 18,
    marginTop: 5,
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#ff6666',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});