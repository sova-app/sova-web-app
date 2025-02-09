// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBaR9pn-CFqCoeeelBbzVNM6zb63X2qypQ",
  authDomain: "sova-mvp.firebaseapp.com",
  projectId: "sova-mvp",
  storageBucket: "sova-mvp.appspot.com",
  messagingSenderId: "912659550514",
  appId: "1:912659550514:web:1dd6178c9a06922407472b",
  measurementId: "G-1QXLFFFB76",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const firebaseApp = app;
