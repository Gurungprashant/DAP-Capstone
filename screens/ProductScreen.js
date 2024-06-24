import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { fetchProducts } from '../firebaseconfig/firebaseHelpers';
import { useNavigation } from '@react-navigation/native';
import { useWishlist } from './WishlistContext';

export default function ProductScreen({ route }) {
  const { categoryId, subCategoryId } = route.params;
  const [products, setProducts] = useState([]);
  const { wishlist, toggleWishlistItem } = useWishlist();
  const navigation = useNavigation();

  useEffect(() => {
    async function loadProducts() {
      try {
        const productsFromFirebase = await fetchProducts(categoryId, subCategoryId);
        setProducts(productsFromFirebase);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
    loadProducts();
  }, [categoryId, subCategoryId]);

  const { width } = Dimensions.get('window');
  const itemWidth = (width - 35) / 2;

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

  const isInWishlist = (productId) => {
    return wishlist && Array.isArray(wishlist) ? wishlist.some(item => item.productId === productId) : false;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.wishlistButton}
        onPress={() => navigation.navigate('WishListTab')}
      >
        <Text style={styles.wishlistButtonText}>Go to Wishlist</Text>
      </TouchableOpacity>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        key={2}
        renderItem={({ item }) => (
          <View style={[styles.productItem, { width: itemWidth }]}>
            <View style={styles.imageContainer}>
              {item.imageUrl && item.imageUrl.length > 0 && renderImageSlider(item.imageUrl)}
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('ProductDetailScreen', { product: item, categoryId, subCategoryId })}>
              <Text style={styles.productText}>{item.name}</Text>
            </TouchableOpacity>
            <Text style={styles.productPrice}>${item.price}</Text>
            <TouchableOpacity
              style={styles.wishlistIcon}
              onPress={() => toggleWishlistItem({ categoryId, subCategoryId, productId: item.id })}
            >
              <Icon name="heart" size={22} color="#000" style={styles.iconShadow} />
              <Icon name="heart" size={20} color={isInWishlist(item.id) ? '#ff6666' : '#fff'} />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  wishlistButton: {
    backgroundColor: '#ff6666',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  wishlistButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  flatListContainer: {
    justifyContent: 'space-between',
  },
  productItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 150,
    marginBottom: 10,
  },
  imageSlider: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginRight: 5,
  },
  productText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 16,
    color: '#888',
  },
  wishlistIcon: {
    position: 'absolute',
    top: 125,
    right: 13,
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
