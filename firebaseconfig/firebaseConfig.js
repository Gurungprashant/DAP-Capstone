import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB72el4z1XeaHO1tIxNXGYXxJRztO4D88Q",
  authDomain: "capstone-project-1234f.firebaseapp.com",
  projectId: "capstone-project-1234f",
  storageBucket: "capstone-project-1234f.appspot.com",
  messagingSenderId: "931108053797",
  appId: "1:931108053797:web:d8038edaee5562bd75f0cc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth };
