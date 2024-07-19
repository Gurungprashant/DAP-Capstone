import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, TouchableHighlight, Image } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, storage } from '../firebaseconfig/firebaseConfig';
import { showMessage } from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { uploadProfileImage } from '../firebaseconfig/firebaseHelpers'; // Import the helper function

export default function SignUpScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Default profile picture URL
  const defaultProfilePictureUrl = 'https://example.com/defaultProfilePicture.png'; // Adjust this URL to your default image path

  const showError = (message) => {
    showMessage({
      message: "Error",
      description: message,
      type: "danger",
    });
  };

  const handleSignUp = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      showError('All fields are required!');
      return;
    }
  
    if (password !== confirmPassword) {
      showError('Passwords do not match!');
      return;
    }
  
    if (password.length < 6) {
      showError('Password should be at least 6 characters long!');
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Use the default profile picture URL if no image was selected
      let profileImageUrl = defaultProfilePictureUrl;
  
      if (selectedImage) {
        profileImageUrl = await uploadProfileImage(user.uid, selectedImage.uri);
      }
  
      // Update user profile with selected or default picture
      await user.updateProfile({ displayName: fullName, photoURL: profileImageUrl });
  
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
  
      // Navigate to Sign-In screen
      navigation.navigate('SignInScreen');
    } catch (error) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          showError('That email address is already in use!');
          break;
        case 'auth/invalid-email':
          showError('The email address is not valid. Please enter a valid email address.');
          break;
        case 'auth/weak-password':
          showError('The password is too weak. Please enter a stronger password.');
          break;
        default:
          showError(error.message);
          break;
      }
    }
  };
  

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showError('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
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
        autoCapitalize="words"
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
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Password"
          secureTextEntry={!passwordVisible}
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.icon}
          onPress={() => setPasswordVisible(!passwordVisible)}
        >
          <Icon name={passwordVisible ? 'eye' : 'eye-slash'} size={20} color="#777" />
        </TouchableOpacity>
      </View>
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Confirm Password"
          secureTextEntry={!confirmPasswordVisible}
          autoCapitalize="none"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity
          style={styles.icon}
          onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
        >
          <Icon name={confirmPasswordVisible ? 'eye' : 'eye-slash'} size={20} color="#777" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
        <Text style={styles.imagePickerText}>Pick Profile Picture</Text>
      </TouchableOpacity>
      {selectedImage && (
        <Image source={{ uri: selectedImage.uri }} style={styles.selectedImage} />
      )}
      <TouchableHighlight style={styles.button} underlayColor="#ff7043" onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableHighlight>
      <View style={styles.loginPrompt}>
        <Text style={styles.loginText}>Have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.loginLink}>Log in</Text>
        </TouchableOpacity>
      </View>
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
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    paddingLeft: 20,
    paddingRight: 45,
    borderRadius: 25,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
    marginBottom: 10,
  },
  icon: {
    position: 'absolute',
    right: 15,
    padding: 10,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#ff5722',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginPrompt: {
    flexDirection: 'row',
    marginTop: 20,
  },
  loginText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff5722',
  },
  loginLink: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff5722',
    textDecorationLine: 'underline',
  },
  imagePickerButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#ff5722',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  imagePickerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 20,
  },
});