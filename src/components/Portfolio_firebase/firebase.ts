import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyARf1zrYhThpY6sm2I2nev2wdXaQBkmsUY",
  authDomain: "wing-fullstack.firebaseapp.com",
  projectId: "wing-fullstack",
  storageBucket: "wing-fullstack.firebasestorage.app",
  messagingSenderId: "934208509886",
  appId: "1:934208509886:web:d004e252620c9f88664bef",
  measurementId: "G-SDMW5NDNTP"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // Add this line
export const db =  getFirestore(app);
