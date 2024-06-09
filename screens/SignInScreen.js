import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, TouchableHighlight } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseconfig/firebaseConfig';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome'; // Ensure this package is installed

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSignIn = () => {
    if (email === '' || password === '') {
      Toast.show({
        type: 'error',
        text1: 'Please fill in all fields.',
      });
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Signed in successfully!',
        });
        setEmail('');
        setPassword('');
        navigation.navigate('Main'); // Navigate to the Main tab navigator
      })
      .catch(error => {
        Toast.show({
          type: 'error',
          text1: error.message,
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
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
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
  },
  input: {
    width: '100%',
    height: 50,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    paddingLeft: 20,
    paddingRight: 45, // make room for the icon
    borderRadius: 25,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
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
