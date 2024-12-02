import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDRKKSFMgcAkHgKOBvBXeytRBkJOzysKiQ",
  authDomain: "intersect-bda16.firebaseapp.com",
  projectId: "intersect-bda16",
  storageBucket: "intersect-bda16.firebasestorage.app",
  messagingSenderId: "204003374268",
  appId: "1:204003374268:web:3fa3c19f23fc05efaa4cb9",
  measurementId: "G-38H1VMYZV4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);