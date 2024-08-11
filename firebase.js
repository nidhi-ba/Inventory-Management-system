// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAIFmVP_4kS4GujOLiVDlRKf-lXTZ4HZhw",
  authDomain: "inventory-management-11f28.firebaseapp.com",
  projectId: "inventory-management-11f28",
  storageBucket: "inventory-management-11f28.appspot.com",
  messagingSenderId: "746643120823",
  appId: "1:746643120823:web:ab3541cf713b037b0ba332",
  measurementId: "G-6SQ40PH59T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const firestore = getFirestore(app);

// Check if the code is running on the client-side
if (typeof window !== "undefined") {
  // Initialize Analytics if supported
  isSupported().then((supported) => {
    if (supported) {
      const analytics = getAnalytics(app);
    }
  });
}

// Export the Firestore instance
export { firestore };
