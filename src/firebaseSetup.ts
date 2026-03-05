import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC94Sr8fXXHUOp2SZIV48pfwQg6vqvu1pU",
  authDomain: "bdayer.firebaseapp.com",
  projectId: "bdayer",
  storageBucket: "bdayer.firebasestorage.app",
  messagingSenderId: "1096204332229",
  appId: "1:1096204332229:web:82cdd1667fb0143d2014ac",
  measurementId: "G-R86XGMPHT0"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);