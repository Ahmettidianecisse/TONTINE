// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// const firebaseConfig = {
//   apiKey: "AIzaSyDayay9CL8GRjxKjyupEOvOhrb1Suuh-jw",
//   authDomain: "tontine-9ea4a.firebaseapp.com",
//   projectId: "tontine-9ea4a",
//   storageBucket: "tontine-9ea4a.appspot.com",
//   messagingSenderId: "855693297703",
//   appId: "1:855693297703:web:ff841c9933757b57702602"
// };
const firebaseConfig = {
    apiKey: "AIzaSyDayay9CL8GRjxKjyupEOvOhrb1Suuh-jw",
    authDomain: "tontine-9ea4a.firebaseapp.com",
    databaseURL: "https://tontine-9ea4a-default-rtdb.firebaseio.com",
    projectId: "tontine-9ea4a",
    storageBucket: "tontine-9ea4a.firebasestorage.app",
    messagingSenderId: "855693297703",
    appId: "1:855693297703:web:ff841c9933757b57702602"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log("🔥 Firebase initialisé", { auth, db });

export { auth, db };
