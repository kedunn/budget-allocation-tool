// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDPGIGZR2MXUV8iVAx50Qofc5XYGGevkbI",
  authDomain: "cpdd-pitch-voting.firebaseapp.com",
  projectId: "cpdd-pitch-voting",
  storageBucket: "cpdd-pitch-voting.appspot.com",
  messagingSenderId: "237282774600",
  appId: "1:237282774600:web:2a1b9fd512a40bc647127d",
  measurementId: "G-73J99DZ0SY"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };