import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useWishlist } from './WishlistContext';

export default function ProductDetailScreen({ route }) {
  const { product, categoryId, subCategoryId } = route.params;
  const [quantity, setQuantity] = useState(1);
  const { wishlist, toggleWishlistItem } = useWishlist();
  const [wishlistState, setWishlistState] = useState(false);

  useEffect(() => {
    if (wishlist) {
      setWishlistState(wishlist.some(item => item.productId === product.id));
    }
  }, [wishlist, product]);

  const toggleWishlist = () => {
    toggleWishlistItem({
      categoryId,
      subCategoryId,
      productId: product.id,
    });
    setWishlistState(!wishlistState);
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

  const incrementQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  return (
    <View style={styles.container}>
      {product.imageUrl && product.imageUrl.length > 0 && renderImageSlider(product.imageUrl)}
      <View style={styles.detailsContainer}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>${product.price}</Text>
        <Text style={styles.productDescription}>{product.description}</Text>
      </View>
      <TouchableOpacity
        style={styles.wishlistIcon}
        onPress={toggleWishlist}
      >
        <Icon name="heart" size={32} color="#000" style={styles.iconShadow} />
        <Icon name="heart" size={30} color={wishlistState ? '#ff6666' : '#fff'} />
      </TouchableOpacity>
      <View style={styles.quantityContainer}>
        <TouchableOpacity style={styles.quantityButton} onPress={decrementQuantity}>
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.quantityInput}
          keyboardType="numeric"
          value={String(quantity)}
          onChangeText={(text) => setQuantity(Number(text))}
        />
        <TouchableOpacity style={styles.quantityButton} onPress={incrementQuantity}>
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => alert('Added to cart')}>
        <Text style={styles.buttonText}>Add to Cart</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.buyNowButton]} onPress={() => alert('Proceed to buy')}>
        <Text style={styles.buttonText}>Buy Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  imageSlider: {
    width: '100%',
    height: 400,
    marginBottom: 20,
  },
  image: {
    width: 400,
    height: 400,
    borderRadius: 20,
    marginRight: 10,
  },
  detailsContainer: {
    paddingHorizontal: 10,
  },
  productName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 24,
    color: '#ff6666',
    marginBottom: 10,
  },
  productDescription: {
    fontSize: 18,
    color: '#666',
    lineHeight: 26,
    marginBottom: 20,
  },
  wishlistIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
  },
  iconShadow: {
    position: 'absolute',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  quantityInput: {
    width: 50,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginHorizontal: 10,
    textAlign: 'center',
    borderRadius: 5,
  },
  quantityButton: {
    width: 50,
    height: 40,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  quantityButtonText: {
    fontSize: 20,
    color: '#000',
  },
  button: {
    backgroundColor: '#ff6666',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
  buyNowButton: {
    backgroundColor: '#333',
  },
});
