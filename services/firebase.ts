
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB5ULtiQgXlqTK2xk8GS68ciRonJ7kDYvI",
  authDomain: "seguidoresexpress-c44df.firebaseapp.com",
  projectId: "seguidoresexpress-c44df",
  storageBucket: "seguidoresexpress-c44df.firebasestorage.app",
  messagingSenderId: "7538143586",
  appId: "1:7538143586:web:3d681c7f92758a6ea5bc3b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
