import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { showMessage } from 'react-native-flash-message';

const ChangePasswordScreen = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  const reauthenticate = async (currentPassword) => {
    const auth = getAuth();
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    return reauthenticateWithCredential(user, credential);
  };

  const handleChangePassword = async () => {
    setError(''); // Clear previous errors

    // Basic validation
    if (!currentPassword || !newPassword) {
      setError('Both fields are required.');
      showMessage({
        message: 'Both fields are required.',
        type: 'warning',
      });
      return;
    }

    try {
      await reauthenticate(currentPassword);
      const auth = getAuth();
      const user = auth.currentUser;
      await updatePassword(user, newPassword);
      showMessage({
        message: 'Password changed successfully',
        type: 'success',
      });
      navigation.goBack();
    } catch (error) {
      let errorMessage = 'An error occurred. Please try again.';
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'The current password is incorrect.';
      }
      showMessage({
        message: errorMessage,
        type: 'danger',
      });
      setError(errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Text style={styles.label}>Current Password:</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
        placeholder="Enter your current password"
      />
      <Text style={styles.label}>New Password:</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="Enter your new password"
      />
      <Button title="Change Password" onPress={handleChangePassword} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    marginVertical: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    fontSize: 16,
    paddingVertical: 8,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 16,
  },
});

export default ChangePasswordScreen;
