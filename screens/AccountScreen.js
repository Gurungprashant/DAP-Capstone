import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getAuth, updateProfile, updateEmail } from 'firebase/auth';
import { uploadProfileImage, fetchProfileImage, removeProfileImage, defaultProfileImageUrl } from '../firebaseconfig/firebaseHelpers';

const AccountSettingsScreen = ({ navigation, route }) => {
  const [profileImageUri, setProfileImageUri] = useState(defaultProfileImageUrl);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
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

  const handleUpdateProfile = async () => {
    if (user) {
      try {
        if (newName) {
          await updateProfile(user, { displayName: newName });
        }
        if (newEmail) {
          await updateEmail(user, newEmail);
        }
        setFullName(newName || fullName);
        setEmail(newEmail || email);
        Alert.alert('Success', 'Profile updated successfully');
      } catch (error) {
        console.error('Error updating profile:', error);
        Alert.alert('Error', 'Failed to update profile.');
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileSection}>
        <Image source={{ uri: profileImageUri }} style={styles.profileImage} />
        <TouchableOpacity style={styles.button} onPress={handleChoosePhoto}>
          <Text style={styles.buttonText}>Change Profile Photo</Text>
        </TouchableOpacity>
        {profileImageUri !== defaultProfileImageUrl && (
          <TouchableOpacity style={styles.button} onPress={handleRemovePhoto}>
            <Text style={styles.buttonText}>Remove Profile Photo</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.formSection}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={newName}
          onChangeText={setNewName}
          placeholder={fullName}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={newEmail}
          onChangeText={setNewEmail}
          placeholder={email}
        />
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
          <Text style={styles.updateButtonText}>Update Profile</Text>
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
  formSection: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
  },
  updateButton: {
    backgroundColor: '#ff5722',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default AccountSettingsScreen;
