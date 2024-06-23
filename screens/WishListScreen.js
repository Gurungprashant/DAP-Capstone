import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useWishlist } from './WishlistContext';

export default function WishListScreen({ navigation }) {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <View style={styles.container}>
      <FlatList
        data={wishlist}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.productItem}
            onPress={() => navigation.navigate('ProductDetailScreen', { product: item })}
          >
            <Image source={{ uri: item.imageUrl[0] }} style={styles.image} />
            <View style={styles.infoContainer}>
              <Text style={styles.productText}>{item.name}</Text>
              <Text style={styles.productPrice}>${item.price}</Text>
              <TouchableOpacity onPress={() => removeFromWishlist(item.id)}>
                <Text style={styles.removeButton}>Remove</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
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
  productItem: {
    flexDirection: 'row',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  productText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 16,
    color: '#888',
    marginBottom: 5,
  },
  removeButton: {
    color: 'red',
  },
});
