// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAFC16nEFpOj2AA9B5C9bqbfBQI_uT-Sng",
  authDomain: "workout-goer.firebaseapp.com",
  projectId: "workout-goer",
  storageBucket: "workout-goer.firebasestorage.app",
  messagingSenderId: "201486488510",
  appId: "1:201486488510:web:6bf3903dcc8b59ebdf9fef",
  measurementId: "G-1K7S5M0VN2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
