import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>WELCOME TO DAP_FASHION</Text>
      <Text style={styles.title}>Welcome to the Home Screen!</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff5722',
    marginBottom: 10,
    position: 'absolute',
    top: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: '#000000',
    letterSpacing: 1.5,
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    lineHeight: 28
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ff5722',
  },
});
