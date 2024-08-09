import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

export default function OrderDetailScreen({ route }) {
  const { order } = route.params;

  const formatPrice = (price) => {
    const num = typeof price === 'number' ? price : parseFloat(price);
    return !isNaN(num) ? num.toFixed(2) : 'N/A';
  };

  const getFirstImageUrl = (images) => {
    return (images && Array.isArray(images) && images.length > 0) ? images[0] : null;
  };

  return (
    <ScrollView style={styles.container}>
      {order.items.map((product, index) => {
        const imageUrl = getFirstImageUrl(product.imageUrl);

        return (
          <View key={index} style={styles.itemContainer}>
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.productImage} />
            ) : (
              <Text style={styles.noImageText}>No Image Available</Text>
            )}
            <View style={styles.detailsContainer}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>${formatPrice(product.price)}</Text>
            </View>
          </View>
        );
      })}
      <View style={styles.summaryContainer}>
        <Text style={styles.orderDate}>{new Date(order.date).toLocaleDateString()}</Text>
        <Text style={styles.total}>Total: ${formatPrice(order.total)}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
    resizeMode: 'cover',
  },
  noImageText: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    lineHeight: 100,
    color: '#888',
  },
  detailsContainer: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 18,
    color: '#888',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  orderDate: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
