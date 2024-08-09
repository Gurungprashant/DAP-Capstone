import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useWishlist } from './WishlistContext';
import { useNavigation } from '@react-navigation/native';
import { addToCart } from '../firebaseconfig/firebaseHelpers';
import { auth } from '../firebaseconfig/firebaseConfig';

export default function ProductDetailScreen({ route }) {
  const { product, categoryId, subCategoryId } = route.params;
  const [quantity, setQuantity] = useState(1);
  const { wishlist, toggleWishlistItem } = useWishlist();
  const [wishlistState, setWishlistState] = useState(false);
  const navigation = useNavigation();
  const user = auth.currentUser;

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
    if (!images || !Array.isArray(images) || images.length === 0) {
      return (
        <View style={styles.imageSlider}>
          <Text>No images available</Text>
        </View>
      );
    }

    return (
      <View style={styles.imageSliderContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.imageSlider}
        >
          {images.map((image, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image
                source={{ uri: image }}
                style={styles.image}
              />
              <TouchableOpacity
                style={styles.wishlistIcon}
                onPress={toggleWishlist}
                accessibilityLabel={wishlistState ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Icon name="heart" size={32} color={wishlistState ? '#ff6666' : '#ccc'} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        <TouchableOpacity
          style={styles.cartIcon}
          onPress={navigateToCart}
          accessibilityLabel="Go to cart"
        >
          <Icon name="shopping-cart" size={32} color="black" />
        </TouchableOpacity>
      </View>
    );
  };

  const incrementQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const handleAddToCart = async () => {
    if (user) {
      try {
        await addToCart(user.uid, {
          id: product.id,
          name: product.name,
          price: parseFloat(product.price) || 0,
          quantity,
          categoryId,
          subCategoryId,
          imageUrl: product.imageUrl && product.imageUrl.length > 0 ? product.imageUrl : 'https://via.placeholder.com/80',
        });
        alert('Added to cart');
      } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Failed to add to cart.');
      }
    } else {
      alert('You need to be logged in to add items to the cart.');
    }
  };

  const handleBuyNow = () => {
    navigation.navigate('CheckOutScreen', {
      cartItems: [{ ...product, quantity }]
    });
  };

  const navigateToCart = () => {
    navigation.navigate('CartTab');
  };

  const price = parseFloat(product.price) || 0;

  return (
    <View style={styles.container}>
      {product.imageUrl && renderImageSlider(product.imageUrl)}
      <View style={styles.detailsContainer}>
        <View style={styles.productHeader}>
          <Text style={styles.productName}>{product.name}</Text>
        </View>
        <Text style={styles.productPrice}>${price.toFixed(2)}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity style={styles.quantityButton} onPress={decrementQuantity}>
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.quantityInput}
          keyboardType="numeric"
          value={String(quantity)}
          onChangeText={(text) => setQuantity(Number(text))}
          accessibilityLabel="Quantity input"
        />
        <TouchableOpacity style={styles.quantityButton} onPress={incrementQuantity}>
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleAddToCart} accessibilityLabel="Add to cart">
        <Text style={styles.buttonText}>Add to Cart</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.buyNowButton]} onPress={handleBuyNow} accessibilityLabel="Buy Now">
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
  imageSliderContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  imageSlider: {
    width: '100%',
    height: 400,
  },
  imageContainer: {
    position: 'relative',
    width: 370,
    height: 400,
    marginRight: 3,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  wishlistIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 5,
    borderRadius: 20,
  },
  cartIcon: {
    position: 'absolute',
    bottom: 8,
    right: 13,
    zIndex: 1,
    backgroundColor: '#ffffff',
    padding: 5,
    borderRadius: 20,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 20,
    color: '#888',
    marginBottom: 10,
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
