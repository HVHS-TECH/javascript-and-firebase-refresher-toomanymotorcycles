import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-analytics.js";
import { getFirestore, collection as col, addDoc, getDoc as get, getDocs as getm, query, orderBy, limit, Timestamp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";
import { showError } from "./systemAPI.mjs";

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

try {
const IPfetch = await fetch('https://api.ipify.org?format=json');
const IPdata = await IPfetch.json();
// Initialize Firebase
var app, analytics, db, initialised = false;

try {
    console.info("-------------------------------------\n--- CHAOS DATABASE SOLUTIONS V1.0 ---\n------ COPYRIGHT OF CHAOS INC. ------\n-------------------------------------");
    console.log("CDS: Initialising...");
    app = initializeApp(firebaseConfig);
    analytics = getAnalytics(app);
    db = getFirestore(app);
    initialised = true;
    addDoc(col(db,"events"),{
            event: `Connection from ${IPdata.ip} initialised.`,
            timestamp: Timestamp.now()
    });
    console.log("CDS: Initialisation successful.");
} catch (err) {
    showError("Database failed to load.",err,true);
    console.error(`-!- CDS FATAL ERROR -!-\nInitialisation FAILED\n${err}`);
};

async function saveToBase(input,sender) {
    if (sender == undefined) {sender = "Anonymous"};
    try {
        const newinput = addDoc(col(db,"messages"),{
            message: input,
            sender: sender,
            timestamp: Timestamp.now()
        });
        addDoc(col(db,"events"),{
            event: `Message sent from ${IPdata.ip}.`,
            timestamp: Timestamp.now()
        });
        console.log(`CDS: Message saved to database with ID ${newinput.id}`);
    } catch(err) {
        addDoc(col(db,"events"),{
            event: `Attempt to send message from ${IPdata.ip} failed.`,
            timestamp: Timestamp.now()
        });
        showError("Message did not save.",err,false);
        console.warn(`-!- CDS ERROR -!-\nMessage save FAILED\n${err}`);
    }
}

async function retrieveFromBase() {
    try {
        //addDoc(col(db,"events"),{
            //event: `Retrieval request from ${IPdata.ip}.`,
            //timestamp: Timestamp.now()
        //});
        var retrievedData = [];
        console.log("CDS: Retrieval in progress, please wait...");
        const snap = await getm(query(col(db,"messages"),orderBy("timestamp", "desc"),limit(5)));
        console.log("CDS: Retrieval complete. Updating site...");
        snap.forEach((doc) => {
            retrievedData.push({id:doc.id,data:doc.data()});
        });
        console.log("CDS: ", retrievedData)
        //addDoc(col(db,"events"),{
            //event: `Retrieval request from ${IPdata.ip} completed.`,
            //timestamp: Timestamp.now()
        //});
    } catch(err) {
        //addDoc(col(db,"events"),{
            //event: `Retrieval request from ${IPdata.ip} failed.`,
            //timestamp: Timestamp.now()
        //});
        showError("Retrieval from database failed.",err,false);
        console.warn(`-!- CDS ERROR -!-\nRetrieval FAILED\n${err}`);
    }
}

globalThis.saveToBase = saveToBase;
retrieveFromBase();
} catch {
    document.getElementById("content").remove();
    showError("You blocked my security trackers, no site for you.","",true);
    console.error(`-!- SECURITY LOCKOUT -!-\nDatabase connection refused and site content deleted.`);
}
