import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5J_WMNbl1sms6dYjq0-1yGZa25BgeMHU",
  authDomain: "starling-learning-1f90c.firebaseapp.com",
  projectId: "starling-learning-1f90c",
  storageBucket: "starling-learning-1f90c.firebasestorage.app",
  messagingSenderId: "889449281433",
  appId: "1:889449281433:web:b3e00e7c85657ac7784508",
  measurementId: "G-N7S1G2Z6GQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
