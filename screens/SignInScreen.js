// screens/SignInScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, TouchableHighlight } from 'react-native';
import { auth } from '../firebaseconfig/firebaseConfig';
import { signInWithEmailAndPassword } from "firebase/auth";
import Toast from 'react-native-toast-message';

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    if (!email.trim() || !password.trim()) {
      Toast.show({
        type: 'error',
        text1: 'All fields are required!'
      });
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Signed in successfully!'
        });
        // Clear text fields after successful sign-in
        setEmail('');
        setPassword('');
        // Navigate to Home screen
        navigation.navigate('Home');
      })
      .catch(error => {
        Toast.show({
          type: 'error',
          text1: error.message
        });
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
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
      <TouchableHighlight style={styles.button} underlayColor="#ff7043" onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableHighlight>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.linkText}>Create an Account</Text>
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
    marginTop: 180,
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
  linkText: {
    color: '#ff5722',
    marginTop: 20,
    textDecorationLine: 'underline',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
