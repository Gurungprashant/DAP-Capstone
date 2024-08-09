import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, TouchableHighlight, Image } from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, storage } from '../firebaseconfig/firebaseConfig';
import { showMessage } from 'react-native-flash-message';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

const defaultProfilePictureUrl = 'https://firebasestorage.googleapis.com/v0/b/capstone-project-1234f.appspot.com/o/profileImages%2Fdefault-profile.png?alt=media&token=89f014a3-b042-4624-9279-8cc0867030ca';

export default function SignUpScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const showError = (message) => {
    showMessage({
      message: "Error",
      description: message,
      type: "danger",
    });
  };

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      showError('Passwords do not match.');
      return;
    }

    if (email === '' || password === '' || fullName === '') {
      showError('Please fill in all fields.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let profileImageUrl = defaultProfilePictureUrl;

      if (selectedImage) {
        profileImageUrl = await uploadProfileImage(user.uid, selectedImage.uri);
      }

      await updateProfile(user, { displayName: fullName, photoURL: profileImageUrl });

      showMessage({
        message: "Success",
        description: "User account created!",
        type: "success",
      });

      setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setSelectedImage(null);

      navigation.navigate('SignIn');
    } catch (error) {
      showError(error.message);
    }
  };

  const uploadProfileImage = async (userId, uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `profileImages/${userId}`);

    try {
      await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(storageRef);
      return downloadUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image.');
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        autoCapitalize="none"
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        autoCapitalize="none"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity onPress={pickImage}>
        <Text style={styles.linkText}>Pick a Profile Image</Text>
      </TouchableOpacity>
      {selectedImage && (
        <Image source={{ uri: selectedImage.uri }} style={styles.image} />
      )}
      <TouchableHighlight style={styles.button} underlayColor="#ff7043" onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableHighlight>
      <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.linkText}>Already have an account? Sign In</Text>
      </TouchableOpacity>
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
    marginBottom: 30,
    fontWeight: 'bold',
    color: '#ff5722',
  },
  input: {
    width: '100%',
    height: 50,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 25,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#ff5722',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#ff5722',
    marginTop: 20,
    textDecorationLine: 'underline',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 20,
  },
});
