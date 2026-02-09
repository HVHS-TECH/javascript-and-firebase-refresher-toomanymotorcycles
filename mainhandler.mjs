import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-analytics.js";
import { getFirestore, collection as col, doc, addDoc, deleteDoc, getDoc as get, getDocs as getm, query, orderBy, limit, onSnapshot as onSnap, Timestamp, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";
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
var currentDeletionTimeout, app, analytics, auth, google, db, initialised = false;
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
    console.log("CDS: Initialisation complete.");
} catch (err) {
    showError("Database failed to load.",err,true);
    console.error(`-!- CDS FATAL ERROR -!-\nInitialisation FAILED\n${err}`);
};

async function update(input) {
    if (globalThis.user == undefined) {
        saveToBase(input);
    } else if (globalThis.user.email == "23110jk@hvhs.school.nz") {
        saveToBase(input,"<span style='color:goldenrod; text-shadow:1px 1px 11px'>The Administrator</span>",globalThis.user.uid); 
    } else if (globalThis.user.email == "jkessellhaak@gmail.com") {
        saveToBase(input,"<span style='color:darkred; text-shadow:1px 1px 11px'>Mr. Explosive, Supreme Lord of Chaos</span>",globalThis.user.uid);
    } else {
        saveToBase(input,user.displayName,globalThis.user.uid); 
    }
}

async function login() {
    console.log("CDS: Signing in with Google...");
    signInWithPopup(auth,google).then((result) => {
        globalThis.user = result.user;
        document.getElementById("accButton").innerHTML = "Logout";
        if (globalThis.user.email == "23110jk@hvhs.school.nz") {
            document.getElementById("loginMsg").innerHTML = `Currently logged in as ${result.user.displayName}. <b>The system is at your command, Administrator.</b>`; 
        } else if (globalThis.user.email == "jkessellhaak@gmail.com") {
            document.getElementById("loginMsg").innerHTML = `Currently logged in as ${result.user.displayName}. <b>All hail thee, Supreme Lord of Chaos. The system is at your command.</b>`; 
        } else {
            document.getElementById("loginMsg").innerHTML = `Currently logged in as ${result.user.displayName}`;
        }
        console.log(`CDS: Sign in complete. Signed in as ${result.user.displayName} (${result.user.uid})`);
        retrieveFromBase();
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
        console.log("CDS: Sign out complete.");
        retrieveFromBase();
    }).catch((err) => {
        showError("An error occured when signing out.",err,false);
        console.error(`-!- CDS ERROR -!-\nSign out FAILED\n${err}`);
    }) 
}

async function accHandler() {
    if (globalThis.user == undefined) {login()} else {logout()}
}

