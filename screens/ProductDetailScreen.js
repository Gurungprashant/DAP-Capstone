import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

export default function ProductDetailScreen({ route }) {
  const { product } = route.params;

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
      {product.imageUrl && product.imageUrl.length > 0 && renderImageSlider(product.imageUrl)}
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productPrice}>${product.price}</Text>
      <Text style={styles.productDescription}>{product.description}</Text> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  imageSlider: {
    width: '100%',
    height: 300,
    marginBottom: 10,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginRight: 5,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 20,
    color: '#888',
  },
  productDescription: {
    fontSize: 16,
    marginTop: 10,
  },
});
