import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, ScrollView, TextInput, TouchableOpacity, Image, Dimensions, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { fetchCategories, fetchImages, fetchNewOffers } from '../firebaseconfig/firebaseHelpers';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [newOffers, setNewOffers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef();
  const navigation = useNavigation();

  const { width } = Dimensions.get('window');
  const aspectRatio = 16 / 9;

  useEffect(() => {
    async function fetchImagesFromFirebase() {
      try {
        const imagesFromFirebase = await fetchImages();
        setImages(imagesFromFirebase);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    }
    fetchImagesFromFirebase();
  }, []);

  useEffect(() => {
    async function fetchOffersFromFirebase() {
      try {
        const offersFromFirebase = await fetchNewOffers();
        setNewOffers(offersFromFirebase);
      } catch (error) {
        console.error('Error fetching new offers:', error);
      }
    }
    fetchOffersFromFirebase();
  }, []);

  useEffect(() => {
    async function fetchDataFromFirebase() {
      try {
        const categoriesFromFirebase = await fetchCategories();
        setCategories(categoriesFromFirebase);
        setFilteredCategories(categoriesFromFirebase);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    fetchDataFromFirebase();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter((category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchQuery, categories]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < images.length - 1) {
        scrollViewRef.current.scrollTo({
          x: (currentIndex + 1) * width,
          animated: true,
        });
        setCurrentIndex((prevIndex) => prevIndex + 1);
      } else {
        scrollViewRef.current.scrollTo({
          x: 0,
          animated: true,
        });
        setCurrentIndex(0);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, images.length, width]);

  const handleCategoryPress = (categoryId) => {
    navigation.navigate('SubCategoryScreen', { categoryId });
  };

  const renderOfferItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.offerItem} 
      onPress={() => navigation.navigate('ProductListScreen', { offerId: item.id })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.offerImage} />
      <Text style={styles.offerTitle}>{item.title}</Text>
      <Text style={styles.offerDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#000" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search categories..."
          placeholderTextColor="#666"
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
        />
      </View>

      {/* New Offers Section */}
      <View style={styles.offersContainer}>
        <FlatList
          data={newOffers}
          renderItem={renderOfferItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.offersList}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Categories Section */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
        {filteredCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryItem}
            onPress={() => handleCategoryPress(category.id)}
          >
            <Text style={styles.categoryText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Background Image Carousel */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(event) => {
          const contentOffset = event.nativeEvent.contentOffset.x;
          const index = Math.floor(contentOffset / width);
          setCurrentIndex(index);
        }}
        style={styles.imageScrollContainer}
      >
        {images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image.url }}
            style={[styles.image, { width: width, height: width / aspectRatio }]}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    padding: 2,
    alignItems: 'center',
  },
  searchIcon: {
    marginLeft: 10,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 18,
  },
  imageScrollContainer: {
    marginBottom: 60,
  },
  image: {
    borderRadius: 5,
    margin: 0,
  },
  offersContainer: {
    width: '100%',
    marginBottom: 20,
  },
  offersList: {
    marginTop: 10,
  },
  offerItem: {
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    width: Dimensions.get('window').width * 1,
    height: Dimensions.get('window').width * 0.7,
  },
  offerImage: {
    width: '100%',
    height: '80%',
  },
  offerTitle: {
    fontSize: 20,
    fontWeight: 'bold',

  },
  offerDescription: {
    fontSize: 18,
    marginHorizontal: 10,
    marginBottom: 10,
    color: '#666',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  categoryItem: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 5,
    backgroundColor: '#ddd',
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 19,
    color: '#000',
  },
});
