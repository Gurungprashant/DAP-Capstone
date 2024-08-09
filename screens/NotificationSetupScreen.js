import React, { useState, useEffect } from 'react';
import { View, Text, Switch, Alert, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
import { MaterialIcons } from '@expo/vector-icons';

const NotificationSetupScreen = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    const getNotificationPermissions = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    };
    getNotificationPermissions();

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  const handleToggle = async () => {
    setIsEnabled((prevState) => {
      const newState = !prevState;
      if (newState) {
        console.log('Enabling notifications...');
        scheduleNotifications();
        startLoggingInterval();
      } else {
        console.log('Disabling notifications...');
        Notifications.cancelAllScheduledNotificationsAsync();
        stopLoggingInterval();
      }
      return newState;
    });
  };

  const scheduleNotifications = async () => {
    try {
      console.log('Scheduling notifications...');
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Hot Sale Alert!",
          body: "Check out our latest hot sales and special offers!",
        },
        trigger: {
          seconds: 10,
          repeats: true,
        },
      });
      console.log('Notification scheduled successfully with message: "Check out our latest hot sales and special offers!"');
    } catch (error) {
      console.error('Error scheduling notification:', error);
      Alert.alert('Error', 'Failed to schedule notifications.');
    }
  };

  const startLoggingInterval = () => {
    const id = setInterval(() => {
      console.log('Hot sale notification sent!');
    }, 10000);
    setIntervalId(id);
  };

  const stopLoggingInterval = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <MaterialIcons name="notifications-active" size={40} color="#ff5722" />
        <View style={styles.textContainer}>
          <Text style={styles.cardTitle}>Hot Sale Notifications</Text>
          <Text style={styles.cardDescription}>Receive alerts for the latest hot sales and special offers.</Text>
        </View>
        <Switch
          value={isEnabled}
          onValueChange={handleToggle}
          trackColor={{ false: "#767577", true: "#ff5722" }}
          thumbColor={isEnabled ? "#ffffff" : "#f4f3f4"}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardDescription: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
});

export default NotificationSetupScreen;
