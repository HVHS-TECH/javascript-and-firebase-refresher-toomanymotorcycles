import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-analytics.js";
import { getFirestore, collection as col, addDoc, getDoc as get, getDocs as getm, query, orderBy, limit, Timestamp, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider,  signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
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
var app, analytics, auth, google, db, initialised = false;

try {
    console.info("-------------------------------------\n--- CHAOS DATABASE SOLUTIONS V1.0 ---\n------ COPYRIGHT OF CHAOS INC. ------\n-------------------------------------");
    console.log("CDS: Initialising...");
    app = initializeApp(firebaseConfig);
    analytics = getAnalytics(app);
    db = getFirestore(app);
    auth = getAuth();
    google = new GoogleAuthProvider();
    initialised = true;
   // addDoc(col(db,"events"),{
            //event: `Connection from ${IPdata.ip} initialised.`,
            //timestamp: serverTimestamp()
    //});
    console.log("CDS: Initialisation successful.");
} catch (err) {
    showError("Database failed to load.",err,true);
    console.error(`-!- CDS FATAL ERROR -!-\nInitialisation FAILED\n${err}`);
};

async function update(input) {
    await saveToBase(input,globalThis.user.displayName);
    retrieveFromBase();
}

async function login() {
    console.log("CDS: Signing in with Google...");
    signInWithPopup(auth,google).then((result) => {
        globalThis.user = result.user;
        document.getElementById("accButton").innerHTML = "Logout";
        document.getElementById("loginMsg").innerHTML = `Currently logged in as ${result.user.displayName}`;
        console.log(`CDS: Sign in complete. Signed in as ${result.user.displayName}`);
    }).catch((err) => {
        console.warn(`-!- CDS ERROR -!-\nAuthentication FAILED\n${err}`);
    });
}
async function logout() {
    console.log("CDS: Signing out...");
    signOut(auth).then(() => {
        document.getElementById("accButton").innerHTML = "Login";
        document.getElementById("loginMsg").innerHTML = "Not logged in. Posting as anonymous user.";
        console.log("CDS: Sign out complete.")
    }).catch((err) => {
        showError("An error occured when signing out.",err,false);
        console.error(`-!- CDS ERROR -!-\nSign out FAILED\n${err}`);
    }) 
}

async function accHandler() {
    if (globalThis.user == undefined) {login()} else {logout()}
}

async function saveToBase(input,sender) {
    if (sender == undefined) {sender = "Anonymous"};
    try {
        const newinput = addDoc(col(db,"messages"),{
            message: input,
            sender: sender,
            timestamp: serverTimestamp()
        });
        //addDoc(col(db,"events"),{
            //event: `Message sent from ${IPdata.ip}.`,
            //timestamp: serverTimestamp()
        //});
        console.log(`CDS: Message saved to database with ID ${newinput.id}`);
    } catch(err) {
        //addDoc(col(db,"events"),{
            //event: `Attempt to send message from ${IPdata.ip} failed.`,
            //timestamp: serverTimestamp()
        //});
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
        var loadedMsg;
        console.log("CDS: Retrieval in progress, please wait...");
        const snap = await getm(query(col(db,"messages"),orderBy("timestamp", "desc")));
        console.log("CDS: Retrieval complete. Updating site...");
        snap.forEach((doc) => {
            retrievedData.push({id:doc.id,data:doc.data()});
        });
        console.log("CDS: ", retrievedData);
        document.getElementById("welcomeMessage").innerHTML = retrievedData[0].data.message;
        for (var i=0;i<retrievedData.length;i++) {
            console.log("CDS: Loading message...");
            loadedMsg = document.createElement('p');
            loadedMsg.innerHTML = `<b>${retrievedData[i].data.sender}:</b>\n${retrievedData[i].data.message}\n\n${retrievedData[i].data.timestamp}`;
            document.getElementById("messages").appendChild(loadedMsg);
        }
        console.log("CDS: Update complete. Request completed.");
        //addDoc(col(db,"events"),{
            //event: `Retrieval request from ${IPdata.ip} completed.`,
            //timestamp: serverTimestamp()
        //});
    } catch(err) {
        //addDoc(col(db,"events"),{
            //event: `Retrieval request from ${IPdata.ip} failed.`,
            //timestamp: serverTimestamp()
        //});
        showError("Retrieval from database failed.",err,false);
        console.warn(`-!- CDS ERROR -!-\nRetrieval FAILED\n${err}`);
    }
}

globalThis.update = update;
globalThis.retrieveFromBase = retrieveFromBase;
globalThis.accHandler = accHandler;
retrieveFromBase();
} catch {
    document.getElementById("content").remove();
    showError("You blocked my security trackers, no site for you.","",true);
    console.error(`-!- SECURITY LOCKOUT -!-\nDatabase connection refused and site content deleted.`);
}