async function saveToBase(input,sender,uid) {
    document.getElementById("changeinput").value = "";
    if (sender == undefined) {sender = "Anonymous"};
    if (uid == undefined) {uid = 0};
    try {
        await addDoc(col(db,"messages"),{
            message: input,
            sender: sender,
            uid: uid,
            timestamp: serverTimestamp()
        });
        var newMsg = document.createElement('div'), newEntry = document.createElement('li');
        newMsg.className = "pendingMessage";
        newMsg.innerHTML = `<p style="padding-bottom:-10px;"><span id="usrEntry"><b>${sender}</span>:</b><br><span id="msgEntry">${input}</span></p><span id="dteEntry"><p style="font-size:12px;line-height:0%">${Intl.DateTimeFormat('en-GB',{dateStyle: "short", timeStyle: "short", timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone}).format(Timestamp.now().toDate())}</p></span><button class="deletedButton" disabled><h1 style="font-size:40px">...</h1></button>`;
        newEntry.appendChild(newMsg);
        document.getElementById("messages").prepend(newEntry);
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

async function deleteFromBase(id) {
    console.log(`CDS: Deletion timeout for message with`,id,`set.`);
    currentDeletionTimeout = setTimeout(()=>{
        try {
            console.log(`CDS: Deleting message with ID of`,id);
            deleteDoc(doc(db,"messages",id));
            document.querySelector(`[data-entry-id=${id}`).className = "pendingMessage";
            document.querySelector(`[data-entry-id=${id}`).childNodes[2].className = "deletedButton";
            document.querySelector(`[data-entry-id=${id}`).childNodes[2].innerHTML = "<h1>...<\h1>";
            console.log(`CDS: Message deleted.`);
            return Promise.resolve();
        } catch(err) {
            showError("Deletion failed.",err,false);
            console.warn(`-!- CDS ERROR -!-\nMessage deletion FAILED\n${err}`);
            return Promise.reject();
        }
    },2000);
}

async function deletionCancel() {
    if (typeof currentDeletionTimeout != undefined) {
        clearTimeout(currentDeletionTimeout);
        console.log("CDS: Deletion cancelled.");
    }
}

async function checkIfCanDelete() {
    if (globalThis.user == undefined) {console.log("CDS: User is anonymous and cannot delete."); return false;};
    const test = await get(doc(db,"users",globalThis.user.uid));
    if (test.exists()) {
        if (test.data().isAdmin) {
            console.log("CDS: User is an admin.");
            return "ADMIN";
        } else {
            console.log("CDS: User can delete entries that they sent.");
            return "USR:",globalThis.user.displayName;
        }
    } else {
        console.log("CDS: User can delete entries that they sent.");
        return "USR:",globalThis.user.displayName;
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
        var status = await checkIfCanDelete();
        console.log("CDS: Retrieval in progress, please wait...");
        const snap = await getm(query(col(db,"messages"),orderBy("timestamp", "desc")));
        console.log("CDS: Retrieval complete. Updating site...");
        snap.forEach((doc) => {
            retrievedData.push({id:doc.id,data:doc.data()});
        });
        console.log("CDS: ", retrievedData);
        for (var i=0;i<retrievedData.length;i++) {
            console.log("CDS: Loading message...");
            console.log("CDS: ",Intl.DateTimeFormat('en-GB',{dateStyle: "short", timeStyle: "short", timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone}).format(retrievedData[i].data.timestamp.toDate()))
            loadedMsg = document.createElement('div');
            loadedMsg.className = "message";
            loadedMsg.setAttribute('data-entry-id', retrievedData[i].id);
            if (status == "ADMIN" || status == retrievedData[i].data.sender) {
                loadedMsg.innerHTML = `<p style="padding-bottom:-10px;"><span id="usrEntry"><b>${retrievedData[i].data.sender}</span>:</b><br><span id="msgEntry">${retrievedData[i].data.message}</span></p><span id="dteEntry"><p style="font-size:12px;line-height:0%">${Intl.DateTimeFormat('en-GB',{dateStyle: "short", timeStyle: "short", timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone}).format(retrievedData[i].data.timestamp.toDate())}</p></span><button class="deleteButton" onmousedown="deleteFromBase('${retrievedData[i].id}')" onmouseup="deletionCancel()"><h1 style="font-size:40px">X</h1></button>`;
            } else {
                loadedMsg.innerHTML = `<p style="padding-bottom:-10px;"><span id="usrEntry"><b>${retrievedData[i].data.sender}</span>:</b><br><span id="msgEntry">${retrievedData[i].data.message}</span></p><span id="dteEntry"><p style="font-size:12px;line-height:0%">${Intl.DateTimeFormat('en-GB',{dateStyle: "short", timeStyle: "short", timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone}).format(retrievedData[i].data.timestamp.toDate())}</p></span><button class="uselessButton" disabled><h1 style="font-size:40px">Y</h1></button>`;
            }
            loadedMsgs.push(loadedMsg);
        }
        document.getElementById("messages").innerHTML = "";
        for (var i=0;i<loadedMsgs.length;i++) {
            var newEntry = document.createElement('li');
            newEntry.appendChild(loadedMsgs[i]);
            document.getElementById("messages").appendChild(newEntry);
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

function searchSystem() {
    console.log("CDS: Search system triggered.");
  // Declare variables
  var input, filter, ul, li, a, i, txtValue, count = 0;
  input = document.getElementById("searchBar");
  filter = input.value
  ul = document.getElementById("messages");
  li = ul.getElementsByTagName('li');

  // Loop through all list items, and hide those who don't match the search query
  switch(filter.substring(0,5)) {
    case "user:":
        console.log("CDS: User search tag applied. Query:",filter.substring(4));
        document.getElementById("searchBar").setAttribute('style','background-color=#ffc078')
        for (var i = 0;i < li.length;i++) {
            console.log(li[i].childNodes[0].childNodes[0].childNodes[0].childNodes[0])
            a = li[i].childNodes[0].childNodes[0].childNodes[0].childNodes[0];
            txtValue = a.textContent || a.innerText;
            if (txtValue.indexOf(filter.substring(5)) == 0) {
                li[i].style.display = "";
                count ++;
            } else {
                li[i].style.display = "none";
            }
        }
        break;
    case "dtme:":
        console.log("CDS: Datetime search tag applied. Query:",filter.substring(4));
        for (var i = 0;i < li.length;i++) {
            console.log(li[i].childNodes[0].childNodes[1].childNodes[0].childNodes[0])
            filter = input.value.toUpperCase();
            a = li[i].childNodes[0].childNodes[1].childNodes[0].childNodes[0];
            txtValue = a.textContent || a.innerText;
            if (txtValue.toUpperCase().indexOf(filter.substring(5)) > -1) {
                li[i].style.display = "";
                count ++;
            } else {
                li[i].style.display = "none";
            }
        }
        break;
    default:
        console.log("CDS: No tag applied. Query:",filter);
        for (var i = 0;i < li.length;i++) {
            console.log(li[i].childNodes[0].childNodes[0].childNodes[3].childNodes[0])
            filter = input.value.toUpperCase();
            a = li[i].childNodes[0].childNodes[0].childNodes[3].childNodes[0];
            txtValue = a.textContent || a.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
                count ++;
            } else {
                li[i].style.display = "none";
            }
        }
  }
  console.log(`CDS: Search complete. ${count} entries found matching search query of ${filter}`);
}

globalThis.update = update;
globalThis.retrieveFromBase = retrieveFromBase;
globalThis.deleteFromBase = deleteFromBase;
globalThis.deletionCancel = deletionCancel;
globalThis.accHandler = accHandler;
globalThis.searchSystem = searchSystem;

const realtimeUpdater = onSnap(col(db,"messages"),retrieveFromBase);

} catch {
    document.getElementById("content").remove();
    showError("Access denied - security tracker failed to load","",true);
    console.error(`-!- SECURITY LOCKOUT -!-\nDatabase connection refused and site content deleted.`);
}
