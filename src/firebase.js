import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
const firebaseConfig = {
  apiKey: "AIzaSyAWhkA7xDzZ4ygTq-ByrODkSD7U3q7_0nA",
  authDomain: "user-manager-e962f.firebaseapp.com",
  projectId: "user-manager-e962f",
  storageBucket: "user-manager-e962f.appspot.com",
  messagingSenderId: "105030154918",
  
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const functions = getFunctions(app);
export { auth, firestore , app , functions };