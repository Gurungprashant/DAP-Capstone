import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';

import defaultAvatar from '../assets/avatar.png';

export default function SettingsScreen({ navigation }) {
  const [profileImageUri, setProfileImageUri] = useState(defaultAvatar);

  useEffect(() => {
    fetchProfileImage();
  }, []);

  const fetchProfileImage = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId'); // Assume you have user ID stored
      if (userId) {
        const url = await storage().ref(`profileImages/${userId}`).getDownloadURL();
        setProfileImageUri(url);
      }
    } catch (error) {
      console.log('Error fetching profile image:', error);
    }
  };

  const handleChoosePhoto = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const source = { uri: response.assets[0].uri };
        setProfileImageUri(source.uri);
        await uploadImage(source.uri);
      }
    });
  };

  const uploadImage = async (uri) => {
    try {
      const userId = await AsyncStorage.getItem('userId'); // Assume you have user ID stored
      const filename = uri.substring(uri.lastIndexOf('/') + 1);
      const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
      const task = storage().ref(`profileImages/${userId}`).putFile(uploadUri);

      task.on('state_changed', snapshot => {
        console.log('Progress:', (snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      });

      await task;
      Alert.alert('Photo uploaded!', 'Your profile photo has been uploaded to Firebase Cloud Storage!');
    } catch (e) {
      console.error('Error uploading image:', e);
      Alert.alert('Error', 'There was an error uploading your photo.');
    }
  };

  const handleSignOut = async () => {
    try {
      await AsyncStorage.clear();
      navigation.replace('SignIn');
    } catch (e) {
      console.error('Error clearing app data.', e);
    }
  };

  const confirmSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', onPress: handleSignOut },
      ],
      { cancelable: false }
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>Edit Profile</Text>
        <Image source={typeof profileImageUri === 'string' ? { uri: profileImageUri } : profileImageUri} style={styles.profileImage} />
        <TouchableOpacity style={styles.button} onPress={handleChoosePhoto}>
          <Text style={styles.buttonText}>Change Profile Photo</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.optionContainer}>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Account</Text>
          <Ionicons name="chevron-forward" size={20} color="#ff5722" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Security</Text>
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
    padding: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  profileSection: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#ff5722',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
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
