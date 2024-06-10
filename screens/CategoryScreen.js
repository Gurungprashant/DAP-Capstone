import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchCategories } from '../firebaseconfig/firebaseHelpers';

export default function CategoryScreen() {
  const [categories, setCategories] = useState([]);
  const navigation = useNavigation();

}

