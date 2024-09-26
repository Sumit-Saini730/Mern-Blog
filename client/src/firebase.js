// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-835b3.firebaseapp.com",
  projectId: "mern-blog-835b3",
  storageBucket: "mern-blog-835b3.appspot.com",
  messagingSenderId: "916447022431",
  appId: "1:916447022431:web:1cc5db5a893998463afaea"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export {app}