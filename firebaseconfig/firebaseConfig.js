// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from "firebase/storage"; // Import storage


  const firebaseConfig = {
    apiKey: "AIzaSyB72el4z1XeaHO1tIxNXGYXxJRztO4D88Q",
    authDomain: "capstone-project-1234f.firebaseapp.com",
    projectId: "capstone-project-1234f",
    storageBucket: "capstone-project-1234f.appspot.com",
    messagingSenderId: "931108053797",
    appId: "1:931108053797:web:d8038edaee5562bd75f0cc"
  };

  const app = initializeApp(firebaseConfig);
  const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
  const db = getFirestore(app); // Initialize Firestore
  const storage = getStorage(app); // Initialize Storage
  
  export { auth, db, storage };