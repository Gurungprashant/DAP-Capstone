import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { fetchProfileImage, defaultProfileImageUrl } from '../firebaseconfig/firebaseHelpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';

const SettingsScreen = () => {
  const [profileImageUri, setProfileImageUri] = useState(defaultProfileImageUrl);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      fetchProfileImage(user.uid)
        .then((url) => setProfileImageUri(url))
        .catch(() => setProfileImageUri(defaultProfileImageUrl));

      setFullName(user.displayName || 'No Name');
      setEmail(user.email || '');
    }
  }, [user, route.params?.updated]);

  const handleSignOut = async () => {
    try {
      await AsyncStorage.clear();
      navigation.replace('SignIn');
    } catch (error) {
      console.error('Error clearing app data:', error);
    }
  };

  const confirmSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', onPress: handleSignOut }
      ],
      { cancelable: false }
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileSection}>
        <View style={styles.profileInfoContainer}>
          <Image source={{ uri: profileImageUri }} style={styles.profileImage} />
          <View style={styles.profileDetails}>
            <Text style={styles.userName}>{fullName}</Text>
            <Text style={styles.userEmail}>{email}</Text>
            <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('Account')}>
          <Text style={styles.editButtonText}>Edit Account</Text>
        </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.optionContainer}>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Notifications')}>
          <Text style={styles.optionText}>Notification Settings</Text>
          <Ionicons name="chevron-forward" size={20} color="#ff5722" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Order History')}>
          <Text style={styles.optionText}>Order History</Text>
          <Ionicons name="chevron-forward" size={20} color="#ff5722" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('ChangePassword')}>
          <Text style={styles.optionText}>Change Password</Text>
          <Ionicons name="chevron-forward" size={20} color="#ff5722" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Help & Support')}>
          <Text style={styles.optionText}>Help & Support</Text>
          <Ionicons name="chevron-forward" size={20} color="#ff5722" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('About')}>
          <Text style={styles.optionText}>About</Text>
          <Ionicons name="chevron-forward" size={20} color="#ff5722" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={confirmSignOut}>
          <Text style={styles.optionText}>Sign Out</Text>
          <Ionicons name="chevron-forward" size={20} color="#ff5722" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
    marginRight: 20,
  },
  profileDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 18,
    color: '#777',
  },
  editButtonText: {
    color: 'blue',
    fontSize: 18,
  },
  optionContainer: {
    marginTop: 20,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: {
    fontSize: 18,
  },
});

export default SettingsScreen;
