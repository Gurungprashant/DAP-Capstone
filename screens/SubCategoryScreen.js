// screens/SubCategoryScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchSubCategories } from '../firebaseconfig/firebaseHelpers';

export default function SubCategoryScreen({ route }) {
  const { categoryId } = route.params;
  const [subCategories, setSubCategories] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchSubCategories(categoryId).then(data => setSubCategories(data));
  }, [categoryId]);

  const handleSubCategoryPress = (subCategoryId) => {
    navigation.navigate('Product', { categoryId, subCategoryId });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={subCategories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => handleSubCategoryPress(item.id)}>
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
  item: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
