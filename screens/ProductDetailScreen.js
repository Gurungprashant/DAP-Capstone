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
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>${price.toFixed(2)}</Text>
        <Text style={styles.productDescription}>{product.description}</Text>
      </View>
      <TouchableOpacity
        style={styles.wishlistIcon}
        onPress={toggleWishlist}
        accessibilityLabel={wishlistState ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Icon name="heart" size={32} color="#000" style={styles.iconShadow} />
        <Icon name="heart" size={30} color={wishlistState ? '#ff6666' : '#fff'} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.cartIcon}
        onPress={navigateToCart}
        accessibilityLabel="Go to cart"
      >
        <Icon name="shopping-cart" size={32} color="#000" style={styles.iconShadow} />
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
    right: 70,
    zIndex: 10,
  },
  cartIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  iconShadow: {
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
