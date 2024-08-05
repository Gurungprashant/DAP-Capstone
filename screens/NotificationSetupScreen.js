import React, { useState, useEffect } from 'react';
import { View, Text, Switch, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';

const NotificationSetupScreen = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    // Request permissions on component mount
    const getNotificationPermissions = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    };
    getNotificationPermissions();

    // Cleanup interval on component unmount
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
    }, 10000); // 10000 milliseconds = 10 seconds
    setIntervalId(id);
  };

  const stopLoggingInterval = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  };

  useEffect(() => {
    const getNotificationPermissions = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    };
    getNotificationPermissions();
  }, []);

  return (
    <View>
      <Text>Enable Hot Sale Notifications</Text>
      <Switch
        value={isEnabled}
        onValueChange={handleToggle}
      />
    </View>
  );
};

export default NotificationSetupScreen;
