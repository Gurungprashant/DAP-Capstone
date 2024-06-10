import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, TouchableHighlight } from 'react-native';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebaseconfig/firebaseConfig';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome'; // Ensure this package is installed

export default function SignUpScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

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
        setFullName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        navigation.navigate('SignIn');
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
    marginBottom: 30, // Margin below the title
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
    paddingRight: 45, // Make room for the icon
    borderRadius: 25,
    backgroundColor: '#fff',
    marginBottom: 10, // Increased margin bottom for each input
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
    marginBottom: 10, // Added margin to the password container as well
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
    marginTop: 10, // Margin above the button
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginPrompt: {
    marginTop: 20, // Margin above the login prompt
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff5722',
  },
  loginLink: {
    textDecorationLine: 'underline',
  },
});

