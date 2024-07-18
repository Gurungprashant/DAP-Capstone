import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useWishlist } from './WishlistContext';
import { useNavigation } from '@react-navigation/native';
import { addToCart } from '../firebaseconfig/firebaseHelpers';  // Import addToCart function

export default function ProductDetailScreen({ route }) {
  const { product, categoryId, subCategoryId } = route.params;
  const [quantity, setQuantity] = useState(1);
  const { wishlist, toggleWishlistItem } = useWishlist();
  const [wishlistState, setWishlistState] = useState(false);
  const navigation = useNavigation();

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

  const handleAddToCart = async () => {
    const userId = 'userId1'; // Replace with actual user ID
    await addToCart(userId, { ...product, quantity });
    alert('Added to cart');
  };

  const handleBuyNow = () => {
    navigation.navigate('CheckOutScreen', {
      product,
      quantity,
      categoryId,
      subCategoryId
    });
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
      <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
        <Text style={styles.buttonText}>Add to Cart</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.buyNowButton]} onPress={handleBuyNow}>
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
    borderRadius: 10,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 20,
    color: '#888',
    marginBottom: 10,
  },
  productDescription: {
    fontSize: 16,
    color: '#666',
  },
  wishlistIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  iconShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  quantityButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  quantityButtonText: {
    fontSize: 20,
  },
  quantityInput: {
    width: 50,
    textAlign: 'center',
    fontSize: 18,
    marginHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  button: {
    backgroundColor: '#ff6666',
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
  buyNowButton: {
    backgroundColor: '#ff9933',
  },
});
