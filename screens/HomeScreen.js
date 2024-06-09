import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (text) => {
    setSearchQuery(text.toLowerCase());
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#000" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search here..."
          placeholderTextColor="#666"
          onChangeText={handleSearch}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start', // Align items at the top
    backgroundColor: '#f5f5f5',
    paddingTop: 40, // Add padding to space out from the top
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
    width: '90%', // Adjust the width as needed
  },
  searchIcon: {
    marginLeft: 10, // Adjust margin to space out the icon
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10, // Adjust padding for input field
    fontSize: 16,
  },
});
