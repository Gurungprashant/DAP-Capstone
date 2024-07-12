import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, ScrollView, TextInput, TouchableOpacity, Image, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { fetchCategories, fetchImages } from '../firebaseconfig/firebaseHelpers';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const navigation = useNavigation();
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef();

  const handleSearch = (text) => {
    setSearchQuery(text.toLowerCase());
  };

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
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [currentIndex, images.length]);

  // Get the dimensions of the screen
  const { width } = Dimensions.get('window');

  // Define the aspect ratio for the images
  const aspectRatio = 16 / 9; // Adjust as needed

  useEffect(() => {
    async function fetchDataFromFirebase() {
      try {
        const categoriesFromFirebase = await fetchCategories();
        setCategories(categoriesFromFirebase);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    fetchDataFromFirebase();
  }, []);

  const handleCategoryPress = (categoryId) => {
    navigation.navigate('SubCategoryScreen', { categoryId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#000" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search here..."
          placeholderTextColor="#666"
          onChangeText={(text) => setSearchQuery(text.toLowerCase())}
        />
      </View>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(event) => {
          // Calculate the current index based on the scroll position
          const contentOffset = event.nativeEvent.contentOffset.x;
          const index = Math.floor(contentOffset / width);
          setCurrentIndex(index);
        }}
        style={styles.imageScrollContainer} // Add style for ScrollView
      >
        {images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image.url }}
            style={[styles.image, { width: width - 20, height: (width - 500) / aspectRatio }]} // Adjust margin and padding as needed
            resizeMode="cover" // Make sure the image covers the entire area
          />
        ))}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryItem}
            onPress={() => handleCategoryPress(category.id)}
          >
  
            <Text style={styles.categoryText}>{category.name}</Text>
          </TouchableOpacity>
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
    paddingTop: 40,

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
    fontSize: 16,
  },
  image: {
    borderRadius: 5,
    margin: 4,
    backgroundColor:'red'
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 5,
    paddingVertical: 10, // Add padding to ensure space around the category items
  },  
  categoryItem: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 5,
    backgroundColor: '#ddd',
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 16,
    color: '#000',
  },
});
