import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseconfig/firebaseConfig';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function OrderHistoryScreen() {
  const [orders, setOrders] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;
  const navigation = useNavigation();

  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        try {
          const ordersCollection = collection(db, 'orders');
          const q = query(ordersCollection, where('userId', '==', user.uid));
          const querySnapshot = await getDocs(q);
          const fetchedOrders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setOrders(fetchedOrders);
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      };

      fetchOrders();
    }
  }, [user]);

  const formatPrice = (price) => {
    const num = typeof price === 'number' ? price : parseFloat(price);
    return !isNaN(num) ? num.toFixed(2) : 'N/A';
  };

  const handleOrderPress = (order) => {
    navigation.navigate('Order Details', { order });
  };

  const renderOrderItem = ({ item }) => {

    const total = typeof item.total === 'number' ? item.total : parseFloat(item.total);
    const formattedTotal = !isNaN(total) ? total.toFixed(2) : 'N/A';

    const firstProductName = item.items.length > 0 ? item.items[0].name : 'No items';

    return (
      <TouchableOpacity onPress={() => handleOrderPress(item)} style={styles.orderItem}>
        <View style={styles.boxContainer}>
          <Text style={styles.orderDate}>{new Date(item.date).toLocaleDateString()}</Text>
          <View style={styles.detailsContainer}>
            <Text style={styles.total}>${formattedTotal}</Text>
            <Icon name="chevron-forward" size={20} color="#888" style={styles.arrow} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {orders.length === 0 ? (
        <Text style={styles.noOrdersText}>No orders found.</Text>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={item => item.id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  orderItem: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  boxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderDate: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6666',
  },
  arrow: {
    marginLeft: 10,
  },
  noOrdersText: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
  },
});
