import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';

export default function HelpSupportScreen() {
  const handleOpenURL = (url) => {
    Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Help & Support</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.subtitle}>Frequently Asked Questions</Text>
        <Text style={styles.content}>
          Find answers to common questions about orders, shipping, returns, and more on our FAQ page.
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => handleOpenURL('http://yourwebsite.com/faq')}>
          <Text style={styles.buttonText}>Visit FAQ</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <Text style={styles.subtitle}>Customer Service</Text>
        <Text style={styles.content}>
          Need help? Contact our customer service for support on orders, returns, and account questions.
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => handleOpenURL('mailto:dap@fashionapp.com')}>
          <Text style={styles.buttonText}>Email Support</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <Text style={styles.subtitle}>Technical Support</Text>
        <Text style={styles.content}>
          Experiencing technical issues? Reach out to our technical support team for assistance.
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => handleOpenURL('http://yourwebsite.com/support')}>
          <Text style={styles.buttonText}>Contact Tech Support</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <Text style={styles.subtitle}>Order Tracking</Text>
        <Text style={styles.content}>
          Track the status of your orders by visiting our order tracking page.
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => handleOpenURL('http://yourwebsite.com/track')}>
          <Text style={styles.buttonText}>Track Order</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <Text style={styles.subtitle}>Feedback</Text>
        <Text style={styles.content}>
          Your feedback is important to us. Please let us know how we can improve your experience.
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => handleOpenURL('http://yourwebsite.com/feedback')}>
          <Text style={styles.buttonText}>Submit Feedback</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    backgroundColor: '#6200ea',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  subtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#6200ea',
  },
  content: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#6200ea',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
