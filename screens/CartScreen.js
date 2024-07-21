import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { fetchCartItems, updateCartItemQuantity, deleteCartItem } from '../firebaseconfig/firebaseHelpers'; // Adjust the import as per your file structure
import { auth } from '../firebaseconfig/firebaseConfig'; // Adjust the import as per your file structure
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

export default function CartScreen() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const user = auth.currentUser;
  const navigation = useNavigation();

  useEffect(() => {
    let unsubscribe = null;

    if (user) {
      const loadCartItems = async () => {
        unsubscribe = await fetchCartItems(user.uid, setCartItems);
      };
      loadCartItems();
    } else {
      console.log('No user logged in');
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  useEffect(() => {
    const calculateTotalPrice = () => {
      const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      setTotalPrice(total);
    };
    calculateTotalPrice();
  }, [cartItems]);
  

  const handleIncrementQuantity = async (item) => {
    try {
      const newQuantity = item.quantity + 1;
      await updateCartItemQuantity(user.uid, item.id, newQuantity);
      setCartItems((prevItems) =>
        prevItems.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: newQuantity } : cartItem
        )
      );
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
    }
  };

  const handleDecrementQuantity = async (item) => {
    try {
      const newQuantity = item.quantity - 1;
      if (newQuantity > 0) {
        await updateCartItemQuantity(user.uid, item.id, newQuantity);
        setCartItems((prevItems) =>
          prevItems.map((cartItem) =>
            cartItem.id === item.id ? { ...cartItem, quantity: newQuantity } : cartItem
          )
        );
      }
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteCartItem(user.uid, itemId);
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting cart item:', error);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Your cart is empty', 'Add some items to your cart before checking out.');
      return;
    }
    navigation.navigate('CheckOutScreen', { cartItems });
  };


  const renderCartItem = ({ item }) => {
    return (
              <View style={styles.cartItem}>
        <Image
          source={{ uri: item.imageUrl[0] || 'https://via.placeholder.com/80' }}
          style={styles.itemImage}
        />
        <View style={styles.itemDetails}>
          <TouchableOpacity onPress={() => navigation.navigate('ProductDetailScreen', { product: item, categoryId: item.categoryId, subCategoryId: item.subCategoryId })}>
            <Text style={styles.itemName}>{item.name}</Text>
          </TouchableOpacity>
          <Text style={styles.itemPrice}>${item.price}</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={() => handleDecrementQuantity(item)}>
              <Icon name="minus-circle" size={24} color="#ff6666" />
            </TouchableOpacity>
            <Text style={styles.itemQuantity}>{item.quantity}</Text>
            <TouchableOpacity onPress={() => handleIncrementQuantity(item)}>
              <Icon name="plus-circle" size={24} color="#ff6666" />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity onPress={() => handleDeleteItem(item.id)} style={styles.deleteButton}>
          <Icon name="trash" size={24} color="#ff6666" />
        </TouchableOpacity>
      </View>
    );
  };
  

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.cartList}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: ${totalPrice.toFixed(2)}</Text>
        <TouchableOpacity style={styles.button} onPress={handleCheckout}>
          <Text style={styles.buttonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 18,
    color: '#888',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  itemQuantity: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  deleteButton: {
    justifyContent: 'center',
    paddingRight: 10,
    paddingTop: 20
  },
  noUserText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
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
});