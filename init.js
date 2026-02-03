// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA8eRtuze9y-JNH3Qe7kmMlvSBvvR860uU",
    authDomain: "comp-jkh-test-database.firebaseapp.com",
    projectId: "comp-jkh-test-database",
    storageBucket: "comp-jkh-test-database.firebasestorage.app",
    messagingSenderId: "830402048203",
    appId: "1:830402048203:web:09a0ad62be40801a896b4e",
    measurementId: "G-X9LPN7LXDN"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);