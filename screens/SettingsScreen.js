// SettingsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { fetchProfileImage, defaultProfileImageUrl } from '../firebaseconfig/firebaseHelpers'; // Adjust path if necessary
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function SettingsScreen({ navigation }) {
  const [profileImageUri, setProfileImageUri] = useState(defaultProfileImageUrl);
  const [fullName, setFullName] = useState('');
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      // Fetch profile image URL
      fetchProfileImage(user.uid)
        .then((url) => setProfileImageUri(url))
        .catch(() => {
          console.log('Profile image not found, using default user icon.');
          setProfileImageUri(defaultProfileImageUrl);
        });

      // Fetch full name
      setFullName(user.displayName || 'No Name');
    }
  }, [user]);

  const handleChoosePhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      if (user) {
        try {
          const downloadURL = await uploadProfileImage(user.uid, uri);
          setProfileImageUri(downloadURL);
        } catch (error) {
          console.error('Error uploading profile image:', error);
        }
      }
    }
  };

  const handleRemovePhoto = async () => {
    if (user) {
      try {
        await removeProfileImage(user.uid);
        setProfileImageUri(defaultProfileImageUrl);
      } catch (error) {
        console.error('Error removing profile image:', error);
      }
    }
  };

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
      <View style={styles.header}>
      </View>
      <View style={styles.profileSection}>
        <Image source={{ uri: profileImageUri }} style={styles.profileImage} />
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{fullName}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleChoosePhoto}>
          <Text style={styles.buttonText}>Change Profile Photo</Text>
        </TouchableOpacity>
        {profileImageUri !== defaultProfileImageUrl && (
          <TouchableOpacity style={styles.button} onPress={handleRemovePhoto}>
            <Text style={styles.buttonText}>Remove Profile Photo</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.optionContainer}>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Account')}>
          <Text style={styles.optionText}>Account</Text>
          <Ionicons name="chevron-forward" size={20} color="#ff5722" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('ChangePassword')}>
          <Text style={styles.optionText}>Password Settings</Text>
          <Ionicons name="chevron-forward" size={20} color="#ff5722" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('HelpSupport')}>
          <Text style={styles.optionText}>Help & Support</Text>
          <Ionicons name="chevron-forward" size={20} color="#ff5722" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('About')}>
          <Text style={styles.optionText}>About</Text>
          <Ionicons name="chevron-forward" size={20} color="#ff5722" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={confirmSignOut}>
          <Text style={styles.optionText}>Sign Out</Text>
          <Ionicons name="log-out-outline" size={20} color="#ff5722" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileSection: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
    marginBottom: 10,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    backgroundColor: '#ff5722',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  optionContainer: {
    paddingVertical: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
});
