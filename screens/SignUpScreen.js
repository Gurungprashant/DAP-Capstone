// screens/SignUpScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, TouchableHighlight, Alert } from 'react-native';
import { auth } from '../firebaseconfig/firebaseConfig';
import { createUserWithEmailAndPassword } from "firebase/auth";
import Toast from 'react-native-toast-message';

export default function SignUpScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = () => {
    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Toast.show({
        type: 'error',
        text1: 'All fields are required!'
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Passwords do not match!'
      });
      return;
    }

    if (password.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Password should be at least 6 characters long!'
      });
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'User account created!'
        });
        // Clear text fields after successful sign-up
        setFullName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        // Optionally navigate to the main screen or home screen of your app
        navigation.navigate('SignIn'); // Example of navigating back to sign in
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          Toast.show({
            type: 'error',
            text1: 'That email address is already in use!'
          });
        } else if (error.code === 'auth/invalid-email') {
          Toast.show({
            type: 'error',
            text1: 'That email address is invalid!'
          });
        } else {
          Toast.show({
            type: 'error',
            text1: error.message
          });
        }
      });
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
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        autoCapitalize="none"
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry={true}
        autoCapitalize="none"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableHighlight style={styles.button} underlayColor="#ff7043" onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableHighlight>
      <Text style={styles.loginPrompt}>
        Have an account?{' '}
        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.loginLink}>Log in</Text>
        </TouchableOpacity>
      </Text>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
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
  loginPrompt: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff5722',
  },
  loginLink: {
    textDecorationLine: 'underline',
  },
});
