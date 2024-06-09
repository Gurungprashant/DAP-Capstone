import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { fetchSubCategories } from '../firebaseconfig/firebaseHelpers'; // Adjust the import based on your helper file path

export default function SubCategoryScreen({ route }) {
  const { categoryId, categoryName } = route.params;
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    fetchSubCategories(categoryId).then(data => setSubCategories(data));
  }, [categoryId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{categoryName} SubCategories</Text>
      <FlatList
        data={subCategories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#ff5722',
  },
  item: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
