import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDPGIGZR2MXUV8iVAx50Qofc5XYGGevkbI",
  authDomain: "cpdd-pitch-voting.firebaseapp.com",
  projectId: "cpdd-pitch-voting",
  storageBucket: "cpdd-pitch-voting.firebasestorage.app",
  messagingSenderId: "237282774600",
  appId: "1:237282774600:web:c6e3f8e0fc93866a47127d",
  measurementId: "G-E2GZ5TCRQE"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
