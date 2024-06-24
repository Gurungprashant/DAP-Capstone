import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function CheckOutScreen({ route }) {
  const { product, quantity } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.productContainer}>
        {product.imageUrl && product.imageUrl.length > 0 && (
          <Image source={{ uri: product.imageUrl[0] }} style={styles.image} />
        )}
        <View style={styles.detailsContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>${product.price}</Text>
          <Text style={styles.productQuantity}>Quantity: {quantity}</Text>
        </View>
      </View>
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: ${product.price * quantity}</Text>
      </View>
      <TouchableOpacity style={styles.purchaseButton} onPress={() => alert('Purchase Now')}>
        <Text style={styles.purchaseButtonText}>Purchase Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  productContainer: {
    flexDirection: 'row',
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginRight: 20,
  },
  detailsContainer: {
    flex: 1,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 18,
    color: '#ff6666',
    marginBottom: 10,
  },
  productQuantity: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  totalContainer: {
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'flex-end',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff6666',
  },
  purchaseButton: {
    backgroundColor: '#ff6666',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 20,
  },
});
