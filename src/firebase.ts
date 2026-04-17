import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAIQqIuzepcyCtog02j1j7WHCwMiyY9f0I",
  authDomain: "cyberpunk-red-db.firebaseapp.com",
  projectId: "cyberpunk-red-db",
  storageBucket: "cyberpunk-red-db.firebasestorage.app",
  messagingSenderId: "646301865906",
  appId: "1:646301865906:web:49c2cedbb05308e5d436ab"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
