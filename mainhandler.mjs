import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-analytics.js";
import { getFirestore, collection as col, addDoc, getDoc as get, getDocs as getm, query, orderBy, limit, onSnapshot as onSnap, Timestamp, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";
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
globalThis.user = undefined;

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
    if (globalThis.user == undefined) {
        saveToBase(input);
    } else if (globalThis.user.email == "23110jk@hvhs.school.nz") {
        saveToBase(input,"<span style='color:goldenrod; text-shadow:1px 1px 11px'>The Administrator</span>"); 
    } else if (globalThis.user.email == "jkessellhaak@gmail.com") {
        saveToBase(input,"<span style='color:darkred; text-shadow:1px 1px 11px'>Mr. Explosive, Supreme Lord of Chaos</span>");
    } else {
        saveToBase(input,user.displayName); 
    }
}

async function login() {
    console.log("CDS: Signing in with Google...");
    signInWithPopup(auth,google).then((result) => {
        globalThis.user = result.user;
        document.getElementById("accButton").innerHTML = "Logout";
        console.log(globalThis.user.email)
        if (globalThis.user.email == "23110jk@hvhs.school.nz") {
            document.getElementById("loginMsg").innerHTML = `Currently logged in as ${result.user.displayName}. <b>The system is at your command, Administrator.</b>`; 
        } else if (globalThis.user.email == "jkessellhaak@gmail.com") {
            document.getElementById("loginMsg").innerHTML = `Currently logged in as ${result.user.displayName}. <b>All hail thee, Supreme Lord of Chaos. The system is at your command.</b>`; 
        } else {
            document.getElementById("loginMsg").innerHTML = `Currently logged in as ${result.user.displayName}`;
        }
        console.log(`CDS: Sign in complete. Signed in as ${result.user.displayName}`);
    }).catch((err) => {
        console.warn(`-!- CDS ERROR -!-\nAuthentication FAILED\n${err}`);
    });
}
async function logout() {
    console.log("CDS: Signing out...");
    signOut(auth).then(() => {
        globalThis.user = undefined;
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
    document.getElementById("changeinput").value = "";
    if (sender == undefined) {sender = "Anonymous"};
    try {
        await addDoc(col(db,"messages"),{
            message: input,
            sender: sender,
            timestamp: serverTimestamp()
        });
        //addDoc(col(db,"events"),{
            //event: `Message sent from ${IPdata.ip}.`,
            //timestamp: serverTimestamp()
        //});
        console.log(`CDS: Message saved to database.`);
        return Promise.resolve();
    } catch(err) {
        //addDoc(col(db,"events"),{
            //event: `Attempt to send message from ${IPdata.ip} failed.`,
            //timestamp: serverTimestamp()
        //});
        showError("Message did not save.",err,false);
        console.warn(`-!- CDS ERROR -!-\nMessage save FAILED\n${err}`);
        return Promise.reject();
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
        var loadedMsgs = [];
        console.log("CDS: Retrieval in progress, please wait...");
        const snap = await getm(query(col(db,"messages"),orderBy("timestamp", "desc")));
        console.log("CDS: Retrieval complete. Updating site...");
        snap.forEach((doc) => {
            retrievedData.push({id:doc.id,data:doc.data()});
        });
        console.log("CDS: ", retrievedData);
        for (var i=0;i<retrievedData.length;i++) {
            console.log("CDS: Loading message...");
            console.log("CES: ",Intl.DateTimeFormat('en-GB',{dateStyle: "short", timeStyle: "short", timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone}).format(retrievedData[i].data.timestamp.toDate()))
            loadedMsg = document.createElement('div');
            loadedMsg.className = "message";
            loadedMsg.innerHTML = `<p style=";padding-bottom:-10px"><b>${retrievedData[i].data.sender}:</b><br>${retrievedData[i].data.message}</p><p style="font-size:12px;line-height:0%">${Intl.DateTimeFormat('en-GB',{dateStyle: "short", timeStyle: "short", timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone}).format(retrievedData[i].data.timestamp.toDate())}</p>`;
            loadedMsgs.push(loadedMsg);
        }
        document.getElementById("messages").innerHTML = "";
        for (var i=0;i<loadedMsgs.length;i++) {
            document.getElementById("messages").appendChild(loadedMsgs[i]);
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
        //showError("Retrieval from database failed.",err,false);
        console.warn(`-!- CDS ERROR -!-\nRetrieval FAILED\n${err}`);
    }
}


globalThis.update = update;
globalThis.retrieveFromBase = retrieveFromBase;
globalThis.accHandler = accHandler;

const realtimeUpdater = onSnap(col(db,"messages"),retrieveFromBase);

} catch {
    document.getElementById("content").remove();
    showError("Access denied - security tracker failed to load","",true);
    console.error(`-!- SECURITY LOCKOUT -!-\nDatabase connection refused and site content deleted.`);
}
