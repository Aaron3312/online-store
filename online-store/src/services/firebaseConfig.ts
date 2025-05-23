import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"
// Your web app's Firebase configuration
// Initialize Firebase

// src/firebase/config.js
// Import the functions you need from the SDKs you need

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDb6hR1rn-1qMFv6G7TOFiF0oUjVC-FOek",
  authDomain: "basurin-a8e8b.firebaseapp.com",
  projectId: "basurin-a8e8b",
  storageBucket: "basurin-a8e8b.firebasestorage.app",
  messagingSenderId: "364666183282",
  appId: "1:364666183282:web:cc4c2129a13137f645aceb",
  measurementId: "G-Q48MZQZ8CC"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
