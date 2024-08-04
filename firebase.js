// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAXmPlc4c-Pus7hiVoOtmkuNOqAjxAegno",
  authDomain: "headstarter-pantry-app.firebaseapp.com",
  projectId: "headstarter-pantry-app",
  storageBucket: "headstarter-pantry-app.appspot.com",
  messagingSenderId: "913700452045",
  appId: "1:913700452045:web:9ffeb4f49b7b1b31a99b84",
  measurementId: "G-ZTQC304FBL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };