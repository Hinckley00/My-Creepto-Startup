import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAyziGqLVaAJPpblu_3uc9AgFO8oWIlufw",
  authDomain: "creepto-tracker.firebaseapp.com",
  projectId: "creepto-tracker",
  storageBucket: "creepto-tracker.firebasestorage.app",
  messagingSenderId: "233974096400",
  appId: "1:233974096400:web:d201e5e1d26af61e512095",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
