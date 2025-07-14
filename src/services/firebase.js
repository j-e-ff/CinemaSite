// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyBppXO3u_DZi9fi2nEXo_S_oo8oYJEkQFk",
  authDomain: "moviesite-3b722.firebaseapp.com",
  projectId: "moviesite-3b722",
  storageBucket: "moviesite-3b722.firebasestorage.app",
  messagingSenderId: "842665193118",
  appId: "1:842665193118:web:d589fba64d951be296158f",
  measurementId: "G-Z1RT4FZMX3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
