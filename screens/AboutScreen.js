import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>About Us</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.content}>
          Welcome to DAP FashionApp! We are committed to bringing you the latest trends in fashion.
          Our app offers a seamless shopping experience, with a wide range of products to choose from.
          Thank you for choosing us for your fashion needs!
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Our Mission</Text>
        <Text style={styles.content}>
          Our mission is to make fashion accessible to everyone, everywhere. We strive to provide
          the best products at competitive prices while ensuring a user-friendly experience.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Our Vision</Text>
        <Text style={styles.content}>
          Our vision is to become the leading platform in the fashion industry, known for innovation,
          quality, and customer satisfaction. We aim to continuously evolve and adapt to the changing
          trends and needs of our customers.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Our Team</Text>
        <Text style={styles.content}>
        FashionApp is the brainchild of a dedicated team of fashion enthusiasts, tech experts, and customer service professionals. We are passionate about what we do and are committed to delivering the best shopping experience. This app was developed by Dipesh, Anjila, and Prashant (DAP).
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Sustainability</Text>
        <Text style={styles.content}>
          We are committed to sustainability and ethical practices. Our products are sourced
          responsibly, and we aim to minimize our environmental footprint through various
          eco-friendly initiatives.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Contact Us</Text>
        <Text style={styles.content}>
          Have questions or feedback? We'd love to hear from you! Reach out to our support team
          at dap@fashionapp.com or call us at (123) 456-7890.
        </Text>
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
});

