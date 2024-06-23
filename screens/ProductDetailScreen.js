import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function ProductDetailScreen({ route }) {
  const { product } = route.params;
  const [wishlist, setWishlist] = useState([]);

  const toggleWishlist = (productId) => {
    setWishlist((prevWishlist) =>
      prevWishlist.includes(productId)
        ? prevWishlist.filter((id) => id !== productId)
        : [...prevWishlist, productId]
    );
  };

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
      <TouchableOpacity
        style={styles.wishlistIcon}
        onPress={() => toggleWishlist(product.id)}
      >
        <Icon name="heart" size={32} color="#000" style={styles.iconShadow} />
        <Icon name="heart" size={30} color={wishlist.includes(product.id) ? '#ff6666' : '#fff'} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
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
  wishlistIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  iconShadow: {
    position: 'absolute',
  },
});
